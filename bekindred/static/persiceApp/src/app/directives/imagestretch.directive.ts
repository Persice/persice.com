import { Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[image-stretch]'
})
export class ImageStretchDirective {
  private element: ElementRef;

  constructor( @Inject(ElementRef) element: ElementRef) {
    this.element = element;
  }

  ngAfterViewInit() {
    jQuery(this.element.nativeElement).imgLiquid({
      fill: true,
      horizontalAlign: 'center',
      verticalAlign: 'center'
    });
  }



}
