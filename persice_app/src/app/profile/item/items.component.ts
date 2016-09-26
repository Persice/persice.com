import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { ListUtil } from '../../../common/core/util';

const LEFT_COUNT = 4;
const RIGHT_COUNT = 3;

@Component({
  selector: 'prs-profile-items',
  template: <any>require('./items.html')
})
export class ItemsComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() items: any[];
  @Input() editable: boolean;
  @Output() openEdit: EventEmitter<any> = new EventEmitter();
  private showAllItems: boolean = false;
  private itemsLeft: any[] = [];
  private itemsRight: any[] = [];

  ngOnChanges(values): any {
    this.showAllItems = false;
    this.splitItems(LEFT_COUNT, RIGHT_COUNT);
  }

  ngOnInit(): any {
    this.showAllItems = false;
    this.splitItems(LEFT_COUNT, RIGHT_COUNT);
  }

  private toggleAll(): void {
    if (this.items.length > 0) {
      let leftCount = Math.ceil(this.items.length / 2);
      let rightCount = this.items.length - leftCount;
      this.splitItems(leftCount, rightCount);
    }

    this.showAllItems = true;
  }

  private splitItems(left: number, right: number): void {
    this.itemsLeft = ListUtil.take(this.items, left);
    this.itemsRight = ListUtil.skip(this.items, left, right);
  }
}
