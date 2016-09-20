import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { Person } from '../../../../common/models/person/index';
import { InterestsCardMobileComponent } from '../interests-card/interests-card-mobile.component';
import { GenderPipe } from '../../../../app/shared/pipes/gender.pipe.ts';

@Component({
  selector: 'prs-mobile-user-card',
  template: <any>require('./user-card-mobile.html'),
  directives: [CheckImageDirective, InterestsCardMobileComponent],
  pipes: [GenderPipe],
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

  @Output() onProfileTap: EventEmitter<any> = new EventEmitter();
  @Output() onOpenNewConversation: EventEmitter<any> = new EventEmitter();

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
    this.onProfileTap.emit(this._person);
  }
}
