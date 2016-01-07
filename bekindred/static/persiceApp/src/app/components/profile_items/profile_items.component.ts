import {Component, Input} from 'angular2/core';
import {ListUtil} from '../../core/util';

const LEFT_COUNT = 4;
const RIGHT_COUNT = 3;

@Component({
  selector: 'profile-items',
  template: `
  <h4 class="module-title">{{title}}
    <span>({{itemsCount}})</span>
  </h4>
  <div class="layout">
    <div class="layout__item 1/2">
      <ul class="features-list">
        <li class="features-list__match" *ngFor="#item of itemsLeft">
          <svg role="img" class="icon icon--tiny" *ngIf="item.match">
            <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-thunder"></use>
          </svg> {{item.value}}
        </li>
      </ul>
    </div>
    <div class="layout__item 1/2">
      <ul class="features-list">
        <li *ngFor="#item of itemsRight">
          <svg role="img" class="icon icon--tiny" *ngIf="item.match">
            <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-thunder"></use>
          </svg> {{item.value}}
        </li>
      </ul>
      <a *ngIf="!showAllItems && itemsCount > 7" (click)="toggleAll()" class="link-blank">Show all</a>
    </div>
  </div>
  `
})
export class ProfileItemsComponent {
  @Input() title;
  @Input() items;
  @Input() itemsCount;
  showAllItems: boolean = false;
  itemsLeft: any[] = [];
  itemsRight: any[] = [];

  toggleAll() {
    if (this.itemsCount > 0) {
      let leftCount = Math.ceil(this.itemsCount / 2);
      let rightCount = this.itemsCount - leftCount;
      this.splitItems(leftCount, rightCount);
    }

    this.showAllItems = true;
  }

  ngOnInit() {
    this.splitItems(LEFT_COUNT, RIGHT_COUNT);
  }

  private splitItems(left: number, right: number) {
    this.itemsLeft = ListUtil.take(this.items, left);
    this.itemsRight = ListUtil.skip(this.items, left, right);
  }
}
