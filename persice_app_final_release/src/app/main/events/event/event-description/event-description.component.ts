import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../../../common/view-more/view-more.component';

@Component({
  selector: 'prs-event-description',
  templateUrl: './event-description.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDescriptionComponent extends ViewMoreComponent {
  @Input() set description(value: string) {
    this.setInitialState(value);
  }

  constructor() {
    super(200);
  }
}
