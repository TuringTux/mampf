# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).on 'turbolinks:load', ->
  $('#lectureCarousel').on 'slid.bs.carousel', (evt) ->
    term = evt.relatedTarget.dataset.term
    teacher = evt.relatedTarget.dataset.teacher
    $('#lecture-term').empty().append(term)
    $('#lecture-teacher').empty().append(teacher)
    return

  $('.selectize').selectize()

  $('#course-form :input').on 'change', ->
    $('#course-basics-warning').show()
    $('#course-basics-cancel').show()
    $('#course-basics-options').show()
    return

  $('#course-basics-cancel').on 'click', ->
    location.reload()
    return
  return
