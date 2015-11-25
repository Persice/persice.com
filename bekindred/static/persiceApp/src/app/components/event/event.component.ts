/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {Response} from 'angular2/http';

import {EventDescriptionComponent} from '../eventdescription/eventdescription.component';
import {EventHostComponent} from '../eventhost/eventhost.component';
import {EventInfoComponent} from '../eventinfo/eventinfo.component';
import {EventPeopleComponent} from '../eventpeople/eventpeople.component';
import {EventPhotoMapComponent} from '../eventphotomap/eventphotomap.component';
import {EventDiscussionComponent} from '../eventdiscussion/eventdiscussion.component';

import {EventService} from '../../services/event.service';

let view = require('./event.html');

@Component({
  selector: 'event',
  template: view,
  directives: [
    EventInfoComponent,
    EventHostComponent,
    EventDescriptionComponent,
    EventPeopleComponent,
    EventPhotoMapComponent,
    EventDiscussionComponent
  ],
  providers: [EventService]
})
export class EventComponent {
  event = {};
  eventId;

  constructor(params: RouteParams, private service: EventService) {
    this.eventId = params.get('eventId');
  }

  onInit() {
    this.getEventDetails(this.eventId);
  }


  getEventDetails(id) {
    this.service.findOneById(id).subscribe((res: Response) => {
      console.log(res);
      this.event = res;
    });
  }

}
