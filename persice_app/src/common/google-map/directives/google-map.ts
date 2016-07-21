import { Component, ElementRef, EventEmitter, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MouseEvent } from '../map-types';
import { GoogleMapsAPIWrapper } from '../services/google-maps-api-wrapper';
import { LatLng, LatLngLiteral, LatLngBounds, LatLngBoundsLiteral, MapTypeStyle } from '../services/google-maps-types';
import { CircleManager } from '../services/managers/circle-manager';
import { InfoWindowManager } from '../services/managers/info-window-manager';
import { MarkerManager } from '../services/managers/marker-manager';

/**
 * GoogleMap renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the CSS
 * class `google-map-container`.
 *
 * ### Example
 * ```typescript
 * import {Component} from '@angular/core';
 * import {GoogleMap} from 'angular2google-maps/core';
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
  providers: [GoogleMapsAPIWrapper, MarkerManager, InfoWindowManager, CircleManager],
  inputs: [
    'longitude', 'latitude', 'zoom', 'disableDoubleClickZoom', 'disableDefaultUI', 'scrollwheel',
    'backgroundColor', 'draggableCursor', 'draggingCursor', 'keyboardShortcuts', 'zoomControl',
    'styles', 'usePanning', 'streetViewControl', 'fitBounds', 'scaleControl'
  ],
  outputs: ['mapClick', 'mapRightClick', 'mapDblClick', 'centerChange', 'idle', 'boundsChange'],
  host: {'[class.google-map-container]': 'true'},
  styles: [`
    .google-map-container-inner {
      width: inherit;
      height: inherit;
    }
    .google-map-content {
      display:none;
    }
  `],
  template: `
    <div class='google-map-container-inner'></div>
    <div class='google-map-content'>
      <ng-content></ng-content>
    </div>
  `
})
export class GoogleMap implements OnChanges, OnInit {
  /**
   * The longitude that defines the center of the map.
   */
  longitude: number = 0;

  /**
   * The latitude that defines the center of the map.
   */
  latitude: number = 0;

  /**
   * The zoom level of the map. The default zoom level is 8.
   */
  zoom: number = 8;

  /**
   * Enables/disables zoom and center on double click. Enabled by default.
   */
  disableDoubleClickZoom: boolean = false;

  /**
   * Enables/disables all default UI of the Google map. Please note: When the map is created, this
   * value cannot get updated.
   */
  disableDefaultUI: boolean = false;

  /**
   * If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by default.
   */
  scrollwheel: boolean = true;

  /**
   * Color used for the background of the Map div. This color will be visible when tiles have not
   * yet loaded as the user pans. This option can only be set when the map is initialized.
   */
  backgroundColor: string;

  /**
   * The name or url of the cursor to display when mousing over a draggable map. This property uses
   * the css  * cursor attribute to change the icon. As with the css property, you must specify at
   * least one fallback cursor that is not a URL. For example:
   * [draggableCursor]="'url(http://www.example.com/icon.png), auto;'"
   */
  draggableCursor: string;

  /**
   * The name or url of the cursor to display when the map is being dragged. This property uses the
   * css cursor attribute to change the icon. As with the css property, you must specify at least
   * one fallback cursor that is not a URL. For example:
   * [draggingCursor]="'url(http://www.example.com/icon.png), auto;'"
   */
  draggingCursor: string;

  /**
   * If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are
   * enabled by default.
   */
  keyboardShortcuts: boolean = true;

  /**
   * The enabled/disabled state of the Zoom control.
   */
  zoomControl: boolean = true;

  /**
   * Styles to apply to each of the default map types. Note that for Satellite/Hybrid and Terrain
   * modes, these styles will only apply to labels and geometry.
   */
  styles: MapTypeStyle[] = [];

  /**
   * When true and the latitude and/or longitude values changes, the Google Maps panTo method is
   * used to
   * center the map. See: https://developers.google.com/maps/documentation/javascript/reference#Map
   */
  usePanning: boolean = false;

  /**
   * The initial enabled/disabled state of the Street View Pegman control.
   * This control is part of the default UI, and should be set to false when displaying a map type
   * on which the Street View road overlay should not appear (e.g. a non-Earth map type).
   */
  streetViewControl: boolean = true;

  /**
   * Sets the viewport to contain the given bounds.
   */
  fitBounds: LatLngBoundsLiteral|LatLngBounds = null;

  /**
   * The initial enabled/disabled state of the Scale control. This is disabled by default.
   */
  scaleControl: boolean = false;

  /**
   * Map option attributes that can change over time
   */
  private static _mapOptionsAttributes: string[] = [
    'disableDoubleClickZoom', 'scrollwheel', 'draggableCursor', 'draggingCursor',
    'keyboardShortcuts', 'zoomControl', 'styles', 'streetViewControl', 'zoom'
  ];

  private _observableSubscriptions: Subscription[] = [];

  /**
   * This event emitter gets emitted when the user clicks on the map (but not when they click on a
   * marker or infoWindow).
   */
  mapClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event emitter gets emitted when the user right-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  mapRightClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event emitter gets emitted when the user double-clicks on the map (but not when they click
   * on a marker or infoWindow).
   */
  mapDblClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * This event emitter is fired when the map center changes.
   */
  centerChange: EventEmitter<LatLngLiteral> = new EventEmitter<LatLngLiteral>();

  /**
   * This event is fired when the viewport bounds have changed.
   */
  boundsChange: EventEmitter<LatLngBounds> = new EventEmitter<LatLngBounds>();

  /**
   * This event is fired when the map becomes idle after panning or zooming.
   */
  idle: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _elem: ElementRef, private _mapsWrapper: GoogleMapsAPIWrapper) {}

  /** @internal */
  ngOnInit() {
    // todo: this should be solved with a new component and a viewChild decorator
    const container = this._elem.nativeElement.querySelector('.google-map-container-inner');
    this._initMapInstance(container);
  }

  private _initMapInstance(el: HTMLElement) {
    this._mapsWrapper.createMap(el, {
      center: {lat: this.latitude || 0, lng: this.longitude || 0},
      zoom: this.zoom,
      disableDefaultUI: this.disableDefaultUI,
      backgroundColor: this.backgroundColor,
      draggableCursor: this.draggableCursor,
      draggingCursor: this.draggingCursor,
      keyboardShortcuts: this.keyboardShortcuts,
      zoomControl: this.zoomControl,
      styles: this.styles,
      streetViewControl: this.streetViewControl,
      scaleControl: this.scaleControl
    });

    // register event listeners
    this._handleMapCenterChange();
    this._handleMapZoomChange();
    this._handleMapMouseEvents();
    this._handleBoundsChange();
    this._handleIdleEvent();
  }

  /** @internal */
  ngOnDestroy() {
    // unsubscribe all registered observable subscriptions
    this._observableSubscriptions.forEach((s) => s.unsubscribe());
  }

  /* @internal */
  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    this._updateMapOptionsChanges(changes);
    this._updatePosition(changes);
  }

  private _updateMapOptionsChanges(changes: {[propName: string]: SimpleChange}) {
    let options: {[propName: string]: any} = {};
    let optionKeys =
      Object.keys(changes).filter(k => GoogleMap._mapOptionsAttributes.indexOf(k) !== -1);
    optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
    this._mapsWrapper.setMapOptions(options);
  }

  /**
   * Triggers a resize event on the google map instance.
   * Returns a promise that gets resolved after the event was triggered.
   */
  triggerResize(): Promise<void> {
    // Note: When we would trigger the resize event and show the map in the same turn (which is a
    // common case for triggering a resize event), then the resize event would not
    // work (to show the map), so we trigger the event in a timeout.
    return new Promise<void>((resolve) => {
      setTimeout(
        () => { return this._mapsWrapper.triggerMapEvent('resize').then(() => resolve()); });
    });
  }

  private _updatePosition(changes: {[propName: string]: SimpleChange}) {
    if (changes['latitude'] == null && changes['longitude'] == null &&
      changes['fitBounds'] == null) {
      // no position update needed
      return;
    }

    // we prefer fitBounds in changes
    if (changes['fitBounds'] && this.fitBounds != null) {
      this._fitBounds();
      return;
    }

    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      return;
    }
    let newCenter = {
      lat: this.latitude,
      lng: this.longitude,
    };
    if (this.usePanning) {
      this._mapsWrapper.panTo(newCenter);
    } else {
      this._mapsWrapper.setCenter(newCenter);
    }
  }

  private _fitBounds() {
    if (this.usePanning) {
      this._mapsWrapper.panToBounds(this.fitBounds);
      return;
    }
    this._mapsWrapper.fitBounds(this.fitBounds);
  }

  private _handleMapCenterChange() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('center_changed').subscribe(() => {
      this._mapsWrapper.getCenter().then((center: LatLng) => {
        this.latitude = center.lat();
        this.longitude = center.lng();
        this.centerChange.emit(<LatLngLiteral>{lat: this.latitude, lng: this.longitude});
      });
    });
    this._observableSubscriptions.push(s);
  }

  private _handleBoundsChange() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('bounds_changed').subscribe(() => {
      this._mapsWrapper.getBounds().then(
        (bounds: LatLngBounds) => { this.boundsChange.emit(bounds); });
    });
    this._observableSubscriptions.push(s);
  }

  private _handleMapZoomChange() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('zoom_changed').subscribe(() => {
      this._mapsWrapper.getZoom().then((z: number) => this.zoom = z);
    });
    this._observableSubscriptions.push(s);
  }

  private _handleIdleEvent() {
    const s = this._mapsWrapper.subscribeToMapEvent<void>('idle').subscribe(
      () => { this.idle.emit(void 0); });
    this._observableSubscriptions.push(s);
  }

  private _handleMapMouseEvents() {
    interface Emitter {
      emit(value: any): void;
    }
    type Event = {name: string, emitter: Emitter};

    const events: Event[] = [
      {name: 'click', emitter: this.mapClick},
      {name: 'rightclick', emitter: this.mapRightClick},
    ];

    events.forEach((e: Event) => {
      const s = this._mapsWrapper.subscribeToMapEvent<{latLng: LatLng}>(e.name).subscribe(
        (event: {latLng: LatLng}) => {
          const value = <MouseEvent>{coords: {lat: event.latLng.lat(), lng: event.latLng.lng()}};
          e.emitter.emit(value);
        });
      this._observableSubscriptions.push(s);
    });
  }
}
