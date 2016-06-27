import {Directive, HostListener, OnInit} from '@angular/core';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';
import {Router, NavigationStart, Event} from '@angular/router';

@Directive({
  selector: '[prs-close-left-menu]',
  providers: [BrowserDomAdapter]
})
export class CloseLeftMenuDirective implements OnInit {
  @HostListener('swipeleft') onSwipeLeft() {
    this._closeMenu();
  }

  @HostListener('tap') onTap() {
    this._closeMenu();
  }

  constructor(
    private _dom: BrowserDomAdapter,
    private _router: Router
  ) { }

  ngOnInit() {
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this._closeMenu();
      }
    });
  }

  private _closeMenu() {
    this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toright');
    this._dom.removeClass(this._dom.query('.content-mask'), 'is-active');
    this._dom.removeClass(this._dom.query('body'), 'disabled-scrolling');
    this._dom.removeClass(this._dom.query('#push-menu-s1'), 'is-open');
  }

}
