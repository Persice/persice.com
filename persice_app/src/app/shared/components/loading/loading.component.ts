import {Component, Input} from '@angular/core';

@Component({
  selector: 'prs-loading',
  template: `
    <div *ngIf="status">
      <div class="spinner">
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
}
