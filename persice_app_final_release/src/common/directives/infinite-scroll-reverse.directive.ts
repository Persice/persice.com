import { Directive, HostListener, EventEmitter, Output, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[prs-infinite-scroll-reverse]'
})
export class InfiniteScrollReverseDirective {
  @Input() scrollEnabled: boolean;
  @Input() topOffset: number;

  @Input('loadedCount') set loadedCount(state: number) {
    if (state > 0 && !!this._previousScrollHeight) {
      // Scroll back to bottom according to scrollHeight change after new items loaded
      setTimeout(() => {
        this._element.scrollTop = this._element.scrollHeight - this._previousScrollHeight;
      });
    }
  };

  @Input('totalCount') set totalCount(state: number) {
    if (state > 0) {
      // Scroll completely to bottom after new items are loaded
      setTimeout(() => {
        this._element.scrollTop = this._element.scrollHeight;
      }, 0);
    }
  };

  @Output() scrolled: EventEmitter<any> = new EventEmitter();

  private _element;
  private _previousScrollHeight: number = 0;

  @HostListener('scroll') onScrolledTop() {
    if (this.scrollEnabled) {
      this._checkIfNearTop();
    }
  };

  constructor(private _el: ElementRef) {
    this._element = _el.nativeElement;
  }

  private _checkIfNearTop() {
    let scrollOffset = this._element.scrollTop;

    let threshold = this.topOffset;
    if (scrollOffset <= threshold) {
      this._previousScrollHeight = this._element.scrollHeight;
      setTimeout(() => {
        this.scrolled.emit(true);
      }, 500);
    }
  }

}
