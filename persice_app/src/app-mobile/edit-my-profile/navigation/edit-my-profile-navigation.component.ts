import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {CookieUtil} from '../../../app/shared/core/util';
import {GoalsService, OffersService, PhotosService, InterestsService}
from '../../../app/shared/services';

@Component({
  selector: 'prs-mobile-edit-my-profile-navigation',
  template: require('./edit-my-profile-navigation.html'),
  directives: [RouterLink],
  providers: [InterestsService, GoalsService, OffersService, PhotosService]
})
export class EditMyProfileNavigationComponent implements OnInit {

  public interestsCounter: number = 0;
  public offersCounter: number = 0;
  public goalsCounter: number = 0;
  public photosCounter: number = 0;
  private usernameFromCookie: string;

  constructor(
    private interestsService: InterestsService,
    private goalsService: GoalsService,
    private offersService: OffersService,
    private photosService: PhotosService
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
  }

  ngOnInit() {
    this._getCounters();
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
