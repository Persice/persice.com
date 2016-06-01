import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

const PAGES_WITH_COUNTER: string[] = ['messages'];
@Component({
  selector: 'prs-page-title',
  template: `
  <h2 class="mob-header__title">{{pageTitle}}
    <span *ngIf="conversationsCounterVisible">({{conversationsCounter}})</span>
  </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent {
  @Input() set title(value: string) {
    this.pageTitle = value.replace(/-/g, ' '); //replace '-' char with space

    if (PAGES_WITH_COUNTER.indexOf(this.pageTitle) > -1) {
      this.conversationsCounterVisible = true;
    } else {
      this.conversationsCounterVisible = false;
    }

  }
  @Input() conversationsCounter;

  public pageTitle: string  = '';
  private conversationsCounterVisible: boolean = false;

}
