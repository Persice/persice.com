import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit
} from '@angular/core';
import {ListUtil} from '../shared/core';

const LEFT_COUNT = 4;
const RIGHT_COUNT = 3;

@Component({
  selector: 'prs-profile-items',
  template: `
  <h4 class="module-title" *ngIf="!editable">{{title}}
    <span>({{itemsCount}})</span>
  </h4>

  <h4 class="module-title" *ngIf="editable">
    <a (click)="openEdit.next(title)" class="edit-link">{{title}} <span>({{itemsCount}})</span>
     <span class="edit-link__icon">
      <svg role="img" class="icon ">
        <use xlink:href="/static/assets/icons/icons.svg#icon-edit_info"></use>
      </svg>
      </span>
    </a>
  </h4>


  <div class="layout" *ngIf="!editable">
    <div class="layout__item 1/2">
      <ul class="features-list">
        <li class="features-list__match" *ngFor="let item of itemsLeft" [ngClass]="{'features-list__match': item.match}">
         {{item.value}}
        </li>
      </ul>
    </div>
    <div class="layout__item 1/2">
      <ul class="features-list">
        <li *ngFor="let item of itemsRight" [ngClass]="{'features-list__match': item.match}">
          {{item.value}}
        </li>
      </ul>
      <a *ngIf="!showAllItems && itemsCount > 7" (click)="toggleAll()" class="link-blank">Show all</a>
    </div>
  </div>


  <div class="layout" *ngIf="editable">
    <div class="layout__item 1/2">
      <ul class="features-list">
        <a (click)="openEdit.next(title)" class="edit-link">
          <li *ngFor="let item of itemsLeft" [ngClass]="{'features-list__match': item.match}">
            {{item.value}}
          </li>
        </a>
      </ul>
    </div>
    <div class="layout__item 1/2">
      <ul class="features-list">
        <a (click)="openEdit.next(title)" class="edit-link">
          <li *ngFor="let item of itemsRight" [ngClass]="{'features-list__match': item.match}">
            {{item.value}}
          </li>
        </a>
      </ul>
      <a *ngIf="!showAllItems && itemsCount > 7" (click)="toggleAll()" class="link-blank">Show all</a>
    </div>
  </div>
  `
})
export class ItemsComponent implements OnInit, OnChanges {
  @Input() title;
  @Input() items;
  @Input() itemsCount;
  @Input() editable;
  @Output() openEdit: EventEmitter<any> = new EventEmitter();
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

  ngOnChanges(values) {
    this.showAllItems = false;
    this.splitItems(LEFT_COUNT, RIGHT_COUNT);
  }

  ngOnInit() {
    this.showAllItems = false;
    this.splitItems(LEFT_COUNT, RIGHT_COUNT);
  }

  private splitItems(left: number, right: number) {
    this.itemsLeft = ListUtil.take(this.items, left);
    this.itemsRight = ListUtil.skip(this.items, left, right);
  }
}
