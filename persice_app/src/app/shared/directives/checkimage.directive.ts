import {Directive, ElementRef, Input, AfterViewInit, Renderer, OnDestroy} from '@angular/core';
import {Http} from '@angular/http';

@Directive({
  selector: '[checkimage]',
  properties: ['image: checkimage', 'suffix', 'onchanges']
})
export class CheckImageDirective implements AfterViewInit, OnDestroy {
  @Input() set checkimage(value: string) {
    if (this.onchanges) {
      this.image = value;
      this._displayImage();
    }
  };

  image: string;
  suffix: string;
  onchanges: boolean;
  serviceInstance: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private http: Http
  ) {

  }

  ngAfterViewInit() {
    this._displayImage();
  }

  ngOnDestroy() {
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
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
    } else {// try to load smaller image with suffix
      this._loadImage(imageUrl);
    }

  }

  /**
   * [_loadImage Try to load smaller image and fall back to original size]
   * @param {[string]} url [image url]
   */
  private _loadImage(url): void {
    if (url) {
      this.serviceInstance = this.http.head(url).map((res) => res.json())
        .subscribe((data) => {
          this.setBackgroundImage(`url(${url})`);
        }, (err) => {
          this.setBackgroundImage(`url(${this.image})`);
          return true;
        }, () => {
          return true;
        });
    }
  }


}
