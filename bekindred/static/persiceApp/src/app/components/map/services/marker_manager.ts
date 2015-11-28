/// <reference path="../../../../typings/_custom.d.ts" />


import {Injectable} from 'angular2/angular2';
import {GoogleMapMarker} from '../components/google_map_marker';
import {GoogleMapsAPIWrapper} from './google_maps_api_wrapper';

@Injectable()
export class MarkerManager {
  private _markers: Map<GoogleMapMarker, Promise<google.maps.Marker>> =
  new Map<GoogleMapMarker, Promise<google.maps.Marker>>();

  constructor(private _mapsWrapper: GoogleMapsAPIWrapper) { }

  deleteMarker(marker: GoogleMapMarker): Promise<void> {
    let promise = this._markers.get(marker).then((m: google.maps.Marker) => m.setMap(null));
    this._markers.delete(marker);
    return promise;
  }

  updateMarkerPosition(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then(
      (m: google.maps.Marker) => m.setPosition({ lat: marker.latitude, lng: marker.longitude }));
  }

  updateTitle(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: google.maps.Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: GoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: google.maps.Marker) => {
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
}
