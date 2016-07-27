import { GoogleMap } from './directives/google-map';
import { GoogleMapCircle } from './directives/google-map-circle';
import { GoogleMapInfoWindow } from './directives/google-map-info-window';
import { GoogleMapMarker } from './directives/google-map-marker';

export const GOOGLE_MAPS_DIRECTIVES: any[] =
  [GoogleMap, GoogleMapMarker, GoogleMapInfoWindow, GoogleMapCircle];
