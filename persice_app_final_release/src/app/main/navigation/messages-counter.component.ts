import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesCounterService } from '../../../common/services/messages_counter.service';

@Component({
  selector: 'prs-messages-counter',
  template: `<i class="nav-main__value" [ngClass]="{'is-visible': counter > 0}">{{counter}}</i>`
})
export class MessagesCounterComponent implements OnInit, OnDestroy {
  counter = 0;
  serviceInstance;

  constructor(private service: MessagesCounterService) {

  }

  ngOnInit() {
    this.serviceInstance = this.service.serviceObserver()
      .subscribe((data) => {
        this.counter = data.counter;
      });
  }

  ngOnDestroy() {
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }

}
