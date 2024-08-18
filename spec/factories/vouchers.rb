FactoryBot.define do
  factory :voucher do
    sort { :tutor }
    association :lecture

    trait :tutor do
      sort { :tutor }
    end

    trait :editor do
      sort { :editor }
    end

    trait :teacher do
      sort { :teacher }
    end

    trait :expired do
      after(:create) do |voucher|
        voucher.update(expires_at: 1.day.ago)
      end
    end

    trait :invalidated do
      invalidated_at { 1.day.ago }
    end
  end
end