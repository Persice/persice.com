import {Component, OnInit, OnDestroy} from '@angular/core'
import {TwoListService} from "../../services/two-list.service";

export class TwoListMobileComponent implements OnInit, OnDestroy {

  public listParameter: string;

  pageTitle: string;
  firstListCount: string;
  firstListTitle: string;
  firstList: any[] = [];
  secondListCount: string;
  secondListTitle: string;
  secondList: any[] = [];

  constructor(
    protected twoListService: TwoListService) {
  }

  public ngOnInit(): any {
    this.twoListService.firstList('', 20, this.listParameter).subscribe(response => {
      this.firstList = response.objects;
      this.firstListCount = response.meta.total_count;
    });

    this.twoListService.secondList('', 20, this.listParameter).subscribe(response => {
      this.secondList = response.objects;
      this.secondListCount = response.meta.total_count;
    });
  }

  public ngOnDestroy(): any {
  }

} 