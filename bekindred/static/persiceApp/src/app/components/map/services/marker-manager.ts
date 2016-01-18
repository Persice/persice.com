import {Injectable} from 'angular2/core';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {GoogleMapMarker} from '../directives/google-map-marker';
import {GoogleMapsAPIWrapper} from './google-maps-api-wrapper';
import {Marker} from './google-maps-types';

@Injectable()
export class MarkerManager {
  private _markers: Map<GoogleMapMarker, Promise<Marker>> =
  new Map<GoogleMapMarker, Promise<Marker>>();

  constructor(private _mapsWrapper: GoogleMapsAPIWrapper) { }

  deleteMarker(marker: GoogleMapMarker): Promise<void> {
    let promise = this._markers.get(marker).then((m: Marker) => m.setMap(null));
    this._markers.delete(marker);
    return promise;
  }

  updateMarkerPosition(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker)
      .then((m: Marker) => m.setPosition({ lat: marker.latitude, lng: marker.longitude }));
  }

  updateTitle(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => {
      const label = m.getLabel();
      label.text = marker.label;
      m.setLabel(label);
    });
  }

  addMarker(marker: GoogleMapMarker) {
    const markerPromise = this._mapsWrapper.createMarker(
      { position: { lat: marker.latitude, lng: marker.longitude }, label: marker.label });
    this._markers.set(marker, markerPromise);
  }

  createClickObserable(marker: GoogleMapMarker): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      this._markers.get(marker)
        .then((m: Marker) => { m.addListener('click', () => { observer.next(null); }); });
    });
  }
}
