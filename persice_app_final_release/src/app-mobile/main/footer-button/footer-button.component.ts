import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../shared/services';

@Component({
  selector: 'prs-mobile-footer-button',
  templateUrl: './footer-button.component.html'
})
export class FooterButtonMobileComponent implements OnInit {
  isVisible: boolean = false;

  constructor(private appStateService: AppStateService) {}

  ngOnInit() {
    this.appStateService.isFooterButtonVisibleEmitter
      .subscribe((visibility: boolean) => this.isVisible = visibility);
  }
}

