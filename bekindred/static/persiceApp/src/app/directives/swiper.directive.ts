import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;
declare var Swiper: any;

@Directive({
  selector: '[swiper]'
})
export class SwiperDirective {
  el: ElementRef;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {


    setTimeout(() => {
      let mySwiper = new Swiper(jQuery(this.el.nativeElement), {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        spaceBetween: 10,
        slidesPerView: 3,
        // Navigation arrows
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'

      });
    }, 500);



  }

  ngOnDestroy() {

  }
}
