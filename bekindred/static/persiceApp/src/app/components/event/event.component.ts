import {Component} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {Response} from 'angular2/http';
import {Router} from 'angular2/router';

import {EventDescriptionComponent} from '../eventdescription/eventdescription.component';
import {EventHostComponent} from '../eventhost/eventhost.component';
import {EventInfoComponent} from '../eventinfo/eventinfo.component';
import {EventPhotoMapComponent} from '../eventphotomap/eventphotomap.component';
import {EventDiscussionComponent} from '../eventdiscussion/eventdiscussion.component';
import {EventEditComponent} from './event_edit.component';

import {UserService} from '../../services/user.service';
import {EventService} from '../../services/event.service';
import {EventMembersService} from '../../services/eventmembers.service';
import {EventAttendeesService} from '../../services/eventattendees.service';
import {EventPeopleListComponent} from '../eventpeoplelist/eventpeoplelist.component';
import {DateUtil, EventUtil, CookieUtil, UserUtil, StringUtil} from '../../core/util';
import {NotificationService} from '../../services/notification.service';

import {RemodalDirective} from '../../directives/remodal.directive';

let view = require('./event.html');

declare var jQuery: any;

@Component({
  selector: 'event',
  template: view,
  directives: [
    EventInfoComponent,
    EventHostComponent,
    EventDescriptionComponent,
    EventPhotoMapComponent,
    EventDiscussionComponent,
    EventPeopleListComponent,
    EventEditComponent,
    RemodalDirective
  ],
  providers: [EventService, EventMembersService, EventAttendeesService]
})
export class EventComponent {
  remodalId: string = 'edit-event';
  selected = 'yes';
  savingRsvp: boolean = false;
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

  constructor(
    params: RouteParams,
    private service: EventService,
    private serviceMembers: EventMembersService,
    private serviceUser: UserService,
    private serviceAttendees: EventAttendeesService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.eventId = params.get('eventId');
  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getEventDetails(this.eventId);
    this.getAttendees(this.eventId);
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

  refreshEvent(event) {
    this.getEventDetails(this.eventId);
  }


  getEventDetails(id) {
    this.service.findOneById(id).subscribe((data) => {
      this.assignEvent(data);
    }, (err) => {
      this.eventDoesntExist = true;
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

    this.getAttendees(id);
    this.service.findOneById(id).subscribe((data) => {
      this.stats = {
        maxAttendees: data.max_attendees,
        friendsCount: data.total_attendees,
        score: data.cumulative_match_score
      };
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
      distance: resp.distance,
      openTo: EventUtil.accessLevel(resp.access_level),
      startDate: {
        hour: DateUtil.format(resp.starts_on, 'h:mm A'),
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

  getAttendees(eventId) {
    this.serviceAttendees.get('', 1000, eventId, 'yes', '')
      .subscribe((data) => {
        let items = this.fixImageUrl(data.objects);
        this.peopleYes = items;
        this.peopleYescounter = items.length;
      });

    this.serviceAttendees.get('', 1000, eventId, 'no', '')
      .subscribe((data) => {
        let items = this.fixImageUrl(data.objects);
        this.peopleNo = items;
        this.peopleNocounter = items.length;
      });

    this.serviceAttendees.get('', 1000, eventId, 'maybe', '')
      .subscribe((data) => {
        let items = this.fixImageUrl(data.objects);
        this.peopleMaybe = items;
        this.peopleMaybecounter = items.length;

        this.selected = '';
        this.selected = 'yes';
      });
  }

  fixImageUrl(items) {
    let data = items;
    for (var i = 0; i <= data.length - 1; ++i) {
      if (!StringUtil.contains(data[i].image, '/media')) {
        data[i].image = '/media/' + data[i].image;
      }
    }

    return data;
  }

  goBack(event) {
    window.history.back();
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
    }
    else {
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
