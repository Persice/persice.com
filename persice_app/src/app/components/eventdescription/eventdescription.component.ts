import {Component, Input} from 'angular2/core';

let view = require('./eventdescription.html');

@Component({
  selector: 'event-description',
  template: view
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
