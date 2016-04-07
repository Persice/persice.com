import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from 'angular2/core';

@Component({
  selector: 'prs-acceptpass',
  template: `
    <div class="pass-accept">
      <div class="layout layout--small">
        <div class="layout__item 1/2">
          <a (click)="passUser($event)" class="btn btn-1 btn-1--red btn--full btn--activate js-pass"
          [ngClass]="{'is-active': passIsActive}">
            <div class="btn--activate__label">Pass</div>
            <svg role="img" class="icon ">
              <use xlink:href="/static/assets/icons/icons.svg#icon-pass"></use>
            </svg>
          </a>
        </div>
        <div class="layout__item 1/2">
          <a (click)="acceptUser($event)" class="btn btn-1 btn-1--green btn--full btn--activate js-accept"
            [ngClass]="{'is-active': acceptIsActive}">
            <div class="btn--activate__label">Connect</div>
            <svg role="img" class="icon ">
              <use xlink:href="/static/assets/icons/icons.svg#icon-accepted"></use>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `
})
export class AcceptPassComponent implements OnChanges {
  @Input() user;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  passIsActive = false;
  acceptIsActive = false;
  timeoutPass;
  timeoutAccept;

  ngOnChanges(values) {
    this.passIsActive = false;
    this.acceptIsActive = false;
    this.timeoutPass = null;
    this.timeoutAccept = null;
  }

  passUser(event) {
    this.acceptIsActive = false;
    if (this.timeoutAccept) {
      window.clearTimeout(this.timeoutAccept);
    }

    if (this.passIsActive) {
      return;
    }
    this.passIsActive = true;
    if (this.timeoutPass) {
      window.clearTimeout(this.timeoutPass);
    }
    this.timeoutPass = setTimeout(() => {
      this.passEvent.next({ user: this.user, next: true });
    }, 1500);

  }

  acceptUser(event) {
    this.passIsActive = false;
    if (this.timeoutPass) {
      window.clearTimeout(this.timeoutPass);
    }
    if (this.acceptIsActive) {
      return;
    }
    this.acceptIsActive = true;
    if (this.timeoutAccept) {
      window.clearTimeout(this.timeoutAccept);
    }
    this.timeoutAccept = setTimeout(() => {
      this.acceptEvent.next({ user: this.user, next: true });
    }, 1500);
  }

}
