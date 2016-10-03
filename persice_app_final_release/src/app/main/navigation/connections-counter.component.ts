import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionsCounterService } from '../../../common/services/connections_counter.service';

@Component({
  selector: 'prs-connections-counter',
  template: `<i class="nav-main__value" [ngClass]="{'is-visible': counter > 0}">{{counter}}</i>`
})
export class ConnectionsCounterComponent implements OnInit, OnDestroy {
  counter = 0;
  serviceInstance;

  constructor(private service: ConnectionsCounterService) {

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
