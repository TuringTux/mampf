import FactoryBot from "../support/factorybot";

const ROLES = ["tutor", "editor", "teacher", "speaker"];

function createLectureScenario(context, type = "lecture") {
  cy.createUserAndLogin("teacher").as("teacher");

  cy.then(() => {
    FactoryBot.create(type, "with_teacher_by_id", { teacher_id: context.teacher.id }).as("lecture");
  });

  cy.then(() => {
    cy.visit(`/lectures/${context.lecture.id}/edit`);
    cy.getBySelector("people-tab-btn").click();
  });

  cy.i18n("basics.vouchers").as("vouchers");
}

function testCreateVoucher(role) {
  cy.getBySelector(`create-${role}-voucher-btn`).click();

  cy.then(() => {
    cy.getBySelector(`${role}-voucher-data`).should("be.visible");
    cy.getBySelector(`${role}-voucher-secure-hash`).should("not.be.empty");
    cy.getBySelector(`invalidate-${role}-voucher-btn`).should("be.visible");
  });
}

function testInvalidateVoucher(role) {
  cy.getBySelector(`invalidate-${role}-voucher-btn`).click();

  // Confirm popup
  cy.on("window:confirm", () => true);

  cy.then(() => {
    cy.getBySelector(`${role}-voucher-data`).should("not.exist");
    cy.getBySelector(`invalidate-${role}-voucher-btn`).should("not.exist");
    cy.getBySelector(`create-${role}-voucher-btn`).should("be.visible");
  });
}

describe("If the lecture is not a seminar", () => {
  beforeEach(function () {
    createLectureScenario(this);
  });

  describe("People tab in lecture edit page", () => {
    it("shows buttons for creating tutor, editor and teacher vouchers", function () {
      cy.contains(this.vouchers).should("be.visible");

      ROLES.filter(role => role !== "speaker").forEach((role) => {
        cy.getBySelector(`create-${role}-voucher-btn`).should("be.visible");
      });

      cy.getBySelector("create-speaker-voucher-btn").should("not.exist");
    });

    it("displays the voucher and invalidate button after the create button is clicked", function () {
      ROLES.filter(role => role !== "speaker").forEach((role) => {
        testCreateVoucher(role);
      });
    });

    it("displays that there is no active voucher after the invalidate button is clicked", function () {
      ROLES.filter(role => role !== "speaker").forEach((role) => {
        testCreateVoucher(role);
        testInvalidateVoucher(role);
      });
    });
  });
});

describe("If the lecture is a seminar", () => {
  beforeEach(function () {
    createLectureScenario(this, "seminar");
  });

  describe("People tab in lecture edit page", () => {
    it("shows buttons for creating tutor, editor, teacher, and speaker vouchers", function () {
      cy.contains(this.vouchers).should("be.visible");
      ROLES.forEach((role) => {
        cy.getBySelector(`create-${role}-voucher-btn`).should("be.visible");
      });
    });

    it("displays the voucher and invalidate button after the create button is clicked", function () {
      ROLES.forEach((role) => {
        testCreateVoucher(role);
      });
    });

    it("displays that there is no active voucher after the invalidate button is clicked", function () {
      ROLES.forEach((role) => {
        testCreateVoucher(role);
        testInvalidateVoucher(role);
      });
    });
  });
});