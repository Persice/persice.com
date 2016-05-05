import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {CheckImageDirective} from "../../../../app/shared/directives";
import {GenderPipe} from '../../../../app/shared/pipes';
import {Person} from "../../model/person";
import {InterestsCardMobileComponent} from "../interests-card/interests-card-mobile.component";

@Component({
  selector: 'prs-mobile-user-card',
  template: require('./user-card-mobile.html'),
  directives: [CheckImageDirective, InterestsCardMobileComponent],
  pipes: [GenderPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardMobileComponent {
  @Input() set person (dto: any) {
    this._person = new Person(dto);
  };
  @Output() onProfileTap: EventEmitter<any> = new EventEmitter();

  // Person object which is displayed in the component template
  _person: Person;

  //Whether top interests drop is visible.
  interestsVisible: boolean = false;

  /**
   * Toggle visibility of top interests
   * @param {DOM click Event} event
   */
  toggleInterestsVisible(event) {
    this.interestsVisible = !this.interestsVisible;
  }

  selectPerson(event) {
    this.onProfileTap.emit(this._person.id);
  }
}
