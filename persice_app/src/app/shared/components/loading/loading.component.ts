import { Component, Input } from '@angular/core';

@Component({
  selector: 'prs-loading',
  template: `
    <div *ngIf="status">
      <div class="spinner" [ngClass]="{'small': type === 2}">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  `
})
export class LoadingComponent {
  @Input() status;

  // Spinner type represents size: 1 = default size, 2 = small size
  @Input() type: number;
}
