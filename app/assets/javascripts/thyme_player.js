/* returns the jQuery object of all metadata elements that start after the
   given time in seconds */
function metadataAfter(seconds) {
  const metaList = document.getElementById('metadata');
  const times = JSON.parse(metaList.dataset.times);
  if (times.length === 0) {
    return $();
  }
  let i = 0;
  while (i < times.length) {
    if (times[i] > seconds) {
      const $nextMeta = $('#m-' + $.escapeSelector(times[i]));
      return $nextMeta.add($nextMeta.nextAll());
    }
    ++i;
  }
  return $();
};

/* returns the jQuery object of all metadata elements that start before the
   given time in seconds */
function metadataBefore(seconds) {
  return $('[id^="m-"]').not(metadataAfter(seconds));
};

/* for a given time, show all metadata elements that start before this time
   and hide all that start later */
function metaIntoView(time) {
  metadataAfter(time).hide();
  const $before = metadataBefore(time);
  $before.show();
  const previousLength = $before.length;
  if (previousLength > 0) {
    $before.get(previousLength - 1).scrollIntoView();
  }
};

// set up everything: read out track data and initialize html elements
function setupHypervideo() {
  const $metaList = $('#metadata');
  const video = $('#video').get(0);
  if (video === null) {
    return;
  }
  const metadataElement = $('#video track[kind="metadata"]').get(0);

  // set up the metadata elements
  function displayMetadata() {
    if (metadataElement.readyState === 2 && (metaTrack = metadataElement.track)) {
      metaTrack.mode = 'hidden';
      let i = 0;
      let times = [];
      // read out the metadata track cues and generate html elements for
      // metadata, run katex on them
      while (i < metaTrack.cues.length) {
        const cue = metaTrack.cues[i];
        const meta = JSON.parse(cue.text);
        const start = cue.startTime;
        times.push(start);
        const $listItem = $('<li/>', {
          id: 'm-' + start
        });
        $listItem.hide();
        const $link = $('<a/>', {
          text: meta.reference,
          "class": 'item',
          id: 'l-' + start
        });
        const $videoIcon = $('<i/>', {
          text: 'video_library',
          "class": 'material-icons'
        });
        const $videoRef = $('<a/>', {
          href: meta.video,
          target: '_blank'
        });
        $videoRef.append($videoIcon);
        if (meta.video === null) {
          $videoRef.hide();
        }
        const $manIcon = $('<i/>', {
          text: 'library_books',
          "class": 'material-icons'
        });
        const $manRef = $('<a/>', {
          href: meta.manuscript,
          target: '_blank'
        });
        $manRef.append($manIcon);
        if (meta.manuscript === null) {
          $manRef.hide();
        }
        const $scriptIcon = $('<i/>', {
          text: 'menu_book',
          "class": 'material-icons'
        });
        const $scriptRef = $('<a/>', {
          href: meta.script,
          target: '_blank'
        });
        $scriptRef.append($scriptIcon);
        if (meta.script === null) {
          $scriptRef.hide();
        }
        const $quizIcon = $('<i/>', {
          text: 'videogame_asset',
          "class": 'material-icons'
        });
        const $quizRef = $('<a/>', {
          href: meta.quiz,
          target: '_blank'
        });
        $quizRef.append($quizIcon);
        if (meta.quiz === null) {
          $quizRef.hide();
        }
        const $extIcon = $('<i/>', {
          text: 'link',
          "class": 'material-icons'
        });
        const $extRef = $('<a/>', {
          href: meta.link,
          target: '_blank'
        });
        $extRef.append($extIcon);
        if (meta.link === null) {
          $extRef.hide();
        }
        const $description = $('<div/>', {
          text: meta.text,
          "class": 'mx-3'
        });
        const $explanation = $('<div/>', {
          text: meta.explanation,
          "class": 'm-3'
        });
        const $details = $('<div/>');
        $details.append($link).append($description).append($explanation);
        $icons = $('<div/>', {
          style: 'flex-shrink: 3; display: flex; flex-direction: column;'
        });
        $icons.append($videoRef).append($manRef).append($scriptRef).append($quizRef).append($extRef);
        $listItem.append($details).append($icons);
        $metaList.append($listItem);
        $videoRef.on('click', function() {
          video.pause();
        });
        $manRef.on('click', function() {
          video.pause();
        });
        $extRef.on('click', function() {
          video.pause();
        });
        $link.on('click', function() {
          //displayBackButton();
          video.currentTime = this.id.replace('l-', '');
        });
        metaElement = $listItem.get(0);
        thymeUtility.renderLatex(metaElement);
        ++i;
      }
      // store metadata start times as data attribute
      $metaList.get(0).dataset.times = JSON.stringify(times);
      // if user jumps to a new position in the video, display all metadata
      // that start before this time and hide all that start later
      $(video).on('seeked', function() {
        const time = video.currentTime;
        metaIntoView(time);
      });
      // if the metadata cue changes, highlight all current media and scroll
      // them into view
      $(metaTrack).on('cuechange', function() {
        let j = 0;
        const time = video.currentTime;
        $('#metadata li').removeClass('current');
        while (j < this.activeCues.length) {
          const activeStart = this.activeCues[j].startTime;
          let metalink;
          if (metalink = document.getElementById('m-' + activeStart)) {
            $(metalink).show();
            $(metalink).addClass('current');
          }
          ++j;
        }
        const currentLength = $('#metadata .current').length;
        if (currentLength > 0) {
          $('#metadata .current').get(length - 1).scrollIntoView();
        }
      });
    }
  };
};

