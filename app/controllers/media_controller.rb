class MediaController < ApplicationController
  before_action :set_medium, only: [:show]
  authorize_resource

  def index
    if params[:lecture_id] && params[:module_id]
      @lecture = Lecture.find_by_id(params[:lecture_id])
      case params[:module_id].to_i
      when 1
         @media = Medium.where(teachable: @lecture.lessons, sort: 'Kaviar')
      when 2
         @media = @media = Medium.where(teachable: @lecture, sort: 'Sesam')
      when 3
        @media = @media = Medium.where(teachable: @lecture.course, sort: 'KeksQuestion')
      end
    else
      @media = Medium.all
    end
  end

  def show
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_medium
    @medium = Medium.find_by_id(params[:id])
    if !@medium.present?
      redirect_to :root, alert: 'Medium with requested id was not found.'
    end
  end
end
