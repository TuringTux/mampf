class Voucher < ApplicationRecord
  SORT_HASH = { tutor: 0, editor: 1, teacher: 2, speaker: 3 }.freeze
  SPEAKER_EXPIRATION_DAYS = 30
  TUTOR_EXPIRATION_DAYS = 14
  DEFAULT_EXPIRATION_DAYS = 3

  enum sort: SORT_HASH

  belongs_to :lecture, touch: true
  before_create :generate_secure_hash
  has_many :redemptions, dependent: :destroy

  before_create :add_expiration_datetime
  before_create :ensure_no_other_active_voucher
  before_create :ensure_speaker_vouchers_only_for_seminars
  validates :sort, presence: true

  scope :active, lambda {
                   where("expires_at > ? AND invalidated_at IS NULL",
                         Time.zone.now)
                 }
  scope :for_tutors, -> { where(sort: :tutor) }
  scope :for_editors, -> { where(sort: :editor) }

  self.implicit_order_column = "created_at"

  def self.sorts_for_lecture(lecture)
    return SORT_HASH.keys if lecture.seminar?

    SORT_HASH.keys - [:speaker]
  end

  def self.check_voucher(secure_hash)
    Voucher.active.find_by(secure_hash: secure_hash)
  end

  def invalidate!
    update(invalidated_at: Time.zone.now)
  end

  private

    def generate_secure_hash
      self.secure_hash = SecureRandom.hex(16)
    end

    def add_expiration_datetime
      self.expires_at = created_at + expiration_days.days
    end

    def ensure_no_other_active_voucher
      return unless lecture
      return unless lecture.vouchers.where(sort: sort).active.any?

      errors.add(:sort,
                 I18n.t("activerecord.errors.models.voucher.attributes.sort." \
                        "only_one_active"))
      throw(:abort)
    end

    def ensure_speaker_vouchers_only_for_seminars
      return unless speaker?
      return if lecture.seminar?

      errors.add(:sort,
                 I18n.t("activerecord.errors.models.voucher.attributes.sort." \
                        "speaker_vouchers_only_for_seminars"))
      throw(:abort)
    end

    def expiration_days
      return SPEAKER_EXPIRATION_DAYS if speaker?
      return TUTOR_EXPIRATION_DAYS if tutor?

      DEFAULT_EXPIRATION_DAYS
    end
end