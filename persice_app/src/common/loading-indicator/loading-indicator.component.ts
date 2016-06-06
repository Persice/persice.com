import {Component, Input} from '@angular/core';

@Component({
  selector: 'prs-loading-indicator',
  template: require('./loading-indicator.html')
})
export class LoadingIndicatorComponent {
  @Input() show;
}
