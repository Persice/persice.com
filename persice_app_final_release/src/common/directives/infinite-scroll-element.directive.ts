import { Directive, ElementRef, HostListener, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[prs-infinite-scroll-element]'
})
export class InfiniteScrollElementDirective {
  public _element;

  @Input() scrollEnabled: boolean;
  @Input() bottomOffset: number;
  @Output() scrolled: EventEmitter<any> = new EventEmitter();

  @HostListener('scroll') onScrolledBottom() {
    if (this.scrollEnabled) {
      this._trigger();
    }
  }

  constructor(private _el: ElementRef) {
    this._element = _el.nativeElement;
  }

  private _trigger() {
    let scrollOffset = this._element.scrollTop + this._element.offsetHeight;
    let threshold = this._element.scrollHeight - this.bottomOffset;
    if (scrollOffset >= threshold) {
      this.scrolled.emit(true);
    }
  }
}
