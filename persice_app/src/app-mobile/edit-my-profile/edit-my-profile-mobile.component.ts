import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {AppStateService} from '../shared/services';
import {CookieUtil} from "../../app/shared/core/util";
import {InterestsService, GoalsService, OffersService, PhotosService}
from '../../app/shared/services';

@Component({
  selector: 'prs-mobile-edit-my-profile',
  template: require('./edit-my-profile-mobile.html'),
  providers: [InterestsService, GoalsService, OffersService, PhotosService],
  directives: [RouterLink]
})
export class EditMyProfileMobileComponent implements OnInit, OnDestroy {
  public username: string = CookieUtil.getValue('user_username');

  public interestsCounter: number = 0;
  public offersCounter: number = 0;
  public goalsCounter: number = 0;
  public photosCounter: number = 0;

  constructor(
    private appStateService: AppStateService,
    private interestsService: InterestsService,
    private goalsService: GoalsService,
    private offersService: OffersService,
    private photosService: PhotosService
    ) { }

  ngOnInit() {
    this.appStateService.setHeaderVisibility(false);
    this._getCounters();
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
  }

  private _getCounters() {
    this.interestsService.getCount()
      .subscribe((count: number) => this.interestsCounter = count);

    this.goalsService.getCount()
      .subscribe((count: number) => this.goalsCounter = count);

    this.offersService.getCount()
      .subscribe((count: number) => this.offersCounter = count);

    this.photosService.getCount()
      .subscribe((count: number) => this.photosCounter = count);
  }


}
