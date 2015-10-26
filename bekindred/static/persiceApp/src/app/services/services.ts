import {userServiceInjectables} from './user.service';
import {searchServiceInjectables} from './search.service';
import {crowdServiceInjectables} from './crowd.service';
import {connectionsServiceInjectables} from './connections.service';
import {filterServiceInjectables} from './filter.service';
import {mutualfriendsServiceInjectables} from './mutualfriends.service';

export * from './user.service';
export * from './search.service';
export * from './crowd.service';
export * from './filter.service';

export var APP_SERVICES_PROVIDERS: Array<any> = [
  userServiceInjectables,
  searchServiceInjectables,
  crowdServiceInjectables,
  connectionsServiceInjectables,
  filterServiceInjectables,
  mutualfriendsServiceInjectables
];
