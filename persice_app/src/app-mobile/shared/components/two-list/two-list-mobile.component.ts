import {OnInit, OnDestroy} from '@angular/core';
import {TwoListService} from "../../services/two-list.service";
import {ScrollableList} from "./scrollable-list";

const STEP_SIZE: number = 20;

export class TwoListMobileComponent implements OnInit, OnDestroy {

  public listParameter: string;

  pageTitle: string;

  firstList: ScrollableList = new ScrollableList();
  secondList: ScrollableList = new ScrollableList();

  constructor(
    protected twoListService: TwoListService) {
  }

  public ngOnInit(): any {
    this.firstList.loading = true;
    this.twoListService.firstList('', STEP_SIZE, this.listParameter).subscribe(response => {
      this._appendItems(this.firstList, response);
    });

    this.secondList.loading = true;
    this.twoListService.secondList('', STEP_SIZE, this.listParameter).subscribe(response => {
      this._appendItems(this.secondList, response);
    });
  }

  public loadMoreFirstList() {
    this._loadMoreIntoList(this.firstList);
  }

  public loadMoreSecondList() {
    this._loadMoreIntoList(this.secondList);
  }

  public ngOnDestroy(): any {
  }

  private _appendItems(list: ScrollableList, response: any) {
    list.items.push(...response.objects);
    list.itemTotalCount = response.meta.total_count;
    list.nextUrl = response.meta.next;
    list.loading = false;
  }

  private _loadMoreIntoList(list: ScrollableList) {
    if (list.nextUrl && !list.loading) {
      list.loading = true;
      this.twoListService.firstList(list.nextUrl, STEP_SIZE, this.listParameter).subscribe(response => {
        this._appendItems(list, response);
      });
    }
  }
}
