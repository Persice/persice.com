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

  ngAfterViewInit() {
    let opts = JSON.parse(this.options);
    setTimeout(() => {

      opts.update = (cropper) => {
        this.cropImage();
      };

      this.croppieInstance = jQuery(this.el.nativeElement).croppie(opts);
      this.croppieInstance.croppie('bind', {
        url: this.image
      });
    });

  }

  ngOnDestroy() {
  }

  cropImage() {
    this.croppieInstance.croppie('result', 'canvas').then((img) => {
      //img is html positioning & sizing the image correctly if resultType is 'html'
      //img is base64 url of cropped image if resultType is 'canvas'
      console.log('crop updated');
      this.croppedImage = img;
      this.cropResult.emit(img);
    });
  }
}
