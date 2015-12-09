/// <reference path="../../../../typings/_custom.d.ts" />


import {Directive, Input, SimpleChange} from 'angular2/angular2';
import {GoogleMapsAPIWrapper} from '../services/google_maps_api_wrapper';
import {MarkerManager} from '../services/marker_manager';

let markerId = 0;

@Directive({ selector: 'google-map-marker' })
export class GoogleMapMarker {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() title: string;
  @Input() label: string;

  private _markerAddedToManger: boolean = false;
  private _id: string;

  constructor(private _markerManager: MarkerManager) { this._id = (markerId++).toString(); }

  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (!this._markerAddedToManger && this.latitude && this.longitude) {
      this._markerManager.addMarker(this);
      this._markerAddedToManger = true;
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

  id(): string { return this._id; }

  toString(): string { return 'GoogleMapMarker-' + this._id.toString(); }

  ngOnDestroy() { this._markerManager.deleteMarker(this); }
}
