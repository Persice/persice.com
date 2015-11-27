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

import {UserService} from '../../services/user.service';
import {EventService} from '../../services/event.service';
import {EventMembersService} from '../../services/eventmembers.service';

import {DateUtil, EventUtil, CookieUtil, UserUtil} from '../../core/util';

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
  providers: [EventService, EventMembersService]
})
export class EventComponent {
  event = {};
  isHost: boolean = false;
  rsvpStatus: string;
  authUserUri: string;
  memberExists: boolean = false;
  member;
  host;
  userInfo = {
    name: '',
    description: '',
    distance: '',
    gender: '',
    age: '',
    image: ''
  };
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

  constructor(
    params: RouteParams,
    private service: EventService,
    private serviceMembers: EventMembersService,
    private serviceUser: UserService
  ) {
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
      friendsCount: resp.total_attendees,
      score: resp.cumulative_match_score
    };


    let authUserId = CookieUtil.getValue('userid');
    this.authUserUri = `/api/v1/auth/user/${authUserId}/`;




    // check if the user is host and member
    this.memberExists = false;
    for (var i = 0; i <= resp.members.length - 1; i++) {
      if (resp.members[i].is_organizer) {
        this.host = resp.members[i];
        if (this.authUserUri === resp.members[i].user) {
          this.isHost = true;
        }
      }
      else {
        if (this.authUserUri === resp.members[i].user) {
          this.isHost = false;
          this.memberExists = true;
          this.member = resp.members[i];
          if (resp.members[i].rsvp !== null) {
            this.rsvpStatus = resp.members[i].rsvp;
          }
        }
      }
    }

    //get event host info
    this.serviceUser.findOneByUri(this.host.user)
      .subscribe((data) => {
        this.userInfo = {
          name: data.first_name,
          description: data.about_me,
          distance: data.distance && this.host.user === this.authUserUri ? '' : `/ ${data.distance[0]} ${data.distance[1]}`,
          gender: UserUtil.gender(data.gender),
          age: data.age,
          image: data.image
        };
      });

  }

  goBack(event) {
    window.history.back();
  }

  changeRsvpStatus(event) {
    let data = {
      event: this.event['resource_uri'],
      rsvp: event,
      user: this.authUserUri
    };

    if (this.memberExists) {
      this.serviceMembers.updateOneByUri(this.member.resource_uri, data)
        .subscribe((res) => {
          this.rsvpStatus = res.rsvp;
        });
    }
    else {
      this.serviceMembers.createOne(data)
        .subscribe((res) => {
          this.rsvpStatus = res.rsvp;
          this.member = res;
          this.memberExists = true;
        });
    }
  }


}
