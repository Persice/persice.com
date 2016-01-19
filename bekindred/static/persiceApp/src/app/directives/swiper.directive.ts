import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;
declare var Swiper: any;

@Directive({
  selector: '[swiper]',
  properties: ['options: swiper']
})
export class SwiperDirective {
  el: ElementRef;
  options;
  swiperInstance;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
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
