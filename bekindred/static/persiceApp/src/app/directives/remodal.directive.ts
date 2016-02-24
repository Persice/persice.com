import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[remodal]',
  properties: ['options: remodal']
})
export class RemodalDirective {
  el: ElementRef;
  options;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    let options = {
      hashTracking: false,
      closeOnOutsideClick: false
    };

    if (this.options) {
      options = JSON.parse(this.options);
    }
    jQuery(this.el.nativeElement).remodal(options);

  }

  ngOnDestroy() {
    jQuery(this.el.nativeElement).remodal().destroy();
  }
}
