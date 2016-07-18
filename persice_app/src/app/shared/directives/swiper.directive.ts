import { Directive, ElementRef, NgZone, AfterViewInit, OnDestroy } from '@angular/core';


declare var Swiper: any;

@Directive({
  selector: '[swiper]',
  properties: ['options: swiper', 'id']
})
export class SwiperDirective implements AfterViewInit, OnDestroy {
  el: ElementRef;
  _ngZone: NgZone;
  options;
  id;
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
