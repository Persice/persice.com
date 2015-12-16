import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[dropdown]',
  properties: ['target: dropdown'],
  host: {
    '(click)': 'onClick($event)'
  }
})
export class DropdownDirective {
  el: ElementRef;
  target: string;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onClick(event: Event) {
    jQuery(this.target).toggleClass('is-active');
  }

  ngOnDestroy() {
    jQuery(this.target).removeClass('is-active');
  }



}
