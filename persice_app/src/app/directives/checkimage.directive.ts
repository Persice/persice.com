import {Directive, ElementRef} from 'angular2/core';
import {Http} from 'angular2/http';

@Directive({
  selector: '[checkimage]',
  properties: ['image: checkimage', 'suffix']
})
export class CheckImageDirective {
  image;
  suffix;
  constructor(private el: ElementRef, private http: Http) {

  }

  ngOnChanges(values) {
    this._loadImage();
  }

  private _loadImage() {
    let imageUrl = this.image + this.suffix;

    // if image is empty or default avatar
    if (this.image === '/static/assets/images/empty_avatar.png' || this.image === '' || this.image === null) {
      // console.log('image is empty or default, loading default image');
      this.el.nativeElement.style.backgroundImage = `url(/static/assets/images/empty_avatar.png)`;
    }
    else {// try to load smaller image with suffix
      this._testImage(imageUrl);
    }


  }

  private _testImage(url) {
    let test = new Image();

    test.onload = () => {
      // console.log('smaller image is loaded', url);
      this.el.nativeElement.style.backgroundImage = `url(${url})`;
    };

    test.onerror = () => {
      // console.log('smaller image load error, loading original image', this.image);
      this.el.nativeElement.style.backgroundImage = `url(${this.image})`;
    };

    test.src = url;

  }

}
