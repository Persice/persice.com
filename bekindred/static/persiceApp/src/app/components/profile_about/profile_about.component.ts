import {Component, Input} from 'angular2/core';


@Component({
  selector: 'profile-about',
  template: `
  <h4 class="module-title mb0">About</h4>
  <div class="profile-feature">
    {{aboutMore}}
    <a (click)="showMore($event)" *ngIf="!hideMoreLink" class="link-blank">View all</a>
  </div>
  `
})
export class ProfileAboutComponent {
  @Input() about;
  aboutMore: string = '';
  hideMoreLink: boolean = true;

  ngOnChanges(values) {
    if (values.about && values.about.currentValue) {


      if (values.about.currentValue.length > 220) {
        this.aboutMore = values.about.currentValue.substring(0, 219) + '...';
        this.hideMoreLink = false;
      }
      else {
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
