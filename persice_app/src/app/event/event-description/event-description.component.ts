import {Component, Input, OnChanges} from 'angular2/core';

@Component({
  selector: 'prs-event-description',
  template: `
    <h3 class="module-title">Description</h3>
    <p class="module-type">{{descriptionMore}}</p>
    <a (click)="showMore($event)" *ngIf="!hideMoreLink" class="link-blank">View more</a>
  `
})
export class EventDescriptionComponent implements OnChanges {
  @Input() description;
  descriptionMore: string = '';
  hideMoreLink: boolean = true;

  ngOnChanges(values) {
    if (values.description && values.description.currentValue) {
      if (values.description.currentValue.length > 200) {
        this.descriptionMore = values.description.currentValue.substring(0, 199) + '...';
        this.hideMoreLink = false;
      } else {
        this.descriptionMore = values.description.currentValue;
        this.hideMoreLink = true;
      }
    }
  }

  showMore() {
    this.hideMoreLink = true;
    this.descriptionMore = this.description;
  }
}
