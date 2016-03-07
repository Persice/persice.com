import {Directive, ElementRef, Inject, NgZone} from 'angular2/core';

declare var jQuery: any;
declare var Swiper: any;

@Directive({
  selector: '[swiper]',
  properties: ['options: swiper', 'id']
})
export class SwiperDirective {
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
