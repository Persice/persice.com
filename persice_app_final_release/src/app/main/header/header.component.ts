import { Component, Input } from '@angular/core';

@Component({
  selector: 'prs-header',
  templateUrl: './header.html'
})
export class HeaderComponent {
  @Input() image: string;
}
