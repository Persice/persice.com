import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core'
import {AppStateService} from "../../shared/services/app-state.service";
import {LikesMobileService} from "../../shared/services/likes-mobile.service";
import {TwoListMobileComponent} from "../../shared/components/two-list/two-list-mobile.component";

@Component({
  selector: 'prs-mobile-likes',
  template: require('../../shared/components/two-list/two-list-mobile.html'),
  providers: [LikesMobileService],
})
export class LikesMobileComponent extends TwoListMobileComponent implements OnInit, OnDestroy {

  @Input() userId: string;
  @Output() onCloseLikes:EventEmitter<any> = new EventEmitter();

  constructor(
    protected appStateService: AppStateService,
    protected likesService: LikesMobileService
  ) {
    super(likesService);
  }

  public close(event?: any): void {
    this.showFooter();
    this.onCloseLikes.emit(event);
  }

  public ngOnInit(): any {
    this.listParameter = this.userId;
    this.pageTitle = 'Likes';
    this.firstListTitle = 'Mutual';
    this.secondListTitle = 'Other';

    this.hideFooter();
    
    super.ngOnInit();
  }

  public ngOnDestroy(): any {
    super.ngOnDestroy();
    this.showFooter();
  }

  private hideFooter() {
    this.appStateService.isProfileFooterVisibleEmitter.emit({visibility: false});
  }

  private showFooter() {
    this.appStateService.isProfileFooterVisibleEmitter.emit({visibility: true});
  }
} 