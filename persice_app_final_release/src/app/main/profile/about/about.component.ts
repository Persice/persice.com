import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../../common/view-more/view-more.component';

@Component({
  selector: 'prs-profile-about',
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent extends ViewMoreComponent {
  @Input() set about(value: string) {
    this.setInitialState(value);
  };

  @Input() editable: boolean;
  @Output() openEdit: EventEmitter<any> = new EventEmitter;

  constructor() {
    super(100);
  }
}
