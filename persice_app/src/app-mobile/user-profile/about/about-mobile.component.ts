import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ViewMoreComponent } from '../../../common/view-more';
import { IgnoreMarkupPipe } from '../../../app/shared/pipes/ignore_markup.pipe';

@Component({
  selector: 'prs-mobile-profile-about-me',
  template: <any>require('./about-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [IgnoreMarkupPipe]
})
export class AboutMobileComponent extends ViewMoreComponent {
  @Input() set about(value: string) {
    this.setInitialState(value);
  }
}
