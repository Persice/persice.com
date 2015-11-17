/// <reference path='../../../typings/_custom.d.ts' />

import {Component, ElementRef, EventEmitter, NgFor, Inject} from 'angular2/angular2';

declare var jQuery: any;

let view = require('./select.html');

@Component({
  selector: 'select-element',
  template: view,
  inputs: ['options'],
  outputs: ['selectedValue'],
  directives: [NgFor]
})
export class SelectComponent {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();
  options: any;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onInit() {
    let changeCounter = 0;
    let selectEl = this.el.nativeElement.children[0];
    jQuery(selectEl).minimalect({
      searchable: false,
      onchange: (value) => {
        changeCounter++;
        if (changeCounter > 2) {
          this.selectedValue.next(value);
        }
      }
    });

  }

}
