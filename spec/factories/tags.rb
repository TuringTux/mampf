require 'faker'

FactoryGirl.define do
  factory :tag, aliases: [:related_tag] do
    title { Faker::Company.bs + ' ' + Random.rand(1..999).to_s}
    trait :with_related_tags do
      after(:build) { |t| t.related_tags = create_list(:tag, 2) }
    end
  end
end
