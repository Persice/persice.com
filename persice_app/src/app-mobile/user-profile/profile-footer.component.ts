import {Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-mobile-profile-footer',
  template: require('./profile-footer.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFooterMobileComponent {
  @Input() score: number;
  @Input() type: string;

}
