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

  // //Filter toggle for small screens
  // $('.js-filter-toggle').on('click', function(e) {
  //   e.preventDefault();
  //   $('body').toggleClass('filter-is-open');
  // });

  //Search drop prototype
  $('.search__input').focus(function() {
    $(this)
      .closest('.search')
      .find('.has-search__drop')
      .addClass('is-visible');
  });
  $('.search__input').focusout(function() {
    $(this)
      .closest('.search')
      .find('.has-search__drop')
      .removeClass('is-visible');
  });

  //Select replacement
  $('select').minimalect();

  // //Profile Drop
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
});

//WINDOW ONLOAD
$(window).load(function() {
  'use strict';

  $(window).on('resize', function() {
    $('body').removeClass('filter-is-open');
  }).trigger('resize');

});
