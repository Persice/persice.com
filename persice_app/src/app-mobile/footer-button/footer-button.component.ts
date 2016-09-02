import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../shared/services';

@Component({
  selector: 'prs-mobile-footer-button',
  template: `
    <div class="footer-button-container" *ngIf="isVisible">
      <a class="btn btn--add">
        <svg role="img" class="icon ">
          <use xlink:href="/assets/icons/icons.svg#icon-plus-big"></use>
        </svg>
      </a>
    </div>
  `
})
export class FooterButtonMobileComponent implements OnInit {
  isVisible: boolean = false;

  constructor(private appStateService: AppStateService) {}

  ngOnInit() {
    this.appStateService.isFooterButtonVisibleEmitter
      .subscribe((visibility: boolean) => this.isVisible = visibility);
  }
}

