import {Directive, HostListener} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

@Directive({
  selector: '[prs-mobile-right-menu-push]',
  providers: [BrowserDomAdapter]
})
export class RightMenuPushDirective {


  @HostListener('click') onMouseClick() {
    if (this._dom.hasClass(this._dom.query('.container'), 'push-menu-push--toleft')) {
      this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toleft');
      this._dom.removeClass(this._dom.query('#push-menu-s2'), 'is-open');
    } else {
      this._dom.addClass(this._dom.query('.container'), 'push-menu-push--toleft');
      this._dom.addClass(this._dom.query('#push-menu-s2'), 'is-open');
    }
  }

  constructor(private _dom: BrowserDomAdapter) {

  }

  ngOnInit() {

  }
}
