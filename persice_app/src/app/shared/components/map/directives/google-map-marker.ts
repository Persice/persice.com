import {
  Directive,
  SimpleChange,
  OnDestroy,
  OnChanges,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {MarkerManager} from '../services/marker-manager';
import {MouseEvent} from '../events';
import * as mapTypes from '../services/google-maps-types';

let markerId = 0;

/**
 * GoogleMapMarker renders a map marker inside a {@link GoogleMap}.
 *
 * ### Example
 * ```typescript
 * import {Component} from '@angular/core';
 * import {GoogleMap, GoogleMapMarker} from 'angular2-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [GoogleMap, GoogleMapMarker],
 *  styles: [`
 *    .google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <-google-map-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *      </-google-map-marker>
 *    </google-map>
 *  `
 * })
 * ```
 */
@Directive({
  selector: 'google-map-marker'
})
export class GoogleMapMarker implements OnDestroy, OnChanges {
  /**
   * The latitude position of the marker.
   */
  @Input() latitude: number;

  /**
   * The longitude position of the marker.
   */
  @Input() longitude: number;

  /**
   * The title of the marker.
   */
  @Input() title: string;

  /**
   * The label (a single uppercase character) for the marker.
   */
  @Input() label: string;

  /**
   * If true, the marker can be dragged. Default value is false.
   */
  @Input() draggable: boolean = false;

  /**
   * This event emitter gets emitted when the user clicks on the marker.
   */
  @Output() markerClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * This event is fired when the user stops dragging the marker.
   */
  @Output() dragEnd: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  private _markerAddedToManger: boolean = false;
  private _id: string;

  constructor(private _markerManager: MarkerManager) { this._id = (markerId++).toString(); }

  /** @internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      return;
    }
    if (!this._markerAddedToManger) {
      this._markerManager.addMarker(this);
      this._markerAddedToManger = true;
      this._addEventListeners();
      return;
    }
    if (changes['latitude'] || changes['longitude']) {
      this._markerManager.updateMarkerPosition(this);
    }
    if (changes['title']) {
      this._markerManager.updateTitle(this);
    }
    if (changes['label']) {
      this._markerManager.updateLabel(this);
    }
    if (changes['draggable']) {
      this._markerManager.updateDraggable(this);
    }
  }



  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'GoogleMapMarker-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() { this._markerManager.deleteMarker(this); }

  private _addEventListeners() {
    this._markerManager.createEventObservable('click', this).subscribe(() => {
      this.markerClick.next(null);
    });
    this._markerManager.createEventObservable<mapTypes.MouseEvent>('dragend', this)
      .subscribe((e: mapTypes.MouseEvent) => {
        this.dragEnd.next({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
      });
  }
}
