import {Component, ElementRef, EventEmitter, OnInit, OnChanges, OnDestroy} from 'angular2/core';

declare var jQuery: any;

@Component({
  selector: 'prs-range-slider',
  template: `
    <input type="text" value="" name="range" class="{{class}}">
  `,
  inputs: ['options', 'renderSlider', 'class'],
  outputs: ['onChange', 'onFinish']
})
export class RangeSliderComponent implements OnInit, OnChanges, OnDestroy {
  el: ElementRef;
  onChange: EventEmitter<any> = new EventEmitter();
  onFinish: EventEmitter<any> = new EventEmitter();
  options: Object;
  slider;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngOnInit() {
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

  ngOnChanges(changes) {

    if (this.slider && changes.renderSlider) {
      this.slider.update(this.options);
    }
  }

  ngOnDestroy() {
    if (this.slider) {
      this.slider.destroy();
    }
  }
}
