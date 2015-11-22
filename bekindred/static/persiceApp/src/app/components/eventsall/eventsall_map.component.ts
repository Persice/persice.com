/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

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
