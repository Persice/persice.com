/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[minimalect]',
  outputs: ['selectedValue']
})
export class SelectDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {
    let changeCounter = 0;

    console.log('creating select directive');

    jQuery(this.el.nativeElement).minimalect({
      searchable: false,
      onchange: (value) => {
        changeCounter++;
        if (changeCounter % 2 === 0) {
          this.selectedValue.next(value);
        }
      }
    });


  }

}
