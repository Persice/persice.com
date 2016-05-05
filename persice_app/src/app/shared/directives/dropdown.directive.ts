import {Directive, ElementRef, HostListener, OnDestroy} from '@angular/core';



@Directive({
  selector: '[dropdown]',
  properties: ['target: dropdown']
})
export class DropdownDirective implements OnDestroy {
  target: string;

  @HostListener('click') onClick(event: Event) {
    jQuery(this.target).toggleClass('is-active');
  };

  constructor(public el: ElementRef) { }

  ngOnDestroy() {
    jQuery(this.target).removeClass('is-active');
  }



}
