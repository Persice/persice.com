import {Directive, ElementRef, HostListener} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[dropdown]',
  properties: ['target: dropdown']
})
export class DropdownDirective {

  el: ElementRef;
  target: string;

  @HostListener('click') onClick (event: Event) {
    jQuery(this.target).toggleClass('is-active');
  };

  constructor(el: ElementRef) {
    this.el = el;
  }


  ngOnDestroy() {
    jQuery(this.target).removeClass('is-active');
  }



}
