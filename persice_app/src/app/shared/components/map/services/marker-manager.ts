import {Injectable, NgZone} from 'angular2/core';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {GoogleMapMarker} from '../directives/google-map-marker';
import {GoogleMapsAPIWrapper} from './google-maps-api-wrapper';
import {Marker} from './google-maps-types';

@Injectable()
export class MarkerManager {
  private _markers: Map<GoogleMapMarker, Promise<Marker>> =
      new Map<GoogleMapMarker, Promise<Marker>>();

  constructor(private _mapsWrapper: GoogleMapsAPIWrapper, private _zone: NgZone) {}

  deleteMarker(marker: GoogleMapMarker): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    return m.then((m: Marker) => {
      return this._zone.run(() => {
        m.setMap(null);
        this._markers.delete(marker);
      });
    });
  }

  updateMarkerPosition(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then(
        (m: Marker) => m.setPosition({lat: marker.latitude, lng: marker.longitude}));
  }

  updateTitle(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => { m.setLabel(marker.label); });
  }

  updateDraggable(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setDraggable(marker.draggable));
  }

  addMarker(marker: GoogleMapMarker) {
    const markerPromise = this._mapsWrapper.createMarker({
      position: {lat: marker.latitude, lng: marker.longitude},
      label: marker.label,
      draggable: marker.draggable
    });
    this._markers.set(marker, markerPromise);
  }

  createEventObservable<T>(eventName: string, marker: GoogleMapMarker): Observable<T> {
    return Observable.create((observer: Observer<T>) => {
      this._markers.get(marker).then((m: Marker) => {
        m.addListener(eventName, (e: T) => this._zone.run(() => observer.next(e)));
      });
    });
  }
}
