import {userServiceInjectables} from './user.service';
import {searchServiceInjectables} from './search.service';
import {crowdServiceInjectables} from './crowd.service';
import {connectionsServiceInjectables} from './connections.service';
import {filterServiceInjectables} from './filter.service';
import {interestsServiceInjectables} from './interests.service';
import {mutualfriendsServiceInjectables} from './mutualfriends.service';
import {friendServiceInjectables} from './friend.service';
import {keywordsServiceInjectables} from './keywords.service';
import {notificationServiceInjectables} from './notification.service';

export * from './user.service';
export * from './search.service';
export * from './search.service';
export * from './crowd.service';
export * from './filter.service';
export * from './mutualfriends.service';
export * from './interests.service';
export * from './keywords.service';
export * from './notification.service';

export var APP_SERVICES_PROVIDERS: Array<any> = [
  userServiceInjectables,
  searchServiceInjectables,
  crowdServiceInjectables,
  connectionsServiceInjectables,
  filterServiceInjectables,
  mutualfriendsServiceInjectables,
  friendServiceInjectables,
  keywordsServiceInjectables,
  notificationServiceInjectables
];
