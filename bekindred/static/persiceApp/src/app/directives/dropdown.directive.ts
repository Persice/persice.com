/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Attribute} from 'angular2/angular2';

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

  constructor(el: ElementRef) {
    this.el = el;
  }

  onInit() {

  }

  onClick(event: Event) {
    jQuery(this.target).slideToggle();
  }



}
