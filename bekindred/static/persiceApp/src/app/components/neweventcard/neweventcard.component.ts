/// <reference path="../../../typings/_custom.d.ts" />
import {Component, EventEmitter, NgZone} from 'angular2/angular2';

import {RemodalDirective} from '../../directives/remodal.directive';
import {SelectDirective} from '../../directives/select.directive';
import {EventService} from '../../services/event.service';

declare var jQuery: any;

let view = require('./neweventcard.html');

@Component({
  outputs: ['onClick'],
  selector: 'newevent-card',
  template: view,
  directives: [RemodalDirective, SelectDirective],
  providers: [EventService]
})
export class NewEventCardComponent {

  onClick: EventEmitter<any> = new EventEmitter;
  event = {
    user: '',
    description: '',
    ends_on: '',
    location: '',
    name: '',
    repeat: '',
    starts_on: '',
    street: '',
    city: '',
    zipcode: null,
    state: '',
    full_address: '',
    location_name: '',
    country: '',
    max_attendees: '',
    event_photo: '',
    access_level: 'connections',
    access_user_list: []
  };

  openTo: Array<Object> = [
    {
      'label': 'Only my connections (default)',
      'value': 'connections',
      'selected': true
    },
    {
      'label': 'Public (all Persice users)',
      'value': 'public',
      'selected': false
    },
    {
      'label': 'Private (only invited)',
      'value': 'private',
      'selected': false
    }
  ];

  constructor(private service: EventService) {

  }

  userClicked() {
    this.onClick.next(true);
  }

  saveEvent(event) {
    console.log('Save event');
  }

  changeOpenTo(event) {

  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

}




