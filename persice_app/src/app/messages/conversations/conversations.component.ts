import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../shared/services';
import { ThreadListComponent } from '../../shared/components/thread-list';
import { LoadingComponent } from '../../shared/components/loading';
import { Conversation } from '../../../common/models/conversation/conversation.model';
import { Observable, Subscription } from 'rxjs';
import { ConversationsService } from '../../../common/messages/conversations.service';
import { ConversationsHeaderComponent } from './conversations-header.component';

@Component({
  selector: 'prs-conversations',
  directives: [
    ThreadListComponent,
    LoadingComponent,
    ConversationsHeaderComponent
  ],
  template: <any>require('./conversations.html')
})
export class ConversationsComponent implements OnInit, OnDestroy {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  private conversations: Observable<Conversation[]>;
  private selectedConservation: Observable<Conversation>;
  private count: Observable<number>;
  private loading: Observable<boolean>;
  private loaded: Observable<boolean>;
  private websocketServiceInstance: Subscription;
  private loadedSub: Subscription;

  constructor(
    private conversationsService: ConversationsService,
    private websocketService: WebsocketService
  ) {
    this.conversations = this.conversationsService.conversations$;
    this.selectedConservation = this.conversationsService.selectedConversation$;
    this.count = this.conversationsService.count$;
    this.loading = this.conversationsService.loading$;
    this.loaded = this.conversationsService.loaded$
  }

  ngOnInit() {
    this.conversationsService.emptyConversations();
    this.conversationsService.loadConversations();

    this.loadedSub = this.loaded.subscribe((loaded: boolean) => {
      if (loaded === false) {
        jQuery('#inbox').bind('scroll', this.handleScrollEvent.bind(this));
      } else {
        jQuery('#inbox').unbind('scroll');
      }
    });

    this.websocketServiceInstance = this.websocketService.on('messages:new').subscribe((data: any) => {
      this.conversationsService.receivedNewMessage(data);
    });
  }

  ngOnDestroy() {
    if (this.loadedSub) {
      this.loadedSub.unsubscribe();
    }

    if (this.websocketServiceInstance) {
      this.websocketServiceInstance.unsubscribe();
    }
  }

  private onSelect(conversation: Conversation): void {
    this.conversationsService.setSelectedConversationId(null);
    this.conversationsService.selectConversation(conversation);

    this.selected.emit(conversation.id);
  }

  private handleScrollEvent(): void {
    let scrollOffset = jQuery('#inbox').scrollTop();
    let threshold = jQuery(document).height() - jQuery('#inbox').height() - 60;

    if (scrollOffset > threshold) {
        this.conversationsService.loadConversations();
    }
  }
}
