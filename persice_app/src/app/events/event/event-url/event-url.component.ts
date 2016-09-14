import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UrlDomainPipe } from '../../../../common/pipes/url-domain.pipe';

@Component({
  selector: 'prs-event-url',
  template: <any>require('./event-url.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [UrlDomainPipe]
})
export class EventUrlComponent {
  @Input() eventUrl: string;

}
