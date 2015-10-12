/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Attribute, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[toggle-filter]',
  properties: ['class: toggle-filter'],
  host: {
    '(click)': 'onClick($event)'
  }
})
export class ToggleFilterDirective {
  el: ElementRef;
  class: string;

  constructor(@Inject(ElementRef)  el: ElementRef) {
    this.el = el;
  }

  onInit() {

  }

  onClick(event: Event) {
    jQuery('body').toggleClass(this.class);
  }



}
