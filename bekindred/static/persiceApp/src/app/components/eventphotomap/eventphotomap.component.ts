import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {EventService} from '../../services/event.service';
import {NotificationService} from '../../services/notification.service';
import {FileUtil} from '../../core/util';

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

@Component({
  selector: 'event-photomap',
  template: view,
  directives: [GoogleMap, GoogleMapMarker, CORE_DIRECTIVES],
  providers: [EventService]
})
export class EventPhotoMapComponent {
  @Input() location;
  @Input() photo;
  @Input() stats;
  @Input() host;
  @Input() uri;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();


  showMap: boolean = false;
  showPhoto: boolean = true;

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number;
  lng: number;

  markers: IMarker[] = [];

  constructor(
    private service: EventService,
    private notificationService: NotificationService
  ) {

  }

  ngOnChanges(values) {
    // check if location exists
    if (values.location && values.location.currentValue) {

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

  openFileDialog(event) {
    document.getElementById('inputfile').click();
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let event = {
      event_photo: file
    };

    if (FileUtil.isImage(event.event_photo.type)) {
      this.service.updateImageByUri(event, this.uri).subscribe((res) => {
        this.refreshEvent.next(true);
      }, (err) => {
        console.log(err);
      }, () => {
      });
    }
    else {
      this.notificationService.push({
        type: 'error',
        title: 'Error',
        body: 'Selected file is not a valid image.',
        autoclose: 4000
      });
    }


  }

}
