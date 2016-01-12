import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';

let view = require('./profile_edit.html');

@Component({
  selector: 'profile-edit',
  template: view,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditComponent {
  @Input() user: {first_name: string};
}
