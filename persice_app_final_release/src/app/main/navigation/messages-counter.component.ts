import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UnreadMessagesCounterService } from '../../../common/services/unread-messages-counter.service';

@Component({
  selector: 'prs-messages-counter',
  template: `<i class="nav-main__value" [ngClass]="{'is-visible': (counter | async) > 0}">{{counter | async}}</i>`
})
export class MessagesCounterComponent implements OnInit {
  counter: Observable<number>;

  constructor(private unreadMessagesCounterService: UnreadMessagesCounterService) {
    this.counter = unreadMessagesCounterService.counter$;
  }

  ngOnInit(): any {
    this.unreadMessagesCounterService.refresh();
  }
}
