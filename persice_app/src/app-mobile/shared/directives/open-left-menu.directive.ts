import {Directive, HostListener} from '@angular/core';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

@Directive({
  selector: '[prs-open-left-menu]',
  providers: [BrowserDomAdapter]
})
export class OpenLeftMenuDirective {
  @HostListener('tap') onTap() {
    this._triggerMenu();
  }

  constructor(private _dom: BrowserDomAdapter) { }

  private _triggerMenu() {
    if (this._dom.hasClass(this._dom.query('.container'), 'push-menu-push--toright')) {
      this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toright');
      this._dom.removeClass(this._dom.query('.content-mask'), 'is-active');
      this._dom.removeClass(this._dom.query('body'), 'disabled-scrolling');
      this._dom.removeClass(this._dom.query('.push-menu--left'), 'is-open');
    } else {
      this._dom.addClass(this._dom.query('.push-menu--left'), 'is-open');
      this._dom.addClass(this._dom.query('.container'), 'push-menu-push--toright');
      this._dom.addClass(this._dom.query('body'), 'disabled-scrolling');
      this._dom.addClass(this._dom.query('.content-mask'), 'is-active');
    }
  }
}
