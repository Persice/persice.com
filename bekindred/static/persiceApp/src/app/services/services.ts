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
import {eventsServiceInjectables} from './events.service';
import {eventServiceInjectables} from './event.service';
import {eventMessagesServiceInjectables} from './eventmessages.service';
import {eventConnectionsServiceInjectables} from './eventconnections.service';
import {eventAttendeesServiceInjectables} from './eventattendees.service';
import {eventMembersServiceInjectables} from './eventmembers.service';
import {websocketServiceInjectables} from './websocket.service';
import {offersServiceInjectables} from './offers.service';
import {goalsServiceInjectables} from './goals.service';
import {userAuthServiceInjectables} from './userauth.service';

export * from './user.service';
export * from './search.service';
export * from './search.service';
export * from './crowd.service';
export * from './filter.service';
export * from './mutualfriends.service';
export * from './interests.service';
export * from './keywords.service';
export * from './notification.service';
export * from './notification.service';
export * from './events.service';
export * from './event.service';
export * from './eventmessages.service';
export * from './eventconnections.service';
export * from './eventattendees.service';
export * from './eventmembers.service';
export * from './websocket.service';
export * from './offers.service';
export * from './goals.service';
export * from './userauth.service';

export var APP_SERVICES_PROVIDERS: Array<any> = [
  userServiceInjectables,
  searchServiceInjectables,
  crowdServiceInjectables,
  connectionsServiceInjectables,
  filterServiceInjectables,
  mutualfriendsServiceInjectables,
  friendServiceInjectables,
  keywordsServiceInjectables,
  notificationServiceInjectables,
  interestsServiceInjectables,
  eventsServiceInjectables,
  eventMessagesServiceInjectables,
  eventConnectionsServiceInjectables,
  eventAttendeesServiceInjectables,
  eventMembersServiceInjectables,
  websocketServiceInjectables,
  offersServiceInjectables,
  goalsServiceInjectables,
  userAuthServiceInjectables
];
