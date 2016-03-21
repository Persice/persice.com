import {Directive, ElementRef, OnChanges, AfterViewInit, Renderer} from 'angular2/core';

@Directive({
  selector: '[checkimage]',
  properties: ['image: checkimage', 'suffix', 'onchanges']
})
export class CheckImageDirective {
  image: string;
  suffix: string;
  onchanges: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer) {

  }

  ngAfterViewInit() {
    this._displayImage();
  }

  ngOnChanges(values) {
    if (this.onchanges) {
      this._displayImage();
    }
  }

  public setBackgroundImage(url) {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundImage', url);
  }

  private _displayImage(): void {
    let imageUrl = this.image + this.suffix;

    // if image is empty or default avatar
    if (this.image === '/static/assets/images/empty_avatar.png'
      || this.image === '' || this.image === null) {
      this.setBackgroundImage(`url(/static/assets/images/empty_avatar.png)`);
    }
    else {// try to load smaller image with suffix
      this._loadImage(imageUrl);
    }

  }

  /**
   * [_loadImage Try to load smaller image and fall back to original size]
   * @param {[string]} url [image url]
   */
  private _loadImage(url): void {
    let test = new Image();
    test.onload = () => {
      // console.log('smaller image is loaded', url);
      this.setBackgroundImage(`url(${url})`);
    };

    test.onerror = () => {
      // console.log('smaller image load error, loading original image', this.image);
      this.setBackgroundImage(`url(${this.image})`);
    };

    test.src = url;

  }

}
