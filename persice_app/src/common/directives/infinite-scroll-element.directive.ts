import {Directive, ElementRef, HostListener, EventEmitter, Output, Input} from '@angular/core';

@Directive({
  selector: '[prs-infinite-scroll-element]'
})
export class InfiniteScrollElementDirective {
  @Input() scrollEnabled: boolean;
  @Input() bottomOffset: number;
  @Output() scrolled: EventEmitter<any> = new EventEmitter();

  @HostListener('scroll') onScrolledBottom() {
    this._triggerMenu();
  }

  constructor(private _el: ElementRef) { }

  private _triggerMenu() {
    let scrollOffset = jQuery(this._el.nativeElement).scrollTop() + jQuery(this._el.nativeElement).innerHeight();
    let threshold = jQuery(this._el.nativeElement)[0].scrollHeight - this.bottomOffset;
    if (scrollOffset >= threshold && this.scrollEnabled) {
      this.scrolled.next(true);
    }
  }
}