$(document).on('turbolinks:load', function() {
  /*
    VIDEO INITIALIZATION
   */
  // exit script if the current page has no thyme player
  const thymeContainer = document.getElementById('thyme-container');
  if (thymeContainer === null || $('#video').get(0) === null) {
    return;
  }

  // background color
  document.body.style.backgroundColor = 'black';

  // initialize attributes
  const thyme = document.getElementById('thyme');
  const video = document.getElementById('video');
  thymeAttributes.video = video;
  thymeAttributes.mediumId = thyme.dataset.medium;
  thymeAttributes.markerBarId = 'markers';




  /*
    COMPONENTS
   */
  // Buttons
  const annotationsToggle = new AnnotationsToggle('annotations-toggle');
  annotationsToggle.add();
  (new EmergencyButton('emergency-button')).add();
  (new FullScreenButton('full-screen', thymeContainer)).add();
  (new MinusTenButton('minus-ten')).add();
  (new MuteButton('mute')).add();
  (new NextChapterButton('next-chapter')).add();
  (new PlayButton('play-pause')).add();
  (new PlusTenButton('plus-ten')).add();
  (new PreviousChapterButton('previous-chapter')).add();
  (new SpeedSelector('speed')).add();
  // initialize iaButton here to have the reference but call add() later
  // when we can define toHide (second argument which is set to null here)
  const iaButton = new IaButton('ia-active', null, [$(video), $('#video-controlBar')], '82%');
  // Sliders
  (new VolumeBar('volume-bar')).add();
  seekBar = new SeekBar('seek-bar');
  seekBar.add();
  seekBar.addChapterTooltips();



  /*
    ANNOTATION FUNCTIONALITY
   */
  // annotation manager and area
  function colorFunc(annotation) {
    return annotation.color;
  }
  function isValid(annotation) {
    if (annotationsToggle.getValue() === false) {
      const currentUserId = thyme.dataset.currentUserId;
      if (annotation.userId != currentUserId) {
        return false;
      }
    }
    return true;
  }
  const annotationArea = new AnnotationArea(true, colorFunc, isValid);
  thymeAttributes.annotationArea = annotationArea;
  function strokeColorFunc(annotation) {
    return 'black';
  }
  function sizeFunc(annotation) {
    return false;
  }
  function onClick(annotation) {
    $('#caption').hide();
    annotationArea.update(annotation);
    annotationArea.show();
  }
  function onUpdate() { }
  const annotationManager = new AnnotationManager(colorFunc, strokeColorFunc, sizeFunc,
                                                  onClick, onUpdate, isValid);
  thymeAttributes.annotationManager = annotationManager;
  // onShow and onUpdate definition for the annotation area
  function onShow() {
    iaButton.plus();
    annotationManager.updateMarkers();
  }
  function onHide() {
    iaButton.minus();
    annotationManager.updateMarkers();
    resizeContainer();
  }
  annotationArea.onShow = onShow;
  annotationArea.onHide = onHide;

  // Update annotations after submitting the annotations form
  $(document).on('click', '#submit-button', function() {
    /* NOTE:
       Updating might take some time on the backend,
       so I added a slight delay.
       I couldn't think of an easy way to let the script
       wait for the update to complete (as with the delete button),
       but it might be possible! */
    setTimeout(function() {
      annotationManager.updateAnnotations();
    }, 500);
  });

  // Update annotations after deleting an annotation
  $(document).on('click', '#delete-button', function() {
    const annotationId = Number(document.getElementById('annotation_id').textContent);
    $.ajax(Routes.annotation_path(annotationId), {
      type: 'DELETE',
      dataType: 'json',
      data: {
        annotationId: annotationId
      },
      success: function() {
        annotationManager.updateAnnotations();
        $('#annotation-close-button').click();
      }
    });
  });



  /*
    CHAPTER MANAGER
   */
  const chapterManager = new ChapterManager();
  thymeAttributes.chapterManager = chapterManager;



  /*
    INTERACTIVE AREA
   */
  iaButton.toHide = [$('#caption'), annotationArea];
  iaButton.add();
  (new IaCloseButton('ia-close', iaButton)).add();
  //TODO
  //const interactiveArea = new InteractiveArea();
  //thymeAttributes.interactiveArea = interactiveArea;



  /*
    RESIZE
   */
  // Manage large and small display
  function largeDisplayFunc() {
    video.style.width = '82%';
    if (iaButton.status === 'false') {
      $('#caption').hide();
      $('#annotation-caption').hide();
      video.style.width = '100%';
      $('#video-controlBar').css('width', '100%');
      $(window).trigger('resize');
    }
  }
  const elements = [$('#caption'), $('#annotation-caption'), $('#video-controlBar')];
  const displayManager = new DisplayManager(elements, largeDisplayFunc);

  // resizes the thyme container to the window dimensions, taking into account
  // whether the interactive area is displayed or hidden
  function resizeContainer() {
    const factor = $('#caption').is(':hidden') && $('#annotation-caption').is(':hidden') ? 1 : 1 / 0.82;
    resize.resizeContainer(thymeContainer, factor);
    if (thymeAttributes.annotations === null) {
      annotationManager.updateAnnotations();
    } else {
      annotationManager.updateMarkers();
    }
  };



  /*
    KEYBOARD SHORTCUTS
   */
  thymeKeyShortcuts.addGeneralShortcuts();
  thymeKeyShortcuts.addPlayerShortcuts();



  /*
    MISC
   */
  // auto show/hide control bar
  const controlBarHider = new ControlBarHider('video-controlBar', 3000);
  controlBarHider.install();

  thymeUtility.playOnClick();
  thymeUtility.setUpMaxTime('max-time');

  // detect IE/edge and inform user that they are not suppported if necessary,
  // only use browser player
  if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    alert($('body').data('badbrowser'));
    $('#caption').hide();
    $('#annotation-caption').hide();
    $('#video-controlBar').hide();
    video.style.width = '100%';
    video.controls = true;
    resizeContainer();
    window.onresize = resizeContainer;
    return;
  }

  setupHypervideo();

  function updateControlBarType() {
    displayManager.updateControlBarType();
  };

  updateControlBarType();

  window.onresize = resizeContainer;
  video.onloadedmetadata = resizeContainer;

});