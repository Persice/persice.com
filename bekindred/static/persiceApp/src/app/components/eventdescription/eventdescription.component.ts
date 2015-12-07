/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgIf} from 'angular2/angular2';

let view = require('./eventdescription.html');

@Component({
  selector: 'event-description',
  template: view,
  directives: [NgIf]
})
export class EventDescriptionComponent {
  @Input() description;
  descriptionMore: string = '';
  hideMoreLink: boolean = true;

  ngOnChanges(values) {
    if (values.description && values.description.currentValue) {


      if (values.description.currentValue.length > 200) {
        this.descriptionMore = values.description.currentValue.substring(0, 199) + '...';
        this.hideMoreLink = false;
      }
      else {
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
