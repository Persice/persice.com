import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './main-mobile.routing';
import { MainMobileComponent } from './main-mobile.component';
import { MAIN_MOBILE_DECLARATIONS } from './main-mobile.declarations';
import { SharedModule } from '../../app/shared.module';
import { EventHeroMobileComponent} from './events/event/event-hero/event-hero-mobile.component';
import { EventRsvpMobileComponent} from './events/event/event-rsvp/event-rsvp-mobile.component';
import { EventDetailsMobileComponent } from './events/event/event-details/event-details-mobile.component';
import { EventAttendeesPreviewMobileComponent } from './events/event/event-attendees-preview/event-attendees-preview-mobile.component';
import { EventDetailsBottomMobileComponent } from './events/event/event-details-bottom/event-details-bottom-mobile.component';
import { EventNotFoundMobileComponent } from './events/event/event-not-found/event-not-found-mobile.component';
import { EventMobileComponent } from './events/event/event-mobile.component';
import { UserCardMobileComponent } from '../shared/components/user-card/user-card-mobile.component';
import { EventsNotFoundMobileComponent } from './events/events-not-found/events-not-found-mobile.component';
import { EventSummaryComponent } from './events/event-summary/event-summary.component';
import { FilterMobileComponent } from '../shared/components/filter/filter-mobile.component';
import { EventDescriptionMobileComponent } from './events/event/event-hero/event-description/event-description-mobile.component';
import { RsvpElementComponent } from '../../common/events/rsvp-element/rsvp-element.component';
import { PageTitleComponent } from './header/page-title/page-title.component';
import { PageTitleConversationsComponent } from './header/page-title-conversations/page-title-conversations.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    // events
    EventSummaryComponent,
    EventsNotFoundMobileComponent,
    FilterMobileComponent,

    // events -> event
    EventMobileComponent,
    EventHeroMobileComponent,
    EventRsvpMobileComponent,
    EventDetailsMobileComponent,
    EventAttendeesPreviewMobileComponent,
    EventDetailsBottomMobileComponent,
    EventNotFoundMobileComponent,

    // events -> attendees
    UserCardMobileComponent,

    // events -> event-hero
    EventDescriptionMobileComponent,

    // events -> event-summary
    RsvpElementComponent,

    // header
    PageTitleComponent,
    PageTitleConversationsComponent,
  ],
  declarations: [
    MainMobileComponent,
    MAIN_MOBILE_DECLARATIONS,

    // events
    EventSummaryComponent,
    EventsNotFoundMobileComponent,
    FilterMobileComponent,

    // events -> event
    EventMobileComponent,
    EventHeroMobileComponent,
    EventRsvpMobileComponent,
    EventDetailsMobileComponent,
    EventAttendeesPreviewMobileComponent,
    EventDetailsBottomMobileComponent,
    EventNotFoundMobileComponent,

    // events -> attendees
    UserCardMobileComponent,

    // events -> event-hero
    EventDescriptionMobileComponent,

    // events -> event-summary
    RsvpElementComponent,

    // header
    PageTitleComponent,
    PageTitleConversationsComponent,
  ],
  providers: [],
})
export class MainMobileModule {
}
