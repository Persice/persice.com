/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';


import {EventDescriptionComponent} from '../eventdescription/eventdescription.component';
import {EventHostComponent} from '../eventhost/eventhost.component';
import {EventInfoComponent} from '../eventinfo/eventinfo.component';
import {EventPeopleComponent} from '../eventpeople/eventpeople.component';
import {EventPhotoMapComponent} from '../eventphotomap/eventphotomap.component';
import {EventDiscussionComponent} from '../eventdiscussion/eventdiscussion.component';

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
  ]
})
export class EventComponent {
  event = {};

}
