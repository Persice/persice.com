import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../../common/view-more';

@Component({
  selector: 'prs-mobile-profile-about-me',
  templateUrl: './about-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMobileComponent extends ViewMoreComponent {
  @Input('about') set about(value: string) {
    this.setInitialState(value);
  }

  @Input('type') type: any;
}
