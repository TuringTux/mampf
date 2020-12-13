FactoryBot.define do
  factory :course do
    title { Faker::Book.title + ' ' +
            Faker::Number.between(from: 1, to: 999).to_s }
    short_title { Faker::Book.title + ' ' +
                  Faker::Number.between(from: 1, to: 999).to_s }

    transient do
      tag_count { 3 }
    end

    trait :term_independent do
      term_independent { true }
    end

    trait :with_organizational_stuff do
      organizational { true }
      organizational_concept { Faker::ChuckNorris.fact }
    end

    trait :locale_de do
      locale { 'de'}
    end

    # call it with build(:course, :with_tags, tag_count: n) if you want
    # n tags associated to the course
    # omitting tag_count yields default of 3 tags
    trait :with_tags do
      after(:build) do |course, evaluator|
        course.tags = FactoryBot.create_list(:tag, evaluator.tag_count)
      end
    end
  end
end
