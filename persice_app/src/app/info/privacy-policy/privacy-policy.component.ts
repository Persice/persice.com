import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InfoHeaderComponent } from '../header';

@Component({
  selector: 'prs-privacy-policy',
  template: <any>require('./privacy-policy.html'),
  directives: [InfoHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent implements OnInit {

  ngOnInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }
}
