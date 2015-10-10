/// <reference path="../../typings/_custom.d.ts" />

import { Directive, ElementRef, Attribute, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[image-stretch]'
})
export class ImageStretchDirective {
  el: ElementRef;

  constructor(@Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  afterContentChecked() {
    jQuery(this.el.nativeElement).imgLiquid({
      fill: true,
      horizontalAlign: 'center',
      verticalAlign: 'center'
    });
  }



}
