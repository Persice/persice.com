import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { RouteParams, Router } from '@angular/router-deprecated';
import { EventDescriptionComponent } from './event-description';
import { EventHostComponent } from './event-host';
import { EventInfoComponent } from './event-info';
import { EventPhotoMapComponent } from './event-photo-map';
import { EventDiscussionComponent } from './event-discussion';
import { EventEditComponent } from './event-edit.component';
import { EventAttendeesComponent } from './event-attendees';
import { LoadingComponent } from '../shared/components/loading';
import {
  NotificationService,
  HistoryService,
  UserService,
  EventService,
  EventMembersService,
  EventAttendeesService
} from '../shared/services';
import { DateUtil, EventUtil, CookieUtil, UserUtil } from '../shared/core';
import { RemodalDirective } from '../shared/directives';


@Component({
  selector: 'prs-event',
  template: <any>require('./event.html'),
  directives: [
    EventInfoComponent,
    EventHostComponent,
    EventDescriptionComponent,
    EventPhotoMapComponent,
    EventDiscussionComponent,
    EventAttendeesComponent,
    EventEditComponent,
    RemodalDirective,
    LoadingComponent
  ],
  providers: [EventService, EventMembersService, EventAttendeesService]
})
export class EventComponent implements AfterViewInit, OnInit, OnDestroy {
  remodalId: string = 'edit-event';
  selected = 'yes';
  savingRsvp: boolean = false;
  event = null;
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
    image: '',
    username: ''
  };
  info = {
    spots_remaining: null,
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
      year: '',
      dayName: ''
    },
    endDate: {
      hour: '',
      day: '',
      month: '',
      year: '',
      dayName: ''
    },
    repeat: 'Repeats Weekly',
    timezone: DateUtil.localTimezone()
  };
  peopleYes: any[] = [];
  peopleNo: any[] = [];
  peopleMaybe: any[] = [];

  peopleYescounter = 0;
  peopleNocounter = 0;
  peopleMaybecounter = 0;

  photo: string = '/static/img/placeholder-image.png';
  location = {};
  stats = {
    maxAttendees: 0,
    friendsCount: 0,
    score: 0
  };
  eventId;
  eventDoesntExist: boolean = false;
  loading: boolean = false;

  constructor(
    params: RouteParams,
    private service: EventService,
    private serviceMembers: EventMembersService,
    private serviceUser: UserService,
    private serviceAttendees: EventAttendeesService,
    private notificationService: NotificationService,
    private historyService: HistoryService,
    private router: Router
  ) {
    this.eventId = params.get('eventId');
  }

  ngOnInit() {
    this.getEventDetails(this.eventId);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

  refreshEvent(event) {
    this.getEventDetails(this.eventId);
  }


  getEventDetails(id) {
    this.loading = true;
    this.service.findOneById(id).subscribe((data) => {
      this.assignEvent(data);
      this.loading = false;
    }, (err) => {
      this.eventDoesntExist = true;
      this.loading = false;
      this.notificationService.push({
        type: 'error',
        title: 'Error',
        body: 'This event doesn\'t exist',
        autoclose: 4000
      });
      this.router.parent.navigate(['./Events', 'AllEventsList']);

    }, () => {
    });
  }

  refreshEventStats(id) {
    this.peopleYes = [];
    this.peopleNo = [];
    this.peopleMaybe = [];

    this.peopleYescounter = 0;
    this.peopleNocounter = 0;
    this.peopleMaybecounter = 0;

    this.service.findOneById(id).subscribe((data) => {
      this.stats = {
        maxAttendees: data.max_attendees,
        friendsCount: data.total_attendees,
        score: data.cumulative_match_score
      };

      // assign attendees
      this.peopleYes = data.attendees_yes;
      this.peopleYescounter = data.attendees_yes.length;

      this.peopleNo = data.attendees_no;
      this.peopleNocounter = data.attendees_no.length;

      this.peopleMaybe = data.attendees_maybe;
      this.peopleMaybecounter = data.attendees_maybe.length;

      this.selected = 'yes';


    });
  }

  assignEvent(res) {
    let resp = res;
    this.event = resp;

    // assign attendees
    this.peopleYes = resp.attendees_yes;
    this.peopleYescounter = resp.attendees_yes.length;

    this.peopleNo = resp.attendees_no;
    this.peopleNocounter = resp.attendees_no.length;

    this.peopleMaybe = resp.attendees_maybe;
    this.peopleMaybecounter = resp.attendees_maybe.length;

    this.selected = 'yes';

    //assign event info
    this.info = {
      spots_remaining: resp.spots_remaining,
      name: resp.name,
      city: resp.city,
      location_name: resp.location_name,
      state: resp.state,
      distance: resp.distance,
      openTo: EventUtil.accessLevel(resp.access_level),
      startDate: {
        hour: DateUtil.format(resp.starts_on, 'h:mmA'),
        day: DateUtil.format(resp.starts_on, 'D'),
        dayName: DateUtil.format(resp.starts_on, 'dddd'),
        month: DateUtil.format(resp.starts_on, 'MMM'),
        year: DateUtil.format(resp.starts_on, 'YYYY')
      },
      endDate: {
        hour: DateUtil.format(resp.ends_on, 'h:mmA'),
        day: DateUtil.format(resp.ends_on, 'D'),
        dayName: DateUtil.format(resp.ends_on, 'dddd'),
        month: DateUtil.format(resp.ends_on, 'MMM'),
        year: DateUtil.format(resp.ends_on, 'YYYY')
      },
      repeat: 'Repeats Weekly',
      timezone: DateUtil.localTimezone()
    };

    if (resp.event_photo !== null && resp.event_photo !== '/media/null') {
      this.photo = resp.event_photo;
    }

    if (resp.location !== null) {
      let loc = resp.location.split(',');
      this.location = {
        latitude: loc[0],
        longitude: loc[1],
        name: resp.location_name + ' / ' + resp.city
      };
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
      } else {
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
    if (this.host) {
      this.serviceUser.findOneByUri(this.host.user)
        .subscribe((data) => {
          this.userInfo = {
            name: data.first_name,
            description: data.about_me,
            distance: data.distance && this.host.user === this.authUserUri ? '' : `/ ${data.distance[0]} ${data.distance[1]}`,
            gender: UserUtil.gender(data.gender),
            age: data.age,
            image: data.image,
            username: data.username
          };
        });
    }


  }

  goBack(event) {
    let uri: any = this.historyService.getPrev();
    if (uri !== '') {
      window.history.back(-1);
    } else {
      window.history.back(-2);
    }
  }

  changeRsvpStatus(event) {
    if (this.savingRsvp) {
      return;
    }
    this.savingRsvp = true;

    this.rsvpStatus = event;

    let data = {
      event: this.event['resource_uri'],
      rsvp: event,
      user: this.authUserUri
    };

    if (this.memberExists) {
      this.serviceMembers.updateOneByUri(this.member.resource_uri, data)
        .subscribe((res) => {
          setTimeout(() => {
            this.refreshEventStats(this.eventId);
          }, 250);
          this.savingRsvp = false;

        });
    } else {
      this.serviceMembers.createOne(data)
        .subscribe((res) => {
          this.member = res;
          this.memberExists = true;
          this.savingRsvp = false;
          setTimeout(() => {
            this.refreshEventStats(this.eventId);
          }, 250);
        });
    }
  }


  activate(type) {
    if (type !== this.selected) {
      this.selected = type;
    }

  }


}
