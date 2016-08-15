import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'prs-terms-of-service',
  template: <any>require('./terms-of-service.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceComponent implements OnInit {

  ngOnInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }
}
