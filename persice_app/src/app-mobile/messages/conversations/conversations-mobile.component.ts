import {Component, OnInit} from '@angular/core';
import {ConversationsMobileService} from './conversations-mobile.service';
import {ConversationsListMobileComponent} from "./conversations-list";
import {Observable} from 'rxjs';
import {Conversation} from '../../../common/models';

@Component({
  selector: 'prs-mobile-conversations',
  template: `
    <prs-mobile-conversations-list
      [conversations]="conversations | async"
      [loading]="loading | async">
    </prs-mobile-conversations-list>
  `,
  directives: [ConversationsListMobileComponent],
  providers: [ConversationsMobileService]
})
export class ConversationsMobileComponent implements OnInit {
  conversations: Observable<Conversation[]>;
  loading: Observable<boolean>;

  constructor(private conversationsService: ConversationsMobileService) {
    this.conversations = this.conversationsService.conversations$;
    this.loading = this.conversationsService.loading$;
  }

  ngOnInit() {
    this.conversationsService.loadConversations();
  }
}
