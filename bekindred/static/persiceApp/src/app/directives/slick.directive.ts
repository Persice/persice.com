/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[slick]',
  properties: ['show', 'scroll', 'infinite', 'append', 'arrows', 'dots']
})
export class SlickDirective {
  el: ElementRef;
  show: string;
  scroll: string;
  infinite: string;
  append: string;
  arrows: string;
  dots: string;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  afterViewInit() {
    console.log('slick has changes');



    let options = {
      arrows: (this.arrows === 'true') ? true : false,
      dots: (this.dots === 'true') ? true : false,
      infinite: (this.infinite === 'true') ? true : false,
      slidesToShow: parseInt(this.show, 10),
      slidesToScroll: parseInt(this.scroll, 10),
      appendDots: jQuery(this.append),
      slide: 'div'
    };

    if (!this.dots) {
      delete options.appendDots;
    }

    jQuery(this.el.nativeElement).slick(options);



  }

  onDestroy() {
    console.log('slick element destroyed');
    jQuery(this.el.nativeElement).slick('unslick');
  }
}
