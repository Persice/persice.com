/* global $ */

//ON DOCUMENT READY
$(document).ready(function() {
  'use strict';

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

  //Date picker
  $('.datepicker').pickadate({
    format: 'dd/mm/yyyy'
  });

  $('.timepicker').pickatime();


  //Search tag
  $('.search-tag').on('click', function() {
    $(this).toggleClass('is-current');
  });


  $('body').on('mouseup', '.irs-slider', function() {
    $(this).removeClass('state_hover');
  })
  .on('mousedown', '.irs-slider', function() {
    $(this).addClass('state_hover');
  });

  //Match height init
  $('.js-match-height-1').matchHeight({
    byRow: false
  });


  //Keyword focus
  $('.js-c-input-keywords').on('focus', function() {
    $(this)
    .closest('.c-input-icon-holder')
    .addClass('is-focused');
  });
  $('.js-c-input-keywords').on('blur', function() {
    $(this)
    .closest('.c-input-icon-holder')
    .removeClass('is-focused');
  });

  $('.filter__item--keywords__btn').on('click', function(e) {
    e.preventDefault();
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
