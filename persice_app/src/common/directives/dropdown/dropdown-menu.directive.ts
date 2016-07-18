import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[prs-dropdown-menu]'
})
export class DropdownMenuDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  open() {
    const element: HTMLElement = this.elementRef.nativeElement;
    this.renderer.setElementClass(element, 'hidden', false);
  }

  close() {
    const element: HTMLElement = this.elementRef.nativeElement;
    this.renderer.setElementClass(element, 'hidden', true);
  }
}
