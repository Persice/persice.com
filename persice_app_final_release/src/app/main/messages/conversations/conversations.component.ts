import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../../../common/services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import { Conversation } from '../../../../common/models/conversation/conversation.model';
import { ConversationsService } from '../../../../common/services/conversations.service';

@Component({
  selector: 'prs-conversations',
  templateUrl: './conversations.html'
})
export class ConversationsComponent implements OnInit, OnDestroy {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  conversations: Observable<Conversation[]>;
  selectedConservation: Observable<Conversation>;
  count: Observable<number>;
  loading: Observable<boolean>;
  loaded: Observable<boolean>;
  websocketServiceInstance: Subscription;
  loadedSub: Subscription;

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
    this.conversationsService.resetData();
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
    this.conversationsService.setSelectedConversationId(null);

    if (this.loadedSub) {
      this.loadedSub.unsubscribe();
    }

    if (this.websocketServiceInstance) {
      this.websocketServiceInstance.unsubscribe();
    }
  }

  onSelect(conversation: Conversation): void {
    this.conversationsService.setSelectedConversationId(null);
    this.conversationsService.selectConversation(conversation);
    this.conversationsService.notifySelectedConversationRead();

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
