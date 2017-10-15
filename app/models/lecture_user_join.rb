# LectureUserJoin class
# JoinTable for lecture <-> user many-to-many-relation
class LectureUserJoin < ApplicationRecord
  belongs_to :lecture
  belongs_to :user
end
