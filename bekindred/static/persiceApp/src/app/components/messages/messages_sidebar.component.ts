import {Component, Input, Output, ElementRef, EventEmitter} from 'angular2/core';

/**
 * Services
 */
import {InboxService} from '../../services/inbox.service';
import {MessagesCounterService} from '../../services/messages_counter.service';
import {WebsocketService} from '../../services/websocket.service';

/**
 * Components
 */
import {ThreadListComponent} from '../thread_list/thread_list.component';
import {LoadingComponent} from '../loading/loading.component';

@Component({
  selector: '.chat-sidebar',
  directives: [
    ThreadListComponent,
    LoadingComponent
  ],
  template: `
  <thread-list (selected)="onSelect($event)" [active]="activeThread" [threads]="threads"></thread-list>
  <loading [status]="loadingInbox"></loading>
  `
})
export class MessagesSidebarComponent {
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
          jQuery(this.element.nativeElement).bind('scroll', this.handleScrollEvent.bind(this));
        } else {
          jQuery(this.element.nativeElement).unbind('scroll');
        }

      });

    //start loading inbox
    this.inboxService.startLoadingInbox();

    this.websocketServiceInstance = this.websocketService.on('messages:new').subscribe((data: any) => {
      this.inboxService.recievedMessage(data);
      this.inboxService.markRead(this.activeThread);
      setTimeout(() => {
        this.messagesCounterService.refreshCounter();
      }, 500);
    });

  }

  onSelect(thread) {
    this.inboxService.select(thread.threadId);
    this.selected.next(thread.threadId);
  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery(this.element.nativeElement).scrollTop();
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
