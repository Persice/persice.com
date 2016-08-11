import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-terms-of-service',
  template: <any>require('./terms-of-service.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceComponent {

}
