import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CheckImageDirective } from '../../../shared/directives';
import { MarkupPipe } from '../../../shared/pipes/markup.pipe';
import { EventHost } from '../../../../common/models/event/event-host';

@Component({
  selector: 'prs-event-host',
  template: <any>require('./event-host.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [MarkupPipe]
})
export class EventHostComponent {
  @Input() host: EventHost;
  @Input() eventType: string;

  constructor(private _router: Router) { }

  public openProfile(event: MouseEvent): void {
    if (this.eventType === 'persice') {
      if (!!this.host.username) {
        this._router.navigateByUrl('/' + this.host.username);
      }
    } else {
      // Open outside link for event host
      if (!!this.host.link) {
        let win = window.open(this.host.link, '_blank');
        win.focus();
      }
    }

  }

}
