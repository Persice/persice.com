import { Directive, Host, HostListener } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';

@Directive({
  selector: '[prs-dropdown-toggle]'
})
export class DropdownToggleDirective {
  @HostListener('touchend') toggleDropdown($event?: any) {
    this.dropdown.toggle($event);
  }

  constructor(@Host() private dropdown: DropdownDirective) { }

}
