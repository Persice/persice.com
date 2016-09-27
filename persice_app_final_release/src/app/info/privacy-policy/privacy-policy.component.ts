import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'prs-privacy-policy',
  templateUrl: './privacy-policy.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent implements OnInit {

  ngOnInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }
}
