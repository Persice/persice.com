import {Directive, ElementRef} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[croppie]',
  properties: ['options: croppie', 'image']
})
export class CropDirective {
  options;
  image;
  croppieInstance;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    let opts = JSON.parse(this.options);
    setTimeout(() => {
      this.croppieInstance = jQuery(this.el.nativeElement).croppie(opts);
      this.croppieInstance.croppie('bind', {
        url: this.image
      });
    });

  }

  ngOnDestroy() {

  }
}
