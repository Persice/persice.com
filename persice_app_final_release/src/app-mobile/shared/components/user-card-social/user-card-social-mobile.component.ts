import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SocialProfile } from '../../../../common/models/social-profile/social-profile';

@Component({
  selector: 'prs-mobile-user-card-social',
  templateUrl: './user-card-social-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardSocialMobileComponent {
  @Input() type: string;
  @Input() person: SocialProfile;

  openLink(event: MouseEvent) {
    console.log('opening social profile', this.person);
  }
}
