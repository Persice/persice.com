import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InfoHeaderComponent } from '../header';

@Component({
  selector: 'prs-terms-of-service',
  template: <any>require('./terms-of-service.html'),
  directives: [InfoHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceComponent implements OnInit {

  ngOnInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }
}
