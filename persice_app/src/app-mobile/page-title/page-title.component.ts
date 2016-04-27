import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';

@Component({
  selector: 'prs-page-title',
  template: '<h2 class="mob-header__title">{{pageTitle}}</h2>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent {
  @Input() set title(value: string) {
    this.pageTitle = value.replace(/-/g, ' '); //replace '-' char with space
  }
  pageTitle: string  = '';
}
