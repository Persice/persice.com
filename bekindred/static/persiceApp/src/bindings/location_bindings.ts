/// <reference path="../typings/_custom.d.ts" />
import {provide} from 'angular2/angular2';
import {
LocationStrategy,
HashLocationStrategy,
PathLocationStrategy
} from 'angular2/router'
;
export const PATH_LOCATION_BINDINGS = [
  provide(LocationStrategy, { useClass: PathLocationStrategy })
];

export const HASH_LOCATION_BINDINGS = [
  provide(LocationStrategy, { useClass: HashLocationStrategy })
];
