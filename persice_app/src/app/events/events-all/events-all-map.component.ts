import {Component} from '@angular/core';

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
