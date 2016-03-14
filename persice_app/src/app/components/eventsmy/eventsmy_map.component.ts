import {Component} from 'angular2/core';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'events-my-map',
  directives: [MapComponent],
  template: `
    map
  `
})
export class EventsMyMapComponent {


}
