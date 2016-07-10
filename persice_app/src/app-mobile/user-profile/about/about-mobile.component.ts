// TOOD: make this component generic because it is used in more than one place throughout the app
import {Component, Input, ChangeDetectionStrategy } from '@angular/core';

const SHOW_CHAR_LIMIT: number = 80;

@Component({
  selector: 'prs-mobile-profile-about-me',
  template: <any>require('./about-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMobileComponent {
  @Input() type: string;
  @Input() set about(value: string) {
    this._setValue(value);
  }

  // About me less and more contents
  aboutLess: string = '';
  aboutMore: string = '';

  // Flag for showing more about me
  showMore: boolean = false;

  constructor() {}

  public toggleMore(value) {
    this.showMore = value;
  }

  private _setValue(value: string) {
    let contents = value !== null ? value : '';
    if (contents.length > SHOW_CHAR_LIMIT) {
      this.aboutLess = contents.substring(0, SHOW_CHAR_LIMIT);
      this.aboutMore = contents.substring(SHOW_CHAR_LIMIT, contents.length).trim();
    } else {
      this.aboutLess = contents;
    }
  }
}
