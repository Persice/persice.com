import {Directive, HostListener, EventEmitter, Output, Input} from '@angular/core';

@Directive({
  selector: '[prs-infinite-scroll]'
})
export class InfiniteScrollDirective {
  @Input() scrollEnabled: boolean;
  @Input() bottomOffset: number;
  @Output() scrolled: EventEmitter<any> = new EventEmitter();

  @HostListener('window:scroll') onScrolledBottom() {
    this._triggerMenu();
  }

  private _triggerMenu() {
    let scrollOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
    let threshold = jQuery(document).height() - jQuery(window).height() - this.bottomOffset;
    if (scrollOffset > threshold && this.scrollEnabled) {
      this.scrolled.next(true);
    }
  }
}
