/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[slick]'
})
export class SlickDirective {
  el: ElementRef;
  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  afterViewInit() {
    console.log('slick has changes');

    jQuery(this.el.nativeElement).slick({
      arrows: false,
      dots: true,
      appendDots: jQuery('.match-profile__avatar-nav')
    });

    jQuery(this.el.nativeElement).slick('slickRemove', 0);

  }

  onDestroy() {
    console.log('slick element destroyed');
    jQuery(this.el.nativeElement).slick('unslick');
  }
}
