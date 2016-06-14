import {Directive, ElementRef, ContentChild, Renderer, Output, EventEmitter, OnDestroy}
from '@angular/core';
import {DropdownMenuDirective} from './dropdown-menu.directive';

@Directive({
  selector: '[prs-dropdown]'
})
export class DropdownDirective implements OnDestroy {
  opened: boolean = false;
  globalListenFunc: Function;

  @ContentChild(DropdownMenuDirective) dropdownMenu: DropdownMenuDirective;

  @Output() onOpen: EventEmitter<any> = new EventEmitter();

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  ngOnDestroy() {
    // Removes "listenGlobal" listener
    this.removeGlobalClickListener();
  }

  public toggle(event: MouseEvent) {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  private open() {
    this.opened = true;
    this.dropdownMenu.open();
    this.onOpen.emit(undefined);
    this.listenGlobalClick();
  }

  private close() {
    this.opened = false;
    this.dropdownMenu.close();
    this.onClose.emit(undefined);
    this.removeGlobalClickListener();
  }

  /**
   * Listen to global "click" event on Document
   */
  private listenGlobalClick(): void {
    this.globalListenFunc = this.renderer.listenGlobal('document', 'click', (event) => {

      const targetElement: HTMLElement = event.target;

      // Check if clicking inside dropdown.
      // When clicked outside of dropdown, close it.
      if (targetElement && targetElement !== this.elementRef.nativeElement) {
        const clickedInside: boolean = this.elementRef.nativeElement.contains(targetElement);
        if (!!!clickedInside) {
          this.close();
        }
      }
      // PreventDefault is applied on the DOM event.
      return false;
    });
  }

  private removeGlobalClickListener() {
    this.globalListenFunc();
  }

}
