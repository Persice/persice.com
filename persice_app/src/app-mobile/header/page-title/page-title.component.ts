import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-page-title',
  template: `
  <h2 class="mob-header__title">
    <span class="mob-header__title-value">{{title}}</span>
  </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent {
  @Input() title: string = 'Persice';

}
