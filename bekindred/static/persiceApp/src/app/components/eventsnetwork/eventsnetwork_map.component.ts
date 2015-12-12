import {Component} from 'angular2/angular2';

import {MapComponent} from '../map/map.component';


@Component({
  selector: 'events-network-map',
  directives: [MapComponent],
  template: `
    map
  `
})
export class EventsNetworkMapComponent {


}
