import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../../../../../common/events/event.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { FileUtil } from '../../../../../common/core/util';
import { Event } from '../../../../../common/models/event';
import { LazyMapsAPILoader } from '../../../../../common/map/lazy-maps-api-loader';

@Component({
  selector: 'prs-event-photo-map',
  templateUrl: './event-photo-map.html'
})
export class EventPhotoMapComponent {
  @Input() set eventData(data: Event) {
    this.event = data;
    this.loadMap();
  };

  event: Event;
  map;
  showMap: boolean = false;
  showPhoto: boolean = true;
  zoom: number = 13;
  isImageUploading$: Observable<boolean>;

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService,
    private mapsApiLoader: LazyMapsAPILoader
  ) {
    this.isImageUploading$ = this.eventService.isImageUploading$;
  }

  openFileDialog() {
    document.getElementById('inputfile').click();
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[ 0 ];
    let photo = {
      event_photo: file
    };

    if (file !== undefined) {
      if (FileUtil.isImage(photo.event_photo.type)) {
        this.eventService.updateImageByUri(photo, this.event.resourceUri);
      } else {
        this.notificationService.push({
          type: 'error',
          title: 'Error',
          body: 'Selected file is not a valid image.',
          autoclose: 4000
        });
      }
    }
  }

  setShowMap(): void {
    this.showMap = true;
    this.showPhoto = false;
    this.loadMap();
  }

  setShowPhoto(): void {
    this.showMap = false;
    this.showPhoto = true;
  }

  loadMap() {
    if (!!this.showMap) {
      if (this.googleApiNotLoaded) {
        this.mapsApiLoader.load().then(() => {
          this.displayMap();
        });
      } else {
        this.displayMap();
      }

    }

  }

  displayMap() {
    setTimeout(() => {
      let center: any = new google.maps.LatLng(this.event.latitudeNumber, this.event.longitudeNumber);
      let mapProp = {
        center: center,
        zoom: this.zoom,
      };
      this.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

      let marker = new google.maps.Marker({
        position: center
      });

      let infowindow = new google.maps.InfoWindow({
        content: this.event.locationName,
        position: center,
        maxWidth: 150
      });

      google.maps.event.addListener(marker, 'click', () => {
        this.map.setZoom(15);
        this.map.setCenter(marker.getPosition());
        infowindow.open(this.map, marker);
      });

      marker.setMap(this.map);
    });
  }

  googleApiNotLoaded(): boolean {
    return !(<any>window).google || !(<any>window).google.maps;
  }

}
