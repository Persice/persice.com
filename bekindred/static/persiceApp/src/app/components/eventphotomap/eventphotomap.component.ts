/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, CORE_DIRECTIVES} from 'angular2/angular2';


import {
GoogleMap,
GoogleMapMarker,
ANGULAR2_GOOGLE_MAPS_PROVIDERS
} from '../map/angular2_google_maps';


// just an interface for type safety.
interface IMarker {
  lat: number;
  lng: number;
  label?: string;
}


let view = require('./eventphotomap.html');

declare var jQuery: any;
declare var google: any;

@Component({
  selector: 'event-photomap',
  template: view,
  directives: [GoogleMap, GoogleMapMarker, CORE_DIRECTIVES]
})
export class EventPhotoMapComponent {
  @Input() location;
  @Input() photo;
  @Input() stats;
  @Input() host;


  showMap: boolean = false;
  showPhoto: boolean = true;

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number;
  lng: number;

  markers: IMarker[] = [];

  onChanges(values) {

    // check if location exists
    if (Object.keys(values.location.currentValue).length > 0) {
      this.markers = [
        {
          lat: parseFloat(values.location.currentValue.latitude),
          lng: parseFloat(values.location.currentValue.longitude),
          label: values.location.currentValue.name
        }
      ];

      this.lat = parseFloat(values.location.currentValue.latitude);
      this.lng = parseFloat(values.location.currentValue.longitude);
      this.zoom = 12;
    }
  }

}
