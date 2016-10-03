import { NavigationMobileComponent } from '../navigation';
import { CloseLeftMenuDirective, OpenLeftMenuDirective } from '../shared/directives';
import { HeaderComponent } from './header';
import { ProfileFooterMobileComponent } from './user-profile/footer';
import { FooterButtonMobileComponent } from './footer-button';
import { ConnectionsMobileComponent } from './connections';
import { FilterMobileComponent } from '../shared/components/filter';
import { UserCardMobileComponent } from '../shared/components/user-card';
import { UserProfileComponent } from './user-profile';
import { DROPDOWN_DIRECTIVES } from '../shared/directives/dropdown';
import { KeywordsComponentMobile } from '../shared/components/keywords';
import { InterestsCardMobileComponent } from '../shared/components/interests-card';
import { CrowdMobileComponent } from './crowd';
import { ArrangePhotosComponent } from './edit-my-profile/edit-photos/arrange-photos';
import { ChooseAlbumComponent } from './edit-my-profile/edit-photos/choose-album';
import { CropPhotoComponent } from './edit-my-profile/edit-photos/crop-photo';
import { EditPhotoThumbComponent } from './edit-my-profile/edit-photos/arrange-photos/edit-photo-thumb';
import { EditProfilePhotoComponent } from './edit-my-profile/edit-photos/arrange-photos/edit-profile-photo';
import { EditAboutMobileComponent } from './edit-my-profile/edit-personal-info/edit-about';
import { AttendeesMobileComponent } from './events/attendees';
import { EventsMobileComponent } from './events';
import { EventMobileComponent } from './events/event/event-mobile.component';
import { EventRsvpMobileComponent } from './events/event/event-rsvp/event-rsvp-mobile.component';
import { EventNotFoundMobileComponent } from './events/event/event-not-found';
import { EventHeroMobileComponent } from './events/event/event-hero';
import { EventDescriptionMobileComponent } from './events/event/event-hero/event-description';
import { EventDetailsBottomMobileComponent } from './events/event/event-details-bottom';
import { EventsNotFoundMobileComponent } from './events/events-not-found';
import { EventDetailsMobileComponent } from './events/event/event-details';
import { EventAttendeesPreviewMobileComponent } from './events/event/event-attendees-preview';
import { EventSummaryComponent } from './events/event-summary';
import { PageTitleComponent } from './header/page-title';
import { PageTitleConversationsComponent } from './header/page-title-conversations';
import { ConversationMobileComponent } from './messages/conversation';
import { ConversationHeaderMobileComponent } from './messages/conversation/conversation-header';
import { ConversationInputMobileComponent } from './messages/conversation/conversation-input';
import { ConversationMessagesMobileComponent } from './messages/conversation/conversation-messages';
import { ConversationMessageMobileComponent } from './messages/conversation/conversation-message/conversation-message-mobile.component';
import { ConversationsListMobileComponent } from './messages/conversations/conversations-list';
import { ConversationsMobileComponent } from './messages/conversations';
import { NewConversationMobileComponent } from './messages/new-conversation';
import { MessagesMobileComponent } from './messages';
import { ItemsListMobileComponent } from './user-profile/items-list';
import { LikesMobileComponent } from './user-profile/likes';
import { AboutMobileComponent } from './user-profile/about';
import { PhotosMobileComponent } from './user-profile/photos';
import { NetworkPreviewComponent } from './user-profile/network-preview';
import { NetworkConnectionsComponent } from './user-profile/network-connections';
import { UserCardSocialMobileComponent } from '../shared/components/user-card-social';
import { NetworkMutualConnectionsComponent } from './user-profile/network-mutual-connections';
import { UserProfileLoaderComponent } from './user-profile-loader';
import { RsvpMobileComponent } from './events/rsvp/rsvp-mobile.component';
import { EditMyProfileMobileComponent } from './edit-my-profile';
import { EditInterestsMobileComponent } from './edit-my-profile/edit-interests/edit-interests-mobile.component';
import { EditGoalsMobileComponent } from './edit-my-profile/edit-goals/edit-goals-mobile.component';
import { EditSocialAccountsMobileComponent } from './edit-my-profile/edit-social-accounts/edit-social-accounts-mobile.component';
import { ReligiousViewsMobileComponent } from './edit-my-profile/edit-religious-views/religious-views-mobile.component';
import { PoliticalViewsMobileComponent } from './edit-my-profile/edit-political-views/political-views-mobile.component';
import { EditPhotosMobileComponent } from './edit-my-profile/edit-photos/edit-photos-mobile.component';
import { PersonalInfoMobileComponent } from './edit-my-profile/edit-personal-info/personal-info-mobile.component';
import { EditOffersMobileComponent } from './edit-my-profile/edit-offers/edit-offers-mobile.component';
import { EditMyProfileNavigationComponent } from './edit-my-profile/navigation/edit-my-profile-navigation.component';
import { ChoosePhotoComponent } from './edit-my-profile/edit-photos/choose-photo/choose-photo.component';

export const MAIN_MOBILE_DECLARATIONS = [
  CrowdMobileComponent,
  ConnectionsMobileComponent,
  NavigationMobileComponent,

  HeaderComponent,
  FooterButtonMobileComponent,
  PageTitleComponent,
  PageTitleConversationsComponent,

  FilterMobileComponent,
  UserCardMobileComponent,
  UserCardSocialMobileComponent,

  KeywordsComponentMobile,
  InterestsCardMobileComponent,

  // Events
  EventsMobileComponent,
  AttendeesMobileComponent,
  EventMobileComponent,
  EventRsvpMobileComponent,
  EventNotFoundMobileComponent,
  EventHeroMobileComponent,
  EventDescriptionMobileComponent,
  EventDetailsBottomMobileComponent,
  EventDetailsMobileComponent,
  EventAttendeesPreviewMobileComponent,
  EventSummaryComponent,
  EventsNotFoundMobileComponent,
  RsvpMobileComponent,

  // Messages
  MessagesMobileComponent,
  ConversationMobileComponent,
  ConversationHeaderMobileComponent,
  ConversationInputMobileComponent,
  ConversationMessagesMobileComponent,
  ConversationMessageMobileComponent,
  ConversationsMobileComponent,
  ConversationsListMobileComponent,
  NewConversationMobileComponent,

  // User profile
  UserProfileLoaderComponent,
  UserProfileComponent,
  PhotosMobileComponent,
  NetworkPreviewComponent,
  NetworkConnectionsComponent,
  NetworkMutualConnectionsComponent,
  AboutMobileComponent,
  ItemsListMobileComponent,
  LikesMobileComponent,
  ProfileFooterMobileComponent,

  // Edit profile
  EditMyProfileMobileComponent,
  EditMyProfileNavigationComponent,
  EditSocialAccountsMobileComponent,
  ReligiousViewsMobileComponent,
  PoliticalViewsMobileComponent,
  EditPhotosMobileComponent,
  ArrangePhotosComponent,
  ChooseAlbumComponent,
  ChoosePhotoComponent,
  CropPhotoComponent,
  EditPhotoThumbComponent,
  EditProfilePhotoComponent,
  PersonalInfoMobileComponent,
  EditAboutMobileComponent,
  EditOffersMobileComponent,
  EditInterestsMobileComponent,
  EditGoalsMobileComponent,

  // Directives
  OpenLeftMenuDirective,
  CloseLeftMenuDirective,
  DROPDOWN_DIRECTIVES,

];
