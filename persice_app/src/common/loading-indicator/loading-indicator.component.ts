import {Component, Input} from '@angular/core';

@Component({
  selector: 'prs-loading-indicator',
  template: <any>require('./loading-indicator.html')
})
export class LoadingIndicatorComponent {
  @Input() show;
}
