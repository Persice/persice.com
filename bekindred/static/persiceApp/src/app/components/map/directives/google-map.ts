import {
Component,
Renderer,
ElementRef,
EventEmitter,
OnChanges,
OnInit,
SimpleChange
} from 'angular2/core';
import {GoogleMapsAPIWrapper} from '../services/google-maps-api-wrapper';
import {MarkerManager} from '../services/marker-manager';
import {LatLng, LatLngLiteral} from '../services/google-maps-types';

/**
 * GoogleMap renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the CSS
 * class `google-map-container`.
 *
 * ### Example
 * ```typescript
 * import {Component} from 'angular2/core';
 * import {GoogleMap} from 'angular2-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [GoogleMap],
 *  styles: [`
 *    .google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *    </google-map>
 *  `
 * })
 * ```
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
  inputs: ['longitude', 'latitude', 'zoom', 'disableDoubleClickZoom'],
  outputs: ['mapClick', 'mapRightClick', 'mapDblClick'],
  template: `
    <div class="google-map-container-inner"></div>
    <ng-content></ng-content>
  `
})
export class GoogleMap implements OnChanges,
  OnInit {
  private _longitude: number = 0;
  private _latitude: number = 0;
  private _zoom: number = 8;
  /**
   * Enables/disables zoom and center on double click. Enabled by default.
   */
  disableDoubleClickZoom: boolean = false;

  private static _mapOptionsAttributes: string[] = ['disableDoubleClickZoom'];

  /**
   * This event emitter gets emitted when the user clicks on the map (but not when they click on a
   * marker or infoWindow).
   */
  mapClick: EventEmitter<MapMouseEvent> = new EventEmitter<MapMouseEvent>();

  /**
   * This event emitter gets emitted when the user right-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  mapRightClick: EventEmitter<MapMouseEvent> = new EventEmitter<MapMouseEvent>();

  /**
   * This event emitter gets emitted when the user double-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  mapDblClick: EventEmitter<MapMouseEvent> = new EventEmitter<MapMouseEvent>();

  constructor(
    private _elem: ElementRef, private _mapsWrapper: GoogleMapsAPIWrapper,
    private _renderer: Renderer) { }

  /** @internal */
  ngOnInit() {
    this._renderer.setElementClass(this._elem.nativeElement, 'google-map-container', true);
    const container = this._elem.nativeElement.querySelector('.google-map-container-inner');
    this._initMapInstance(container);
  }

  private _initMapInstance(el: HTMLElement) {
    this._mapsWrapper.createMap(
      el, { center: { lat: this._latitude, lng: this._longitude }, zoom: this._zoom });
    this._handleMapCenterChange();
    this._handleMapZoomChange();
    this._handleMapMouseEvents();
  }

  private static _containsMapOptionsChange(changesKeys: string[]): boolean {
    return changesKeys.every(
      (key: string) => { return GoogleMap._mapOptionsAttributes.indexOf(key) !== 1; });
  }

  /** @internal */
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (GoogleMap._containsMapOptionsChange(Object.keys(changes))) {
      this._mapsWrapper.setMapOptions({ disableDoubleClickZoom: this.disableDoubleClickZoom });
    }
  }

  /**
   * Sets the zoom level of the map. The default value is `8`.
   */
  set zoom(value: number | string) {
    this._zoom = this._convertToDecimal(value, 8);
    if (typeof this._zoom === 'number') {
      this._mapsWrapper.setZoom(this._zoom);
    }
  }

  /**
   * The longitude that sets the center of the map.
   */
  set longitude(value: number | string) {
    this._longitude = this._convertToDecimal(value);
    this._updateCenter();
  }

  /**
   * The latitude that sets the center of the map.
   */
  set latitude(value: number | string) {
    this._latitude = this._convertToDecimal(value);
    this._updateCenter();
  }

  private _convertToDecimal(value: string | number, defaultValue: number = null): number {
    if (typeof value === 'string') {
      return parseFloat(value);
    } else if (typeof value === 'number') {
      return <number>value;
    }
    return defaultValue;
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

  private _handleMapCenterChange() {
    this._mapsWrapper.subscribeToMapEvent<void>('center_changed').subscribe(() => {
      this._mapsWrapper.getCenter().then((center: LatLng) => {
        this._latitude = center.lat();
        this._longitude = center.lng();
      });
    });
  }

  private _handleMapZoomChange() {
    this._mapsWrapper.subscribeToMapEvent<void>('zoom_changed')
      .subscribe(() => { this._mapsWrapper.getZoom().then((z: number) => this._zoom = z); });
  }

  private _handleMapMouseEvents() {
    interface Emitter {
      emit(value: any): void;
    }
    type Event = { name: string, emitter: Emitter };

    const events: Event[] = [
      { name: 'click', emitter: this.mapClick },
      { name: 'rightclick', emitter: this.mapRightClick },
      { name: 'dblclick', emitter: this.mapDblClick }
    ];

    events.forEach((e: Event) => {
      this._mapsWrapper.subscribeToMapEvent<{ latLng: LatLng }>(e.name)
        .subscribe((event: { latLng: LatLng }) => {
          const value =
            <MapMouseEvent>{ coords: { lat: event.latLng.lat(), lng: event.latLng.lng() } };
          e.emitter.emit(value);
        });
    });
  }
}

/**
 * MapMouseEvent gets emitted when the user triggers mouse events on the map.
 */
export interface MapMouseEvent { coords: LatLngLiteral; }
