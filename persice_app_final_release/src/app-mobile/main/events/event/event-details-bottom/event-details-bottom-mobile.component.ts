import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../../common/models/event/index';
import { Router } from '@angular/router';

@Component({
  selector: 'prs-mobile-event-details-bottom',
  templateUrl: './event-details-bottom-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsBottomMobileComponent implements OnInit {
  @Input() event: Event;
  @Input() count: number;

  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  public viewInterests(event: MouseEvent) {
    this.router.navigateByUrl(`/event/${this.event.id}/interests`);
  }
}

