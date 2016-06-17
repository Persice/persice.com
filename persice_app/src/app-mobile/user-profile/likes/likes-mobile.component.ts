import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {LikesMobileService} from "../../shared/services/likes-mobile.service";
import {TwoListMobileComponent} from "../../shared/components/two-list/two-list-mobile.component";
import {InfiniteScrollDirective} from "../../../common/directives/infinite-scroll.directive";
import {LoadingComponent} from "../../../app/shared/components/loading/loading.component";

@Component({
  selector: 'prs-mobile-likes',
  template: require('../../shared/components/two-list/two-list-mobile.html'),
  providers: [LikesMobileService],
  directives: [InfiniteScrollDirective, LoadingComponent]
})
export class LikesMobileComponent extends TwoListMobileComponent implements OnInit, OnDestroy {

  @Input() userId: string;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor(
    protected likesService: LikesMobileService
  ) {
    super(likesService);
  }

  public close(event?: any): void {
    this.onClose.emit(event);
  }

  public ngOnInit(): any {
    this.listParameter = this.userId;
    this.pageTitle = 'Likes';
    this.firstList.title = 'Mutual';
    this.secondList.title = 'Other';

    super.ngOnInit();
  }

  public ngOnDestroy(): any {
    super.ngOnDestroy();
  }
}
