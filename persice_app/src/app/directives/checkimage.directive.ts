import {Directive, ElementRef, OnDestroy, OnChanges, AfterViewInit, Renderer} from 'angular2/core';
import {Http, } from 'angular2/http';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[checkimage]',
  properties: ['image: checkimage', 'fallback', 'suffix', 'onchanges']
})
export class CheckImageDirective implements OnDestroy, OnChanges, AfterViewInit {
  image: string;
  fallback: string;
  suffix: string;
  onchanges: boolean;
  subscriberInstance: Subscription;

  constructor(
    private el: ElementRef,
    private http: Http,
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

  private _displayImage(): void {
    let imageUrl = this.image + this.suffix;

    // if image is empty or default avatar
    if (this.image === '/static/assets/images/empty_avatar.png'
      || this.image === '' || this.image === null) {
      this._setBackgroundImage(`url(/static/assets/images/empty_avatar.png)`);
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
    this.subscriberInstance = this.http.get(url).map(res => res)
      .subscribe(data => {
        this.subscriberInstance.unsubscribe();
        // console.log('smaller image is loaded', url);
        this._setBackgroundImage(`url(${url})`);
      }, (err) => {
        this.subscriberInstance.unsubscribe();
        // console.log('smaller image load error, loading original image', this.image);
        this._setBackgroundImage(`url(${this.image})`);
      });
  }

  /**
   * [_setBackgroundImage sets HTML element style image background using Angular2 Renderer]
   * @param {[string]} url [image ulr]
   */
  private _setBackgroundImage(url): void {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundImage', url);
  }

  ngOnDestroy() {
    if (this.subscriberInstance) {
      this.subscriberInstance.unsubscribe();
    }
  }

}
