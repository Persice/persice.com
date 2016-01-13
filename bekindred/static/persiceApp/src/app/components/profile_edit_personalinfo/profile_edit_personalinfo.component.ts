import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';

import {GenderPipe} from '../../pipes/gender.pipe';

let view = require('./profile_edit_personalinfo.html');

@Component({
  selector: 'profile-edit-personal-info',
  template: view,
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [
    GenderPipe
  ]
})
export class ProfileEditPersonalInfoComponent {
  @Input() user;
  @Input() aboutHasError;
  @Output() aboutChanged: EventEmitter<string> = new EventEmitter;

  emitAboutChanged(event) {
    this.aboutChanged.next(event.value);
  }
}
