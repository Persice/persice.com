import { NavigationComponent } from './navigation/navigation.component';
import { CrowdDesktopComponent } from './crowd/crowd-desktop.component';
import { ConnectionsDesktopComponent } from './connections/connections-desktop.component';
import { EditPhotosComponent } from './edit-profile/photos/edit-photos.component';
import { EditInterestsComponent } from './edit-profile/interests/edit-interests.component';
import { EditGoalsComponent } from './edit-profile/goals/edit-goals.component';
import { EditOffersComponent } from './edit-profile/offers/edit-offers.component';
import { EditAlbumsComponent } from './edit-profile/photos/edit-albums.component';
import { EditCropComponent } from './edit-profile/photos/edit-crop.component';
import { EditAboutComponent } from './edit-profile/about/edit-about.component';
import { EditFooterComponent } from './edit-profile/footer/edit-footer.component';
import { MessagesCounterComponent } from './navigation/messages-counter.component';
import { ConnectionsCounterComponent } from './navigation/connections-counter.component';
import { UsersListComponent } from '../shared/components/users-list/users-list.component';
import { UserCardComponent } from '../shared/components/users-list/user-card.component';
import { HeaderComponent } from './header/header.component';
import { DropdownComponent } from './header/dropdown.component';
import { SearchComponent } from './header/search.component';
import { AvatarComponent } from './profile/avatar/avatar.component';
import { AboutComponent } from './profile/about/about.component';
import { AcceptPassComponent } from './profile/acceptpass/acceptpass.component';
import { FriendsComponent } from './profile/connections/friends.component';
import { GalleryComponent } from './profile/gallery/gallery.component';
import { LikesComponent } from './profile/likes/likes.component';
import { NetworksComponent } from './profile/networks/networks.component';
import { ItemsComponent } from './profile/item/items.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserProfileDesktopComponent } from './profile/user-profile-desktop.component';
import { UserProfileDesktopLoader } from './user-profile-desktop-loader/profile-loader.component';
import { UserProfileDesktopCrowdPalsComponent } from './profile/user-profile-desktop-crowd-pals.component';
import { FilterDesktopComponent } from './filter/filter-desktop.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationSingleComponent } from './notifications/notification-single.component';
import { EditPersonalInfoComponent } from './edit-profile/personalinfo/edit-personalinfo.component';
import { MessagesComponent } from './messages/messages.component';
import { ConversationsComponent } from './messages/conversations/conversations.component';
import { ConversationsHeaderComponent } from './messages/conversations/conversations-header.component';
import { NewConversationHeaderComponent } from './messages/new-conversation/new-conversation-header.component';
import { ConversationHeaderComponent } from './messages/conversation/conversation-header.component';
import { MessagesListComponent } from './messages/messages-list/messages-list.component';
import { MessageComponent } from './messages/messages-list/message.component';
import { ConversationInputComponent } from './messages/conversation-input/conversation-input.component';
import { NewConversationComponent } from './messages/new-conversation/new-conversation.component';
import { ConversationComponent } from './messages/conversation/conversation.component';
import { SearchConnectionsComponent } from './messages/new-conversation/search-connections.component';
import { ThreadListComponent } from './messages/thread-list/thread-list.component';
import { ThreadComponent } from './messages/thread-list/thread.component';
import { EventsDesktopComponent } from './events/events-desktop.component';
import { EventCreateComponent } from './events/event/event-create.component';
import { NewEventCardComponent } from './events/new-event-card/new-event-card.component';
import { EventCardComponent } from './events/event-card/event-card.component';
import { EventCardInsideComponent } from './events/event-card/event-card-inside.component';
import { RsvpElementComponent } from './events/event-card/rsvp-element/rsvp-element.component';
import { EventInfoComponent } from './events/event/event-info/event-info.component';
import { EventHostComponent } from './events/event/event-host/event-host.component';
import { EventDescriptionComponent } from './events/event/event-description/event-description.component';
import { EventUrlComponent } from './events/event/event-url/event-url.component';
import { EventPhotoMapComponent } from './events/event/event-photo-map/event-photo-map.component';
import { EventDiscussionComponent } from './events/event/event-discussion/event-discussion.component';
import { EventAttendeesComponent } from './events/event/event-attendees/event-attendees.component';
import { EventEditComponent } from './events/event/event-edit.component';
import { EventsListViewComponent } from './events/events-list-view/events-list-view.component';
import { EventsMapViewComponent } from './events/events-map-view/events-map-view.component';
import { EventsCalendarViewComponent } from './events/events-calendar-view/events-calendar-view.component';
import { EventDesktopComponent } from './events/event/event-desktop.component';

export const MAIN_DECLARATIONS = [

  UsersListComponent,
  UserCardComponent,

  // Crowd and connections module
  CrowdDesktopComponent,
  ConnectionsDesktopComponent,

  // Navigation module
  NavigationComponent,
  MessagesCounterComponent,
  ConnectionsCounterComponent,

  // Header module
  HeaderComponent,
  DropdownComponent,
  SearchComponent,

  // User profile module
  AvatarComponent,
  AboutComponent,
  AcceptPassComponent,
  FriendsComponent,
  GalleryComponent,
  LikesComponent,
  NetworksComponent,
  ItemsComponent,
  EditProfileComponent,
  UserProfileDesktopComponent,
  UserProfileDesktopLoader,
  UserProfileDesktopCrowdPalsComponent,

  // Edit user profile module
  EditPersonalInfoComponent,
  EditPhotosComponent,
  EditInterestsComponent,
  EditGoalsComponent,
  EditOffersComponent,
  EditAlbumsComponent,
  EditCropComponent,
  EditAboutComponent,
  EditFooterComponent,

  // Other
  FilterDesktopComponent,
  NotificationsComponent,
  NotificationSingleComponent,

  // Messages module
  MessagesComponent,
  ConversationsComponent,
  ConversationsHeaderComponent,
  ConversationHeaderComponent,
  MessagesListComponent,
  MessageComponent,
  ConversationInputComponent,
  NewConversationHeaderComponent,
  NewConversationComponent,
  ConversationComponent,
  ConversationInputComponent,
  SearchConnectionsComponent,
  ThreadListComponent,
  ThreadComponent,

  // Events module
  EventDesktopComponent,
  EventsDesktopComponent,
  EventCreateComponent,
  NewEventCardComponent,
  EventCardComponent,
  EventCardInsideComponent,
  RsvpElementComponent,
  EventInfoComponent,
  EventHostComponent,
  EventDescriptionComponent,
  EventUrlComponent,
  EventPhotoMapComponent,
  EventDiscussionComponent,
  EventAttendeesComponent,
  EventEditComponent,
  EventsListViewComponent,
  EventsMapViewComponent,
  EventsCalendarViewComponent
];
