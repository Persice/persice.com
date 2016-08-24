import { Directive, ElementRef, ContentChild, Renderer, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { DropdownMenuDirective } from './dropdown-menu.directive';

@Directive({
  selector: '[prs-dropdown]',
  properties: ['preventDefault']
})
export class DropdownDirective implements OnDestroy {
  opened: boolean = false;
  globalListenFunc: Function;

  @ContentChild(DropdownMenuDirective) dropdownMenu: DropdownMenuDirective;

  @Output() onOpen: EventEmitter<any> = new EventEmitter();

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @Input() preventDefault: boolean;

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

  public open() {
    this.opened = true;
    this.dropdownMenu.open();
    this.onOpen.emit(undefined);
    this.listenGlobalClick();
    document.querySelector('.content--main').classList.add('overlay');
  }

  public close() {
    this.opened = false;
    this.dropdownMenu.close();
    this.onClose.emit(undefined);
    this.removeGlobalClickListener();
    document.querySelector('.content--main').classList.remove('overlay');
  }

  /**
   * Listen to global "click" event on Document
   */
  private listenGlobalClick(): void {

    this.globalListenFunc = this.renderer.listenGlobal('document', 'touchend', (event) => {
      const targetElement: HTMLElement = event.target;
      // Check if clicking inside dropdown.
      // When clicked outside of dropdown, close it.
      if (targetElement && targetElement !== this.elementRef.nativeElement) {
        const clickedInside: boolean = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          this.close();
        }
      }
      // PreventDefault is applied on the DOM event.
      if (!!this.preventDefault) {
        event.preventDefault();
      }

    });
  }

  private removeGlobalClickListener() {
    if (!!this.globalListenFunc) {
      this.globalListenFunc();
    }
  }

}
