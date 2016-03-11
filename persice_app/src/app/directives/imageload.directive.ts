import {Directive, ElementRef} from 'angular2/core';

@Directive({
  selector: '[imageload]',
  host: {
    '(error)': 'onImageLoadError()',
  },
  properties: ['image: imageload', 'suffix']


})
export class ImageLoadDirective {
  image;
  suffix;
  constructor(private el: ElementRef) {

  }

  ngOnChanges(values) {
    if (values.image.currentValue && values.image.previousValue === '/static/assets/images/empty_avatar.png') {
      this.el.nativeElement.src = values.image.currentValue + this.suffix;
    }
  }

  ngAfterViewInit() {
    if (this.image === '/static/assets/images/empty_avatar.png' || this.image === '' || this.image === null) {
      this.el.nativeElement.src = '/static/assets/images/empty_avatar.png';
    }
    else {
      this.el.nativeElement.src = this.image + this.suffix;
    }
  }

  private onImageLoadError() {
    if (this.image === '' || this.image === null) {
      this.el.nativeElement.src = '/static/assets/images/empty_avatar.png';
    }
    else {
      this.el.nativeElement.src = this.image;
    }

  }
}
