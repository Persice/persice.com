/// <reference path="../../typings/_custom.d.ts" />

import { Directive, ElementRef, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[image-stretch]'
})
export class ImageStretchDirective {
  private element: ElementRef;

  constructor( @Inject(ElementRef) element: ElementRef) {
    this.element = element;
  }

  afterViewInit() {
    jQuery(this.element.nativeElement).imgLiquid({
      fill: true,
      horizontalAlign: 'center',
      verticalAlign: 'center'
    });
  }



}
