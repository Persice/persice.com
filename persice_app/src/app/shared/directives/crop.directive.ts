import {Directive, ElementRef, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy}
from '@angular/core';



@Directive({
  selector: '[croppie]',
  properties: ['options: croppie', 'image', 'crop']
})
export class CropDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Output() cropResult: EventEmitter<any> = new EventEmitter();
  options;
  image;
  croppieInstance;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(values) {
    if (this.croppieInstance && values.image && values.image.currentValue) {
      this.croppieInstance.croppie('bind', {
        url: values.image.currentValue
      });
    }
  }

  ngAfterViewInit() {
    let opts = JSON.parse(this.options);
    opts.update = (cropper) => {
      this.cropImage();
    };
    this.croppieInstance = jQuery(this.el.nativeElement).croppie(opts);
    if (this.image !== '') {
      this.croppieInstance.croppie('bind', {
        url: this.image
      });
    }
  }

  ngOnDestroy() {
    if (this.croppieInstance) {
      this.croppieInstance.croppie('destroy');
    }
  }

  cropImage() {
    this.croppieInstance.croppie('result', 'html').then((img) => {

      // prepare box subrectangle from cropped image
      let leftOffset = Math.abs(parseInt(img.getElementsByTagName('img')[0].style.left, 10));
      let topOffset = Math.abs(parseInt(img.getElementsByTagName('img')[0].style.top, 10));
      let width = parseInt(img.style.width, 10);
      let height = parseInt(img.style.height, 10);

      let bounds = {
        left: leftOffset,
        upper: topOffset,
        right: leftOffset + width,
        lower: topOffset + height
      };

      this.cropResult.next(bounds);
    });
  }
}
