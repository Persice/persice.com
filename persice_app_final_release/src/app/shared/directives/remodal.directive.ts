import { Directive, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';

@Directive({
  selector: '[remodal]'
})
export class RemodalDirective implements OnDestroy, AfterViewInit {
  @Input('remodal') options;

  constructor(public el: ElementRef) { }

  ngAfterViewInit() {
    this.initializeModal();
  }

  initializeModal() {
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
