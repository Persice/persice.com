/// <reference path='../../../typings/_custom.d.ts' />

import {Component, ElementRef, EventEmitter, Inject} from 'angular2/angular2';

declare var jQuery: any;

let view = require('./rangeslider.html');

@Component({
  selector: 'range-slider',
  template: view,
  inputs: ['options', 'renderSlider'],
  outputs: ['onChange', 'onFinish']
})
export class RangeSliderComponent {
  el: ElementRef;
  onChange: EventEmitter = new EventEmitter();
  onFinish: EventEmitter = new EventEmitter();
  options: Object;
  slider;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onInit() {
    let rangesliderEl = this.el.nativeElement.children[0];

    this.options['onFinish'] = (data) => {
      this.onFinish.next({
        from: data.from,
        to: data.to
      });
    };
    this.options['onChange'] = (data) => {
      this.onChange.next({
        from: data.from,
        to: data.to
      });
    };

    jQuery(rangesliderEl).ionRangeSlider(this.options);
    this.slider = jQuery(rangesliderEl).data('ionRangeSlider');
  }

  onChanges(changes) {

    if (this.slider && changes.renderSlider) {
      this.slider.update(this.options);
    }
  }
}
