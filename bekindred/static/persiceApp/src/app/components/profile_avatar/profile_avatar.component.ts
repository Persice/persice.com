import {Component, Input} from 'angular2/core';

import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {SlickDirective} from '../../directives/slick.directive';

@Component({
  selector: 'profile-avatar',
  directives: [
    CircleProgressDirective,
    SlickDirective
  ],
  template: `
  <div class="match-profile__avatar-place mt+">
    <div class="match-profile__avatar"
    slick show="1"
    append=".match-profile__avatar-nav"
    dots="true"
    arrows="false"
    infinite="false"
    scroll="1"
    *ngIf="count > 1">
      <div class="avatar-holder"
        *ngFor="#image of images"
        [ngStyle]="{'background-image': 'url(' + image.photo + ')'}">
      </div>
    </div>
    <div class="match-profile__avatar"
    *ngIf="count === 0 || count === 1">
      <div class="avatar-holder"
      [ngStyle]="{'background-image': 'url(' + avatar + ')'}">
      </div>
    </div>
    <div circle-progress="{{score}}"
    size="246"
    thickness="4"
    reverse="true"
    angle="55"
    class="match-percent-large">
    </div>
    <div class="match-profile__similar">
      <span class="match-profile__similar__value">{{score}}%</span>
      <span class="match-profile__similar__label">Similar</span>
    </div>
  </div>
  <div class="match-profile__avatar-nav mb"></div>
  `
})
export class ProfileAvatarComponent {
  @Input() avatar;
  @Input() images;
  @Input() score;
  @Input() count;
}
