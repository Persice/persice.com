import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';

let view = require('./eventhost.html');

@Component({
  selector: 'event-host',
  template: view
})
export class EventHostComponent {
  @Input() host;

  constructor(private _router: Router) {

  }

	openProfile(username) {
		this._router.parent.navigate(['./ProfileView', { username: username }]);
  }

}
