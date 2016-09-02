import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../../../common/view-more';
import { IgnoreMarkupPipe } from '../../../../../app/shared/pipes/ignore_markup.pipe';

@Component({
  selector: 'prs-mobile-event-description',
  template: <any>require('./event-description-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [IgnoreMarkupPipe]
})
export class EventDescriptionMobileComponent extends ViewMoreComponent {
  @Input() set description(value: string) {
    this.setInitialState(value);
  }
}
