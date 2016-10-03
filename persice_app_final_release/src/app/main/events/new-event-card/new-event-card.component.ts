import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'prs-new-event-card',
  templateUrl: './new-event-card.html'
})
export class NewEventCardComponent implements OnDestroy {
  eventFormVisible: boolean = false;

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }
}




