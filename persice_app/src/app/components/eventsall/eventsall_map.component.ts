import {Component} from 'angular2/core';
import {MapComponent} from '../map/map.component';


@Component({
  selector: 'events-all-map',
  directives: [MapComponent],
  template: `
    map
  `
})
export class EventsAllMapComponent {


}
