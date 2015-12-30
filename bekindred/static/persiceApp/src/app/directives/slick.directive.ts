import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[slick]',
  properties: [
    'show',
    'scroll',
    'infinite',
    'append',
    'arrows',
    'dots',
    'responsive',
    'breakpoint',
    'slidestoshow'
  ]
})
export class SlickDirective {
  el: ElementRef;
  show: string;
  scroll: string;
  infinite: string;
  append: string;
  arrows: string;
  dots: string;
  breakpoint: string;
  slidestoshow: string;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngAfterViewInit() {

    let options = {
      arrows: (this.arrows === 'true') ? true : false,
      dots: (this.dots === 'true') ? true : false,
      infinite: (this.infinite === 'true') ? true : false,
      slidesToShow: parseInt(this.show, 10),
      slidesToScroll: parseInt(this.scroll, 10),
      appendDots: jQuery(this.append),
      slide: 'div',
      responsive: [{
        breakpoint: parseInt(this.breakpoint, 10),
        settings: {
          slidesToShow: parseInt(this.slidestoshow, 10)
        }
      }]
    };

    if (!this.dots) {
      delete options.appendDots;
    }

    if (!this.breakpoint) {
      delete options.responsive;
    }

    jQuery(this.el.nativeElement).slick(options);

  }

  ngOnDestroy() {
    jQuery(this.el.nativeElement).slick('unslick');
  }
}
