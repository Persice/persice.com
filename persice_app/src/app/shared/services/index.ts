import {connectionsServiceInjectables} from './connections.service';
import {eventAttendeesServiceInjectables} from './eventattendees.service';
import {eventConnectionsServiceInjectables} from './eventconnections.service';
import {eventMembersServiceInjectables} from './eventmembers.service';
import {eventMessagesServiceInjectables} from './eventmessages.service';
import {eventServiceInjectables} from './event.service';
import {eventsServiceInjectables} from './events.service';
import {facebookAlbumsServiceInjectables} from './facebook_albums.service';
import {filterServiceInjectables} from './filter.service';
import {friendServiceInjectables} from './friend.service';
import {geolocationServiceInjectables} from './geolocation.service';
import {goalsServiceInjectables} from './goals.service';
import {historyServiceInjectables} from './history.service';
import {inboxServiceInjectables} from './inbox.service';
import {interestsServiceInjectables} from './interests.service';
import {keywordsServiceInjectables} from './keywords.service';
import {likesServiceInjectables} from './likes.service';
import {locationServiceInjectables} from './location.service';
import {messagesServiceInjectables} from './messages.service';
import {messagesCounterServiceInjectables} from './messages_counter.service';
import {connectionsCounterServiceInjectables} from './connections_counter.service';
import {mutualfriendsServiceInjectables} from './mutualfriends.service';
import {myProfileServiceInjectables} from './myprofile.service';
import {notificationServiceInjectables} from './notification.service';
import {notificationsServiceInjectables} from './notifications.service';
import {offersServiceInjectables} from './offers.service';
import {onboardingServiceInjectables} from './onboarding.service';
import {photosServiceInjectables} from './photos.service';
import {politicalViewsServiceInjectables} from './politicalviews.service';
import {profileServiceInjectables} from './profile.service';
import {religiousViewsServiceInjectables} from './religiousviews.service';
import {searchServiceInjectables} from './search.service';
import {userAuthServiceInjectables} from './userauth.service';
import {userServiceInjectables} from './user.service';
import {warningServiceInjectables} from './warning.service';
import {websocketServiceInjectables} from './websocket.service';

export * from './connections.service';
export * from './event.service';
export * from './eventattendees.service';
export * from './eventconnections.service';
export * from './eventmembers.service';
export * from './eventmessages.service';
export * from './events.service';
export * from './facebook_albums.service';
export * from './filter.service';
export * from './friend.service';
export * from './geolocation.service';
export * from './goals.service';
export * from './history.service';
export * from './inbox.service';
export * from './interests.service';
export * from './keywords.service';
export * from './likes.service';
export * from './location.service';
export * from './messages.service';
export * from './messages_counter.service';
export * from './connections_counter.service';
export * from './mutualfriends.service';
export * from './myprofile.service';
export * from './notification.service';
export * from './notifications.service';
export * from './offers.service';
export * from './onboarding.service';
export * from './photos.service';
export * from './politicalviews.service';
export * from './profile.service';
export * from './religiousviews.service';
export * from './search.service';
export * from './search.service';
export * from './user.service';
export * from './userauth.service';
export * from './warning.service';
export * from './websocket.service';

export var APP_SERVICES_PROVIDERS: Array<any> = [
  connectionsServiceInjectables,
  eventAttendeesServiceInjectables,
  eventConnectionsServiceInjectables,
  eventMembersServiceInjectables,
  eventMessagesServiceInjectables,
  eventsServiceInjectables,
  facebookAlbumsServiceInjectables,
  filterServiceInjectables,
  friendServiceInjectables,
  geolocationServiceInjectables,
  goalsServiceInjectables,
  historyServiceInjectables,
  inboxServiceInjectables,
  interestsServiceInjectables,
  keywordsServiceInjectables,
  likesServiceInjectables,
  locationServiceInjectables,
  messagesServiceInjectables,
  mutualfriendsServiceInjectables,
  myProfileServiceInjectables,
  notificationServiceInjectables,
  notificationsServiceInjectables,
  offersServiceInjectables,
  onboardingServiceInjectables,
  photosServiceInjectables,
  politicalViewsServiceInjectables,
  profileServiceInjectables,
  religiousViewsServiceInjectables,
  searchServiceInjectables,
  userAuthServiceInjectables,
  userServiceInjectables,
  warningServiceInjectables,
  websocketServiceInjectables,
  messagesCounterServiceInjectables,
  connectionsCounterServiceInjectables
];
