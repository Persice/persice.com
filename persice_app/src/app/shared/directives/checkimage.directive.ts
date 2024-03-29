import { Directive, ElementRef, Input, AfterViewInit, Renderer } from '@angular/core';

@Directive({
  selector: '[checkimage]',
  properties: ['image: checkimage', 'suffix', 'onchanges', 'default']
})
export class CheckImageDirective implements AfterViewInit {
  @Input() set checkimage(value: string) {
    if (this.onchanges) {
      this.image = value;
      this._displayImage();
    }
  };

  @Input() set default(value: string) {
    this.defaultImage = value;
  };

  defaultImage: string = '/assets/images/empty_avatar.png';
  image: string;
  suffix: string;
  onchanges: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngAfterViewInit() {
    this._displayImage();
  }

  private _displayImage(): void {
    let imageUrl = this.image + this.suffix;

    // If image is empty or default avatar
    if (this.image === this.defaultImage
      || this.image === '' || this.image === null) {
      this._setBackgroundImage(`url(${this.defaultImage})`);
    } else {
      // Try to load image with suffix
      if (this._isCached(imageUrl)) {
        this._setBackgroundImage(`url(${imageUrl})`);
      } else {
        this._loadImage(imageUrl);
      }
    }
  }

  // Sets background-image on an element
  private _setBackgroundImage(url: string): void {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundImage', url);
  }

  /**
   * [_loadImage Try to load smaller image and fall back to original size]
   * @param {[string]} url [image url]
   */
  private _loadImage(url): void {
    if (url) {
      let image = new Image();
      image.onload = (status) => {
        this._setBackgroundImage(`url(${url})`);
      };
      image.onerror = (status) => {
        this._setBackgroundImage(`url(${this.image})`);
      };
      image.src = url;
    }
  }

  private _isCached(src: string): boolean {
    let image = new Image();
    image.src = src;
    return image.complete;
  }

}
