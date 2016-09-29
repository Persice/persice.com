import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../../../../common/view-more';

@Component({
  selector: 'prs-mobile-event-description',
  templateUrl: './event-description-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDescriptionMobileComponent extends ViewMoreComponent {
  @Input() set description(value: string) {
    this.setInitialState(value);
  }

  @Input() type;
}
