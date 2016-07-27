import { Injectable, NgZone } from '@angular/core';
import { GoogleMapInfoWindow } from '../../directives/google-map-info-window';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import { InfoWindow, InfoWindowOptions } from '../google-maps-types';
import { MarkerManager } from './marker-manager';

@Injectable()
export class InfoWindowManager {
  private _infoWindows: Map<GoogleMapInfoWindow, Promise<InfoWindow>> =
    new Map<GoogleMapInfoWindow, Promise<InfoWindow>>();

  constructor(
    private _mapsWrapper: GoogleMapsAPIWrapper, private _zone: NgZone,
    private _markerManager: MarkerManager
  ) {}

  deleteInfoWindow(infoWindow: GoogleMapInfoWindow): Promise<void> {
    const iWindow = this._infoWindows.get(infoWindow);
    if (iWindow == null) {
      // info window already deleted
      return Promise.resolve();
    }
    return iWindow.then((i: InfoWindow) => {
      return this._zone.run(() => {
        i.close();
        this._infoWindows.delete(infoWindow);
      });
    });
  }

  setPosition(infoWindow: GoogleMapInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow).then((i: InfoWindow) => i.setPosition({
      lat: infoWindow.latitude,
      lng: infoWindow.longitude
    }));
  }

  setZIndex(infoWindow: GoogleMapInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow)
      .then((i: InfoWindow) => i.setZIndex(infoWindow.zIndex));
  }

  open(infoWindow: GoogleMapInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow).then((w) => {
      if (infoWindow.hostMarker != null) {
        return this._markerManager.getNativeMarker(infoWindow.hostMarker).then((marker) => {
          return this._mapsWrapper.getNativeMap().then((map) => w.open(map, marker));
        });
      }
      return this._mapsWrapper.getNativeMap().then((map) => w.open(map));
    });
  }

  close(infoWindow: GoogleMapInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow).then((w) => w.close());
  }

  setOptions(infoWindow: GoogleMapInfoWindow, options: InfoWindowOptions) {
    return this._infoWindows.get(infoWindow).then((i: InfoWindow) => i.setOptions(options));
  }

  addInfoWindow(infoWindow: GoogleMapInfoWindow) {
    const options: InfoWindowOptions = {
      content: infoWindow.content,
    };
    if (typeof infoWindow.latitude === 'number' && typeof infoWindow.longitude === 'number') {
      options.position = {lat: infoWindow.latitude, lng: infoWindow.longitude};
    }
    const infoWindowPromise = this._mapsWrapper.createInfoWindow(options);
    this._infoWindows.set(infoWindow, infoWindowPromise);
  }
}
