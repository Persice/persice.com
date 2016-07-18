import { Directive, Input, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: 'img[default]',
  properties: ['default', 'src']
})
export class DefaultImageDirective {

  @Input() default: string;

  @HostBinding('src') src: string;

  @HostListener('error') onError() {
    this.loadDefaultImage();
  }

  private loadDefaultImage() {
    this.src = this.default;
  }
}
