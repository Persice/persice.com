import {
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChange,
  Input,
  Output,
  OnInit
} from '@angular/core';
import { InfoWindowManager } from '../services/managers/info-window-manager';
import { GoogleMapMarker } from './google-map-marker';

let infoWindowId = 0;

/**
 * GoogleMapInfoWindow renders a info window inside a {@link GoogleMapMarker} or standalone.
 *
 * ### Example
 * ```typescript
 * import {Component} from 'angular2/core';
 * import {GoogleMap, GoogleMapMarker, GoogleMapInfoWindow} from
 * 'angular2google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [GoogleMap, GoogleMapMarker, GoogleMapInfoWindow],
 *  styles: [`
 *    .google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <google-map-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *        <google-map-info-window [disableAutoPan]="true">
 *          Hi, this is the content of the <strong>info window</strong>
 *        </google-map-info-window>
 *      </google-map-marker>
 *    </google-map>
 *  `
 * })
 * ```
 */
@Component({
  selector: 'google-map-info-window',
  template: `<div class='google-map-info-window-content'>
      <ng-content></ng-content>
    </div>
  `
})
export class GoogleMapInfoWindow implements OnInit, OnDestroy, OnChanges {
  private static _infoWindowOptionsInputs: string[] = ['disableAutoPan', 'maxWidth'];
  /**
   * The latitude position of the info window (only usefull if you use it ouside of a {@link
    * GoogleMapMarker}).
   */
  @Input() latitude: number;

  /**
   * The longitude position of the info window (only usefull if you use it ouside of a {@link
    * GoogleMapMarker}).
   */
  @Input() longitude: number;

  /**
   * Disable auto-pan on open. By default, the info window will pan the map so that it is fully
   * visible when it opens.
   */
  @Input() disableAutoPan: boolean;

  /**
   * All InfoWindows are displayed on the map in order of their zIndex, with higher values
   * displaying in front of InfoWindows with lower values. By default, InfoWindows are displayed
   * according to their latitude, with InfoWindows of lower latitudes appearing in front of
   * InfoWindows at higher latitudes. InfoWindows are always displayed in front of markers.
   */
  zIndex: number;

  /**
   * Maximum width of the infowindow, regardless of content's width. This value is only considered
   * if it is set before a call to open. To change the maximum width when changing content, call
   * close, update maxWidth, and then open.
   */
  maxWidth: number;

  /**
   * Holds the marker that is the host of the info window (if available)
   */
  hostMarker: GoogleMapMarker;

  /**
   * Holds the native element that is used for the info window content.
   */
  content: Node;

  /**
   * Sets the open state for the InfoWindow. You can also call the open() and close() methods.
   */
  @Input() isOpen: boolean = false;

  /**
   * Emits an event when the info window is closed.
   */
  @Output() infoWindowClose: EventEmitter<void> = new EventEmitter<void>();

  private _infoWindowAddedToManager: boolean = false;
  private _id: string = (infoWindowId++).toString();

  constructor(private _infoWindowManager: InfoWindowManager, private _el: ElementRef) {}

  ngOnInit() {
    this.content = this._el.nativeElement.querySelector('.google-map-info-window-content');
    this._infoWindowManager.addInfoWindow(this);
    this._infoWindowAddedToManager = true;
    this._updateOpenState();
  }

  /** @internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (!this._infoWindowAddedToManager) {
      return;
    }
    if ((changes['latitude'] || changes['longitude']) && typeof this.latitude === 'number' &&
      typeof this.longitude === 'number') {
      this._infoWindowManager.setPosition(this);
    }
    if (changes['zIndex']) {
      this._infoWindowManager.setZIndex(this);
    }
    if (changes['isOpen']) {
      this._updateOpenState();
    }
    this._setInfoWindowOptions(changes);
  }

  /**
   * Opens the info window.
   */
  open(): Promise<void> { return this._infoWindowManager.open(this); }

  /**
   * Closes the info window.
   */
  close(): Promise<void> {
    return this._infoWindowManager.close(this).then(() => { this.infoWindowClose.emit(void 0); });
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'GoogleMapInfoWindow-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() { this._infoWindowManager.deleteInfoWindow(this); }

  private _updateOpenState() {
    this.isOpen ? this._infoWindowManager.open(this) : this._infoWindowManager.close(this);
  }

  private _setInfoWindowOptions(changes: {[key: string]: SimpleChange}) {
    let options: {[propName: string]: any} = {};
    let optionKeys = Object.keys(changes).filter(
      k => GoogleMapInfoWindow._infoWindowOptionsInputs.indexOf(k) !== -1);
    optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
    this._infoWindowManager.setOptions(this, options);
  }


}
