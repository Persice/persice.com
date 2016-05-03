import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {CheckImageDirective} from "../../../../app/shared/directives";
import {GenderPipe} from '../../../../app/shared/pipes';
import {ObjectUtil} from '../../../../app/shared/core';
@Component({
  selector: 'prs-mobile-user-card',
  template: require('./user-card-mobile.html'),
  directives: [CheckImageDirective],
  pipes: [GenderPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardMobileComponent {
  @Input() set person (value: any) {
    this._person = value;
    let topInterests = ObjectUtil.firstSorted(value.top_interests[0], 6);
    let halfLength = Math.ceil(topInterests.length / 2);
    this.interestsLeftHalf = topInterests.splice(0, halfLength);
    this.interestsRightHalf = topInterests;
  };
  @Output() onProfileTap: EventEmitter<any> = new EventEmitter();

  // Person object which is displayed in the component template
  _person: any;

  // Collection of top interests split in two groups of three
  interestsLeftHalf: any[] = [];
  interestsRightHalf: any[] = [];

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
