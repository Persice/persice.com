import {Directive, SimpleChange, OnDestroy, OnChanges, EventEmitter} from 'angular2/core';
import {MarkerManager} from '../services/marker-manager';

let markerId = 0;

/**
 * GoogleMapMarker renders a map marker inside a {@link GoogleMap}.
 *
 * ### Example
 * ```typescript
 * import {Component} from 'angular2/core';
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
 *      <google-map-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *      </google-map-marker>
 *    </google-map>
 *  `
 * })
 * ```
 */
@Directive({
  selector: 'google-map-marker',
  inputs: ['latitude', 'longitude', 'title', 'label'],
  outputs: ['markerClick']
})
export class GoogleMapMarker implements OnDestroy,
  OnChanges {
  /**
   * The latitude position of the marker.
   */
  latitude: number;

  /**
   * The longitude position of the marker.
   */
  longitude: number;

  /**
   * The title of the marker.
   */
  title: string;

  /**
   * The label (a single uppercase character) for the marker.
   */
  label: string;

  /**
   * This event emitter gets emitted when the user clicks on the marker.
   */
  markerClick: EventEmitter<void> = new EventEmitter<void>();

  private _markerAddedToManger: boolean = false;
  private _id: string;

  constructor(private _markerManager: MarkerManager) { this._id = (markerId++).toString(); }

  /** @internal */
  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (!this._markerAddedToManger && this.latitude && this.longitude) {
      this._markerManager.addMarker(this);
      this._markerAddedToManger = true;
      this._markerManager.createClickObserable(this)
        .subscribe(() => { this.markerClick.next(null); });
      return;
    }
    if (changes['latitude'] || changes['logitude']) {
      this._markerManager.updateMarkerPosition(this);
    }
    if (changes['title']) {
      this._markerManager.updateTitle(this);
    }
    if (changes['label']) {
      this._markerManager.updateLabel(this);
    }
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'GoogleMapMarker-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() { this._markerManager.deleteMarker(this); }
}
