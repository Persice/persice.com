import { Directive, ElementRef, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';

declare var Swiper: any;

@Directive({
  selector: '[swiper]',
})
export class SwiperDirective implements AfterViewInit, OnDestroy {
  el: ElementRef;
  _ngZone: NgZone;
  @Input('swiper') options;
  @Input() id;
  swiperInstance;

  constructor(el: ElementRef, _ngZone: NgZone) {
    this.el = el;
    this._ngZone = _ngZone;
  }

  ngAfterViewInit() {
    let opts = JSON.parse(this.options);

    setTimeout(() => {
      this.swiperInstance = new Swiper(jQuery(this.el.nativeElement), opts);
    });
  }

  ngOnDestroy() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }
}
