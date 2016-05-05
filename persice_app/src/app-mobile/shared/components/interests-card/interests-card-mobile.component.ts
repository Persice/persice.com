import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Person} from "../../model/person";

@Component({
  selector: 'prs-mobile-interests-card',
  template: require('./interests-card-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterestsCardMobileComponent {
  @Input() set person (person: Person) {
    this._person = person;
  };

  // Person object which is displayed in the component template
  _person: Person;
}
