import {Directive, ElementRef, Output, EventEmitter} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[croppie]',
  properties: ['options: croppie', 'image', 'crop']
})
export class CropDirective {
  @Output() cropResult: EventEmitter<any> = new EventEmitter();
  options;
  image;
  croppieInstance;
  croppedImage;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(values) {
    if (this.croppieInstance && values.image && values.image.currentValue) {

      setTimeout(() => {
        this.croppieInstance.croppie('setZoom', 1.5);
        this.croppieInstance.croppie('bind', {
          url: values.image.currentValue
        });

      });

    }
  }

  ngAfterViewInit() {
    let opts = JSON.parse(this.options);
    setTimeout(() => {

      opts.update = (cropper) => {
        this.cropImage();
      };

      this.croppieInstance = jQuery(this.el.nativeElement).croppie(opts);
      if (this.image !== '') {
        this.croppieInstance.croppie('bind', {
          url: this.image
        });
        this.croppieInstance.croppie('setZoom', 1.5);
      }

    });

  }

  ngOnDestroy() {
    if (this.croppieInstance) {
      this.croppieInstance.croppie('destroy');
    }
  }

  cropImage() {
    this.croppieInstance.croppie('result', 'canvas', 'viewport').then((img) => {
      this.croppedImage = img;
      this.cropResult.next(img);
    });
  }
}
