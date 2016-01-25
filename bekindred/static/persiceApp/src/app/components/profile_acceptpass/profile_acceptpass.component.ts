import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'profile-acceptpass',
  template: `
    <div class="pass-accept">
      <div class="layout layout--small">
        <div class="layout__item 1/2">
          <a (click)="passUser($event)" class="btn btn-1 btn-1--red btn--full btn--activate js-pass">
            <div class="btn--activate__label">Pass</div>
            <svg role="img" class="icon ">
              <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-pass"></use>
            </svg>
          </a>
        </div>
        <div class="layout__item 1/2">
          <a (click)="acceptUser($event)" class="btn btn-1 btn-1--green btn--full btn--activate js-accept">
            <div class="btn--activate__label">Accept</div>
            <svg role="img" class="icon ">
              <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-accepted"></use>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `
})
export class ProfileAcceptPassComponent {
  @Input() user;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;


  passUser(event) {
    this.passEvent.next({ user: this.user, next: true });
  }

  acceptUser(event) {
    this.acceptEvent.next({ user: this.user, next: true });
  }

}
