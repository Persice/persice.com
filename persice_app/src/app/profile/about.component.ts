import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';


@Component({
  selector: 'prs-profile-about',
  template: `
  <h4 class="module-title mb0" *ngIf="!editable">About</h4>
  <h4 class="module-title mb0" *ngIf="editable">
  <a (click)="openEdit.next('about')" class="edit-link">About <span class="edit-link__icon">
    <svg role="img" class="icon ">
      <use xlink:href="/static/assets/icons/icons.svg#icon-edit_info"></use>
    </svg>
    </span></a>
  </h4>

  <div class="profile-feature" *ngIf="!editable">
    {{aboutMore}}
    <a (click)="showMore($event)" *ngIf="!hideMoreLink" class="link-blank">View all</a>
  </div>

  <div class="profile-feature" *ngIf="editable">
    <a (click)="openEdit.next('about')" class="edit-link">{{aboutMore}}</a>
    <a (click)="showMore($event)" *ngIf="!hideMoreLink" class="link-blank">View all</a>
  </div>
  `
})
export class AboutComponent implements OnChanges {
  @Input() about;
  @Input() editable;
  @Output() openEdit: EventEmitter<any> = new EventEmitter;
  aboutMore: string = '';
  hideMoreLink: boolean = true;

  ngOnChanges(values) {
    if (values.about && values.about.currentValue) {
      if (values.about.currentValue.length > 120) {
        this.aboutMore = values.about.currentValue.substring(0, 119) + '...';
        this.hideMoreLink = false;
      } else {
        this.aboutMore = values.about.currentValue;
        this.hideMoreLink = true;
      }
    }
  }

  showMore() {
    this.hideMoreLink = true;
    this.aboutMore = this.about;
  }
}
