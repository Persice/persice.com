import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'prs-mobile-counter',
  template: require('./counter.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  @Input() counter: number;
  @Input() type: string;
}
