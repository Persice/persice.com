import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SocialProfile} from '../../../shared/model/social-profile';

@Component({
  selector: 'prs-mobile-user-card-social',
  template: <any>require('./user-card-social-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardSocialMobileComponent {
  @Input() type: string;
  @Input() person: SocialProfile;
}
