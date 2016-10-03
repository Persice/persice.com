import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Person } from '../../../../common/models/person/index';

@Component({
  selector: 'prs-mobile-user-card',
  templateUrl: './user-card-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardMobileComponent {
  isNewConnection: boolean = false;

  @Input() showSendMessage: boolean = false;
  @Input() isNewConnectionDisabled: boolean = false;
  @Input() showIcon: boolean = false;

  @Input() set person(dto: any) {
    this.isNewConnection = dto.seen !== undefined && dto.seen === false ? true : false;
    this._person = new Person(dto);
  };

  @Input() set personEntity(entity: any) {
    this._person = entity;
  }

  @Input() showDetails: boolean = true;

  @Output() onProfileTap: EventEmitter<any> = new EventEmitter();
  @Output() onOpenNewConversation: EventEmitter<any> = new EventEmitter();

  // Person object which is displayed in the component template
  _person: Person;

  //Whether top interests drop is visible.
  interestsVisible: boolean = false;

  /**
   * Toggle visibility of top interests
   * @param {MouseEvent} event
   */
  toggleInterestsVisible(event: MouseEvent) {
    this.interestsVisible = !this.interestsVisible;
  }

  selectPerson(event) {
    this.onProfileTap.emit(this._person);
  }
}
