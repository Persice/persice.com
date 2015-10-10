/* global $ */

//ON DOCUMENT READY
$(document).ready(function() {
  'use strict';

  // $('.match-percent').circleProgress({
  //   value: 0.75,
  //   size: 128,
  //   thickness: 2,
  //   fill: {
  //     color: '#6dcbe8'
  //   }
  // });

  $('.match-percent-large').circleProgress({
    value: 0.75,
    size: 246,
    thickness: 4,
    fill: {
      color: '#6dcbe8'
    }
  });

  //Filter toggle for small screens
  // $('.js-filter-toggle').on('click', function(e) {
  //   e.preventDefault();
  //   $('body').toggleClass('filter-is-open');
  // });

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

  // //Search drop prototype
  // $('.search__input').focus(function() {
  //   $(this)
  //     .closest('.search')
  //     .find('.has-search__drop')
  //     .addClass('is-visible');
  // });
  // $('.search__input').focusout(function() {
  //   $(this)
  //     .closest('.search')
  //     .find('.has-search__drop')
  //     .removeClass('is-visible');
  // });

  //Select replacement
  $('select').minimalect();

  //Profile Drop
  // $('.profile-drop__arrow').click(function() {
  //   $('.profile-drop__expand').slideToggle();
  // });

  //Multiple line content ellipsis
  $('.truncate').dotdotdot({
    watch: 'window'
  });

  //Range slider
  $('.range').ionRangeSlider({
    // jscs:disable
    hide_min_max: true,
    // jscs:enable
    keyboard: true,
    min: 0,
    max: 5000,
    from: 1000,
    to: 4000,
    type: 'double',
    step: 1
  });

  $('.range-to').ionRangeSlider({
    // jscs:disable
    hide_min_max: true,
    // jscs:enable
    keyboard: true
  });

  //INIT IMGLIQUID used for images streching
  // $('.js-image-liquid').imgLiquid({
  //   fill: true,
  //   horizontalAlign: 'center',
  //   verticalAlign: 'center'
  // });

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
