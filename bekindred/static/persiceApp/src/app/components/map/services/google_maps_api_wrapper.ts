/// <reference path="../../../../typings/_custom.d.ts" />

import {Injectable} from 'angular2/angular2';
import {Observable, Subject} from '@reactivex/rxjs';

import {MapsAPILoader} from './maps_api_loader/maps_api_loader';

/**
 * Wrapper class that handles the communication with the Google Maps Javascript
 * API v3
 */
@Injectable()
export class GoogleMapsAPIWrapper {
  private _el: HTMLElement;
  private _map: Promise<google.maps.Map>;

  private _centerChangeObservable: Observable<google.maps.LatLngLiteral>;
  private _zoomChangeObservable: Observable<number>;

  private _mapResolver: (value?: google.maps.Map) => void;

  constructor(private _loader: MapsAPILoader) {
    this._createObservables();
    this._map =
      new Promise<google.maps.Map>((resolve: () => void) => { this._mapResolver = resolve; });
  }

  createMap(el: HTMLElement, latitude: number, longitude: number): Promise<void> {
    return this._loader.load().then(() => {
      const map = new google.maps.Map(el, { center: { lat: latitude, lng: longitude } });
      this._mapResolver(map);
      return;
    });
  }

  createEventObservable<E>(eventName: string, callback: (observer: Subject<E>) => void):
    Observable<E> {
    return Observable.create((observer: Subject<E>) => {
      this._map.then(
        (m: google.maps.Map) => m.addListener(eventName, () => { callback(observer); }));
    });
  }


  /**
   * Creates a google map marker with the map context
   */
  createMarker(options: google.maps.MarkerOptions = <google.maps.MarkerOptions>{}):
    Promise<google.maps.Marker> {
    return this._map.then((map: google.maps.Map) => {
      options.map = map;
      return new google.maps.Marker(options);
    });
  }

  getZoomChangeObserable(): Observable<number> { return this._zoomChangeObservable; }

  getCenterChangeObservable(): Observable<google.maps.LatLngLiteral> {
    return this._centerChangeObservable;
  }

  setCenter(latLng: google.maps.LatLngLiteral): Promise<void> {
    return this._map.then((map: google.maps.Map) => map.setCenter(latLng));
  }

  setZoom(zoom: number): Promise<void> {
    return this._map.then((map: google.maps.Map) => map.setZoom(zoom));
  }

  getCenter(): Promise<google.maps.LatLng> {
    return this._map.then((map: google.maps.Map) => map.getCenter());
  }


  private _createObservables() {
    this._centerChangeObservable = this.createEventObservable<google.maps.LatLngLiteral>(
      'center_changed', (observer: Subject<google.maps.LatLngLiteral>) => {
        this._map.then((map: google.maps.Map) => {
          const center = map.getCenter();
          observer.next({ lat: center.lat(), lng: center.lng() });
        });
      });
    this._zoomChangeObservable =
      this.createEventObservable<number>('zoom_changed', (observer: Subject<number>) => {
      this._map.then((map: google.maps.Map) => { observer.next(map.getZoom()); });
      });
  }

}
