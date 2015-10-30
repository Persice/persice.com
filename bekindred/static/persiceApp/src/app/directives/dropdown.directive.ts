/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Attribute, Inject} from 'angular2/angular2';

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



}
