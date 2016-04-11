import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: '.profile-networks',
  template: `
  <h4 class="module-title mb-" *ngIf="!editable">Networks</h4>
  <h4 class="module-title mb-" *ngIf="editable">
    <a (click)="openEdit.next('profile')" class="edit-link">Networks
      <span class="edit-link__icon">
        <svg role="img" class="icon ">
          <use xlink:href="/static/assets/icons/icons.svg#icon-edit_info"></use>
        </svg>
      </span>
    </a>
  </h4>
  <div>
    <a target="_new" class="mr-" href="{{url.facebook}}" *ngIf="url.facebook !== ''">
      <svg role="img" class="icon icon--medium">
        <use xlink:href="/static/assets/icons/icons.svg#icon-facebook_middle"></use>
      </svg>
    </a>
    <a target="_new" class="mr-" href="{{url.twitter}}" *ngIf="url.twitter !== ''">
      <svg role="img" class="icon icon--medium">
        <use xlink:href="/static/assets/icons/icons.svg#icon-twitter_middle"></use>
      </svg>
    </a>
    <a target="_new" class="mr-" href="{{url.linkedin}}" *ngIf="url.linkedin !== ''">
      <svg role="img" class="icon icon--medium">
        <use xlink:href="/static/assets/icons/icons.svg#icon-linkedin_middle"></use>
      </svg>
    </a>
  </div>
  `
})
export class NetworksComponent {
  @Input() url;
  @Input() editable;
  @Output() openEdit: EventEmitter<any> = new EventEmitter();
}
