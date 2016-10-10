import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HeaderState } from '../../header';
import { LikesMobileService } from '../../../shared/services/likes-mobile.service';
import { AppStateService } from '../../../shared/services';
import { TwoListMobileComponent } from '../../../shared/components/two-list/two-list-mobile.component';

@Component({
  selector: 'prs-mobile-likes',
  templateUrl: '../../../shared/components/two-list/two-list-mobile.html',
  providers: [ LikesMobileService ]
})
export class LikesMobileComponent extends TwoListMobileComponent implements OnInit, OnDestroy {

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

    setTimeout(() => {
      document.body.scrollTop = 0;
    });

    super.ngOnInit();
  }

  ngOnDestroy(): any {
    super.ngOnDestroy();
  }

}
