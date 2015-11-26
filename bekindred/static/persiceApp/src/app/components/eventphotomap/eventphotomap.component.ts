/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./eventphotomap.html');

declare var jQuery: any;
declare var google: any;

@Component({
  selector: 'event-photomap',
  template: view
})
export class EventPhotoMapComponent {
  @Input() location;
  @Input() photo;
  @Input() stats;

  afterViewInit() {

    //TABS
    jQuery('.event-photo-map__switch li').click(function() {
      let tabId = jQuery(this).attr('data-tab');
      jQuery(this)
        .closest('.event-photo-map')
        .find('.event-photo-map__switch li')
        .removeClass('is-current');
      jQuery(this)
        .closest('.event-photo-map')
        .find('.tab-content')
        .removeClass('is-current');
      jQuery(this).addClass('is-current');
      jQuery('#' + tabId).addClass('is-current');
    });

    this.initMap();
  }


  initMap() {

  }
}
