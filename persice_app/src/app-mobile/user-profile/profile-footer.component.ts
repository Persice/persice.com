import {Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-mobile-profile-footer',
  template: require('./profile-footer.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFooterMobileComponent {

  // When [score] from Input property change, set internal state for our component
  @Input() set score(score: number) {
    this._setState(score);
  }

  // Component main state
  public matchScore: number = 0;

  /**
   * Set matchScore
   * @param {number} score
   */
  private _setState(score: number) {
    this.matchScore = score;

  }

}
