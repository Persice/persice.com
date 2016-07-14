import { Component, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { InboxService, MessagesCounterService, WebsocketService } from '../../shared/services';
import { ThreadListComponent } from '../../shared/components/thread-list';
import { LoadingComponent } from '../../shared/components/loading';

@Component({
  selector: 'prs-conversations',
  directives: [
    ThreadListComponent,
    LoadingComponent
  ],
  template: `
    <aside class="chat-sidebar is-scrollable-y" id="inbox" (selected)="navigateToConversation($event)">
      <prs-thread-list (selected)="onSelect($event)" [active]="activeThread" [threads]="threads"></prs-thread-list>
      <prs-loading [status]="loadingInbox"></prs-loading>
    </aside>
  `
})
export class ConversationsComponent implements OnInit, OnDestroy {
  @Output() selected: EventEmitter<any> = new EventEmitter();
  threads: Array<any> = [];
  loadingInbox: boolean = false;
  loadingInboxFinished: boolean = false;
  isInboxEmpty: boolean = false;
  inboxNext: string = '';
  inboxServiceInstance;
  websocketServiceInstance;
  activeThread = null;

  constructor(
    private inboxService: InboxService,
    private messagesCounterService: MessagesCounterService,
    private websocketService: WebsocketService,
    private element: ElementRef
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.messagesCounterService.refreshCounter();
    }, 500);

    //subscribe to inbox service updates
    this.inboxServiceInstance = this.inboxService.serviceObserver()
      .subscribe((res) => {
        this.loadingInbox = res.loading;
        this.threads = res.data;
        this.loadingInboxFinished = res.finished;
        this.isInboxEmpty = res.isEmpty;
        this.inboxNext = res.next;
        this.activeThread = res.selected;

        if (this.loadingInboxFinished === false) {
          jQuery('#inbox').bind('scroll', this.handleScrollEvent.bind(this));
        } else {
          jQuery('#inbox').unbind('scroll');
        }

      });

    //start loading inbox
    this.inboxService.startLoadingInbox();

    this.websocketServiceInstance = this.websocketService.on('messages:new').subscribe((data: any) => {

      if (this.activeThread !== null) {
        this.inboxService.markRead(this.activeThread);
      }


      setTimeout(() => {
        this.inboxService.addSender(data.friend_id);
        this.messagesCounterService.refreshCounter();
      }, 500);

    });

  }

  onSelect(thread) {
    this.inboxService.select(thread.threadId);
    this.selected.next(thread.threadId);
  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery('#inbox').scrollTop();
    let threshold = jQuery(document).height() - jQuery('#inbox').height() - 60;

    if (this.inboxNext && scrollOffset > threshold) {
      if (!this.loadingInbox) {
        this.inboxService.loadMore();
      }
    }

  }

  ngOnDestroy() {
    if (this.inboxServiceInstance) {
      this.inboxServiceInstance.unsubscribe();
    }
    if (this.websocketServiceInstance) {
      this.websocketServiceInstance.unsubscribe();
    }

  }
}
