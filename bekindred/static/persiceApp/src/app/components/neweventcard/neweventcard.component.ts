/// <reference path="../../../typings/_custom.d.ts" />
import {Component, EventEmitter, NgZone} from 'angular2/angular2';

import {RemodalDirective} from '../../directives/remodal.directive';
import {SelectDirective} from '../../directives/select.directive';
import {EventService} from '../../services/event.service';

import {EventModel} from '../../models/event.model';
import {NotificationComponent} from '../notification/notification.component';

declare var jQuery: any;

let view = require('./neweventcard.html');

@Component({
  outputs: ['onClick'],
  selector: 'newevent-card',
  template: view,
  directives: [RemodalDirective, SelectDirective, NotificationComponent],
  providers: [EventService]
})
export class NewEventCardComponent {

  onClick: EventEmitter<any> = new EventEmitter;
  model;
  showErrors: boolean = true;
  message: string = 'Please enter all required fields.';

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
    this.model = new EventModel(
      '',
      '',
      '45.8248713,16.149078199999963',
      11,
      'connections'
    );
  }

  userClicked() {
    this.onClick.next(true);
  }

  saveEvent(event) {
    console.log('Save event');
    this.showErrors = false;
    this.service.create(this.model).subscribe((res) => {
      console.log('Saving event success');
      this.showErrors = false;
    }, (err) => {
      console.log('Saving event error');
      this.showErrors = true;
    }, () => {
      console.log('Saving event completed');
      this.showErrors = false;
    });
  }

  changeOpenTo(event) {
    this.model.access_level = event;
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

}




