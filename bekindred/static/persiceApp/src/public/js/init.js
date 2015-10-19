/* global $ */

//ON DOCUMENT READY
$(document).ready(function() {
  'use strict';

  $('.match-percent-large').circleProgress({
    value: 0.75,
    size: 246,
    thickness: 4,
    fill: {
      color: '#39c9f5'
    }
  });


  //Sick slider
  $('.match-profile__avatar').slick({
    arrows: false,
    dots: true,
    appendDots: $('.match-profile__avatar-nav')
  });

  $('.js-slide-likes').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1
  });

  $('.js-slide-mutuals').slick({
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1
  });

  $(document).on('opened', '.remodal', function() {
    $('.modal-gallery__images').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      adaptiveHeight: true,
      fade: true,
      asNavFor: '.modal-gallery__thumbs'
    });
    $('.modal-gallery__thumbs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: '.modal-gallery__images',
      centerMode: true,
      focusOnSelect: true
    });
    console.log('Modal is opened');
  });



  //Multiple line content ellipsis
  $('.truncate').dotdotdot({
    watch: 'window'
  });

  //TABS
  $('.event-photo-map__switch li').click(function() {
    var tabId = $(this).attr('data-tab');
    $(this)
    .closest('.event-photo-map')
    .find('.event-photo-map__switch li')
    .removeClass('is-current');
    $(this)
    .closest('.event-photo-map')
    .find('.tab-content')
    .removeClass('is-current');
    $(this).addClass('is-current');
    $('#' + tabId).addClass('is-current');
  });
});

//WINDOW ONLOAD
$(window).load(function() {
  'use strict';

  $(window).on('resize', function() {
    $('body').removeClass('filter-is-open');
  }).trigger('resize');

});
