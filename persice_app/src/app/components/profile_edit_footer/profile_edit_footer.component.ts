import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'profile-footer',
  template: require('./profile_edit_footer.html')
})
export class ProfileEditFooterComponent {
  @Input() loadingEdit;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() {

  }
}
