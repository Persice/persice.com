import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Input } from '@angular/core/src/metadata/directives';

@Directive({
  selector: '[dropdown]'
})
export class DropdownDirective implements OnDestroy {
  @Input('dropdown') target: string;

  @HostListener('click') onClick() {
    jQuery(this.target).toggleClass('is-active');
  };

  constructor(public el: ElementRef) { }

  ngOnDestroy() {
    jQuery(this.target).removeClass('is-active');
  }

}
