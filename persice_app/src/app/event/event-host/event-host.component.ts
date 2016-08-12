import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CheckImageDirective } from '../../shared/directives';

@Component({
  selector: 'prs-event-host',
  template: `
    <h3 class="module-title">Event host</h3>
    <div class="flag flag--small mb" id="eventHost" (click)="openProfile(host?.username)">
      <div class="flag__img">
        <div class="avatar-holder" checkimage="{{host?.image}}" [suffix]="'.56x56_q100_crop.jpg'" [onchanges]="1">
        </div>
      </div>
      <div class="flag__body">
        <h5 class="host-name">{{host?.name}}</h5>
        <p class="single-title-subinfo single-title-subinfo--small">{{host?.gender}} / Age {{host?.age}} {{host?.distance}}</p>
      </div>
    </div>
    <p class="module-type">{{host?.description}}</p>
  `,
  directives: [CheckImageDirective]
})
export class EventHostComponent {
  @Input() host;

  constructor(private _router: Router) { }

  openProfile(username) {
    this._router.navigateByUrl('/' + username);
  }

}
