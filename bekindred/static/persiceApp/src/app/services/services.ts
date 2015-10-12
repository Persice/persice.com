import {userServiceInjectables} from './user.service';
import {searchServiceInjectables} from './search.service';
import {crowdServiceInjectables} from './crowd.service';
import {filterServiceInjectables} from './filter.service';

export * from './user.service';
export * from './search.service';
export * from './crowd.service';
export * from './filter.service';

export var APP_SERVICES_BINDINGS: Array<any> = [
  userServiceInjectables,
  searchServiceInjectables,
  crowdServiceInjectables,
  filterServiceInjectables
];
