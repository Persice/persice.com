/// <reference path='../../../typings/_custom.d.ts' />

import {Component, ElementRef, Attribute, NgFor, Inject} from 'angular2/angular2';

declare var jQuery: any;

let view = require('./select.html');

@Component({
  selector: 'select-element',
  template: view,
  inputs: ['options'],
  directives: [NgFor]
})
export class SelectComponent {
  el: ElementRef;
  options: any;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onInit() {
    console.log('selectcomp');
    let selectEl = this.el.nativeElement.children[0];
    jQuery(selectEl).minimalect({
        searchable: false
    });

  }

}
