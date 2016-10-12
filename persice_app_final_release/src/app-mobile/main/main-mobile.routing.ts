import { MainMobileComponent } from './main-mobile.component';
import { Routes } from '@angular/router';
import { EventsMobileComponent } from './events/events-mobile.component';
import { ConnectionsMobileComponent } from './connections';
import { EventMobileComponent } from './events/event/event-mobile.component';
import { AttendeesMobileComponent } from './events/attendees';
import { UserProfileLoaderComponent } from './user-profile-loader';
import { ConversationsMobileComponent } from './messages/conversations';
import { MessagesMobileComponent } from './messages';
import { NewConversationMobileComponent } from './messages/new-conversation';
import { ConversationMobileComponent } from './messages/conversation';
import { EditMyProfileMobileComponent } from './edit-my-profile';
import { CrowdMobileComponent } from './crowd';
import { EditInterestsMobileComponent } from './edit-my-profile/edit-interests/edit-interests-mobile.component';
import { PersonalInfoMobileComponent } from './edit-my-profile/edit-personal-info/personal-info-mobile.component';
import { ReligiousViewsMobileComponent } from './edit-my-profile/edit-religious-views/religious-views-mobile.component';
import { PoliticalViewsMobileComponent } from './edit-my-profile/edit-political-views/political-views-mobile.component';
import { EditPhotosMobileComponent } from './edit-my-profile/edit-photos/edit-photos-mobile.component';
import { EditGoalsMobileComponent } from './edit-my-profile/edit-goals/edit-goals-mobile.component';
import { EditOffersMobileComponent } from './edit-my-profile/edit-offers/edit-offers-mobile.component';
import { EditSocialAccountsMobileComponent } from './edit-my-profile/edit-social-accounts/edit-social-accounts-mobile.component';
import { EditMyProfileNavigationComponent } from './edit-my-profile/navigation/edit-my-profile-navigation.component';

export const routes: Routes = [
  {
    path: '',
    component: MainMobileComponent,
    children: [
      { path: '', redirectTo: '/events/all/list', pathMatch: 'full' },
      { path: 'crowd', component: CrowdMobileComponent },
      { path: 'pals', component: ConnectionsMobileComponent },
      { path: 'events/:type/list', component: EventsMobileComponent },
      { path: 'events', redirectTo: '/events/all/list' },
      { path: 'event/:eventId', component: EventMobileComponent },
      { path: 'event/:eventId/attendees', component: AttendeesMobileComponent },
      {
        path: 'messages',
        component: MessagesMobileComponent,
        children: [
          { path: '', component: ConversationsMobileComponent },
          { path: 'new', component: NewConversationMobileComponent },
          { path: ':senderId', component: ConversationMobileComponent }
        ]
      },
      {
        path: 'edit-profile',
        component: EditMyProfileMobileComponent,
        children: [
          { path: '', component: EditMyProfileNavigationComponent },
          { path: 'interests', component: EditInterestsMobileComponent },
          { path: 'personal', component: PersonalInfoMobileComponent },
          { path: 'religious', component: ReligiousViewsMobileComponent },
          { path: 'political', component: PoliticalViewsMobileComponent },
          { path: 'photos', component: EditPhotosMobileComponent },
          { path: 'goals', component: EditGoalsMobileComponent },
          { path: 'offers', component: EditOffersMobileComponent },
          { path: 'accounts', component: EditSocialAccountsMobileComponent }
        ]
      },
      { path: ':username', component: UserProfileLoaderComponent }
    ]
  }
];
