import {OnInit, OnDestroy} from '@angular/core'
import {TwoListService} from "../../services/two-list.service";

const STEP_SIZE: number = 20;

export class TwoListMobileComponent implements OnInit, OnDestroy {

  public listParameter: string;

  pageTitle: string;
  firstListCount: string;
  firstListTitle: string;
  firstList: any[] = [];
  secondListCount: string;
  secondListTitle: string;
  secondList: any[] = [];

  firstListNextUrl: string;
  secondListNextUrl: string;

  constructor(
    protected twoListService: TwoListService) {
  }

  public ngOnInit(): any {
    this.twoListService.firstList('', STEP_SIZE, this.listParameter).subscribe(response => {
      this.firstList = response.objects;
      this.firstListCount = response.meta.total_count;
      this.firstListNextUrl = response.meta.next;
    });

    this.twoListService.secondList('', STEP_SIZE, this.listParameter).subscribe(response => {
      this.secondList = response.objects;
      this.secondListCount = response.meta.total_count;
      this.secondListNextUrl = response.meta.next;
    });
  }

  public loadMoreFirstList() {
    if (this.firstListNextUrl) {
      this.twoListService.firstList(this.firstListNextUrl, STEP_SIZE, this.listParameter).subscribe(response => {
        this.firstList.push(response.objects);
        this.firstListNextUrl = response.meta.next;
      });
    }
  }

  public loadMoreSecondList() {
    if (this.secondListNextUrl) {
      this.twoListService.secondList(this.secondListNextUrl, STEP_SIZE, this.listParameter).subscribe(response => {
        this.secondList.push(response.objects);
        this.secondListNextUrl = response.meta.next;
      });
    }
  }

  public ngOnDestroy(): any {
  }
}
