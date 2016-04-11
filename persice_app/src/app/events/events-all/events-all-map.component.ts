import {Component} from 'angular2/core';

import {EventsMapComponent} from '../events-map';


@Component({
  selector: 'prs-events-all-map',
  directives: [EventsMapComponent],
  template: `
    map
  `
})
export class EventsAllMapComponent {

}
