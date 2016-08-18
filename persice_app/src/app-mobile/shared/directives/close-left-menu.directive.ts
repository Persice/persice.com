import { Directive, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { Router, NavigationStart, Event } from '@angular/router';

@Directive({
  selector: '[prs-close-left-menu]',
  providers: [BrowserDomAdapter]
})
export class CloseLeftMenuDirective implements OnInit, OnDestroy {
  @HostListener('swipeleft') onSwipeLeft() {
    this._closeMenu();
  }

  @HostListener('tap') onTap() {
    this._closeMenu();
  }

  private routerSub;

  constructor(
    private _dom: BrowserDomAdapter,
    private _router: Router
  ) { }

  ngOnInit() {
    this.routerSub = this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this._closeMenu();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private _closeMenu() {
    this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toright');
    this._dom.removeClass(this._dom.query('.content-mask'), 'is-active');
    this._dom.removeClass(this._dom.query('body'), 'disabled-scrolling');
    this._dom.removeClass(this._dom.query('#push-menu-s1'), 'is-open');
  }

}
