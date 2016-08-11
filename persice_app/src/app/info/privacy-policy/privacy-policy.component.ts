import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-privacy-policy',
  template: <any>require('./privacy-policy.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent {

}
