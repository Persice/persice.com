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

import {DateUtil, EventUtil} from '../../core/util';

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
  info = {
    name: '',
    city: '',
    location_name: '',
    state: '',
    distance: '',
    openTo: '',
    startDate: {
      hour: '',
      day: '',
      month: '',
      year: ''
    },
    repeat: 'Repeats Weekly',
    timezone: DateUtil.localTimezone()
  };
  people = [];
  photo: string = '/static/img/placeholder-image.png';
  location = {};
  stats = {
    maxAttendees: 0,
    friendsCount: 0,
    score: 0
  };
  eventId;

  constructor(params: RouteParams, private service: EventService) {
    this.eventId = params.get('eventId');
  }

  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getEventDetails(this.eventId);
  }


  getEventDetails(id) {
    this.service.findOneById(id).subscribe((data) => {
      this.assignEvent(data);
    });
  }

  assignEvent(res) {
    let resp = res;
    this.event = resp;
    this.info = {
      name: resp.name,
      city: resp.city,
      location_name: resp.location_name,
      state: resp.state,
      distance: '6 miles',
      openTo: EventUtil.accessLevel(resp.access_level),
      startDate: {
        hour: DateUtil.format(resp.starts_on, 'h A'),
        day: DateUtil.format(resp.starts_on, 'D'),
        month: DateUtil.format(resp.starts_on, 'MMM'),
        year: DateUtil.format(resp.starts_on, 'YYYY')
      },
      repeat: 'Repeats Weekly',
      timezone: DateUtil.localTimezone()
    };

    if (resp.event_photo !== null) {
      this.photo = resp.event_photo;
    }

    this.stats = {
      maxAttendees: resp.max_attendees,
      friendsCount: resp.friend_attendees_count,
      score: resp.cumulative_match_score
    };

  }

  goBack(event) {
    window.history.back();
  }



}
