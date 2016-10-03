import { Directive, Input, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: 'img[default]',
})
export class DefaultImageDirective {

  @Input('default') default: string;

  @HostBinding('src') src: string;

  @HostListener('error') onError() {
    this.loadDefaultImage();
  }

  private loadDefaultImage() {
    this.src = this.default;
  }
}
