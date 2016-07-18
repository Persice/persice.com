import { Directive, Host, HostListener } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';

@Directive({
  selector: '[prs-dropdown-open]'
})
export class DropdownOpenDirective {
  @HostListener('click') openDropdown($event: MouseEvent) {
    this.dropdown.toggle($event);
    // PreventDefault is applied on the DOM event.
    return false;
  }

  constructor(@Host() private dropdown: DropdownDirective) { }

}
