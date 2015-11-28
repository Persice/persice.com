/// <reference path="../../../../typings/_custom.d.ts" />


import {
Component,
Directive,
Provider,
Input,
Output,
Renderer,
ContentChildren,
ElementRef,
SimpleChange,
NgZone,
EventEmitter,
QueryList,
provide
} from 'angular2/angular2';
import {GoogleMapsAPIWrapper} from '../services/google_maps_api_wrapper';
import {GoogleMapMarker} from './google_map_marker';
import {MarkerManager} from '../services/marker_manager';
import {MapsAPILoader} from '../services/maps_api_loader/maps_api_loader';

/**
 * Todo: add docs
 */
@Component({
  selector: 'google-map',
  providers: [GoogleMapsAPIWrapper, MarkerManager],
  styles: [
    `
   .google-map-container-inner {
     width: inherit;
     height: inherit;
   }
   `
  ],
  template: `
   <div class="google-map-container-inner"></div>
   <ng-content></ng-content>
   `
})
export class GoogleMap {
  private _longitude: number = 0;
  private _latitude: number = 0;
  private _zoom: number = 8;
  private _mapsWrapper: GoogleMapsAPIWrapper;
  private _zone: NgZone;

  constructor(
    elem: ElementRef, _mapsWrapper: GoogleMapsAPIWrapper, _zone: NgZone, renderer: Renderer) {
    this._mapsWrapper = _mapsWrapper;
    this._zone = _zone;
    renderer.setElementClass(elem, 'google-map-container', true);
    const container = elem.nativeElement.querySelector('.google-map-container-inner');
    this._initMapInstance(container);
  }

  private _initMapInstance(el: HTMLElement) {
    this._mapsWrapper.createMap(el, this._latitude, this._longitude);
    this._handleMapsCenterChanged();
    this._handleZoomChanged();
  }

  @Input()
  set zoom(value: number | string) {
    this._zoom = this._convertToDecimal(value);
    if (typeof this._zoom === 'number') {
      this._mapsWrapper.setZoom(this._zoom);
    }
  }

  @Input()
  set longitude(value: number | string) {
    this._longitude = this._convertToDecimal(value);
    this._updateCenter();
  }

  @Input()
  set latitude(value: number | string) {
    this._latitude = this._convertToDecimal(value);
    this._updateCenter();
  }

  private _convertToDecimal(value: string | number): number {
    if (typeof value === 'string') {
      return parseFloat(value);
    } else if (typeof value === 'number') {
      return <number>value;
    }
    return null;
  }

  private _updateCenter() {
    if (typeof this._latitude !== 'number' || typeof this._longitude !== 'number') {
      return;
    }
    this._mapsWrapper.setCenter({
      lat: this._latitude,
      lng: this._longitude
    });
  }

  private _handleMapsCenterChanged() {
    this._mapsWrapper.getCenterChangeObservable().subscribe((latLng: google.maps.LatLngLiteral) => {
      this._latitude = latLng.lat;
      this._longitude = latLng.lng;
    });
  }

  private _handleZoomChanged() {
    this._mapsWrapper.getZoomChangeObserable().subscribe((zoom: number) => this._zoom = zoom);
  }
}
