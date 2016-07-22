import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LikesMobileService } from '../../shared/services/likes-mobile.service';
import { TwoListMobileComponent } from '../../shared/components/two-list/two-list-mobile.component';
import { InfiniteScrollDirective } from '../../../common/directives/infinite-scroll.directive';
import { LoadingComponent } from '../../../app/shared/components/loading/loading.component';
import { AppStateService } from '../../shared/services';
import { HeaderState } from '../../header';

@Component({
  selector: 'prs-mobile-likes',
  template: require('../../shared/components/two-list/two-list-mobile.html'),
  providers: [LikesMobileService],
  directives: [InfiniteScrollDirective, LoadingComponent]
})
export class LikesMobileComponent extends TwoListMobileComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() userId: string;
  @Input() hideMutualLikesTitle: boolean;

  constructor(
    protected likesService: LikesMobileService,
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) {
    super(likesService);
  }

  ngOnInit(): any {

    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle('likes', HeaderState.actions.ShowUserProfile)
    );

    this.listParameter = this.userId;
    this.firstList.title = 'Mutual';
    this.secondList.title = 'Other';
    this.firstList.hideTitle = this.hideMutualLikesTitle;

    super.ngOnInit();
  }

  ngOnDestroy(): any {
    super.ngOnDestroy();
  }

  ngAfterViewInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

}
