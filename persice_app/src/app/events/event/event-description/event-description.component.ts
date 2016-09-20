import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../../common/view-more/view-more.component';
import { IgnoreMarkupPipe } from '../../../shared/pipes/ignore_markup.pipe';

@Component({
  selector: 'prs-event-description',
  template: <any>require('./event-description.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [IgnoreMarkupPipe]
})
export class EventDescriptionComponent extends ViewMoreComponent {
  @Input() set description(value: string) {
    this.setInitialState(value);
  }

  constructor() {
    super(200);
  }
}
