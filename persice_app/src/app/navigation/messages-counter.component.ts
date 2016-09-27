import { Component, OnInit } from '@angular/core';
import { UnreadMessagesCounterService } from '../../common/services/unread-messages-counter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'prs-messages-counter',
  template: `
  <i class="nav-main__value" [ngClass]="{'is-visible': (counter | async) > 0}">{{counter | async}}</i>
  `,
  providers: [ UnreadMessagesCounterService ]
})
export class MessagesCounterComponent implements OnInit {
  private counter: Observable<number>;

  constructor(private unreadMessagesCounterService: UnreadMessagesCounterService) {
    this.counter = unreadMessagesCounterService.counter$;
  }

  ngOnInit(): any {
    this.unreadMessagesCounterService.refresh();
  }
}
