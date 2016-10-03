import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Person } from '../../../../common/models/person/index';

@Component({
  selector: 'prs-mobile-interests-card',
  templateUrl: './interests-card-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterestsCardMobileComponent {
  @Input() set person(person: Person) {
    this._person = person;
  };

  // Person object which is displayed in the component template
  _person: Person;
}
