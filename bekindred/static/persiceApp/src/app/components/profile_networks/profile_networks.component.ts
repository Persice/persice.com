import {Component, Input} from 'angular2/core';

@Component({
  selector: '.profile-networks',
  template: `
  <div class="layout__item">
    <h4 class="module-title mb-">Networks</h4>
  </div>
  <div class="layout__item">
    <a target="_new" class="mr-" href="{{url.facebook}}" *ngIf="url.facebook !== ''">
      <svg role="img" class="icon icon--medium">
        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-facebook_middle"></use>
      </svg>
    </a>
    <a target="_new" class="mr-" href="{{url.twitter}}" *ngIf="url.twitter !== ''">
      <svg role="img" class="icon icon--medium">
        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-twitter_middle"></use>
      </svg>
    </a>
    <a target="_new" class="mr-" href="{{url.linkedin}}" *ngIf="url.linkedin !== ''">
      <svg role="img" class="icon icon--medium">
        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-linkedin_middle"></use>
      </svg>
    </a>
  </div>
  `
})
export class ProfileNetworksComponent {
  @Input() url;
}
