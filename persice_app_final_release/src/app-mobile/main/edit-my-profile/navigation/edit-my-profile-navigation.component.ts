import { Component, OnInit } from '@angular/core';
import { HeaderState } from '../../header';
import { InterestsService } from '../../../../common/services/interests.service';
import { GoalsService } from '../../../../common/services/goals.service';
import { OffersService } from '../../../../common/services/offers.service';
import { PhotosService } from '../../../../common/services/photos.service';
import { AppStateService } from '../../../shared/services';
import { TokenUtil } from '../../../../common/core';

@Component({
  selector: 'prs-mobile-edit-my-profile-navigation',
  templateUrl: './edit-my-profile-navigation.html',
  providers: [ InterestsService, GoalsService, OffersService, PhotosService ]
})
export class EditMyProfileNavigationComponent implements OnInit {

  public interestsCounter: number = 0;
  public offersCounter: number = 0;
  public goalsCounter: number = 0;
  public photosCounter: number = 0;
  private usernameFromToken: string;

  constructor(
    private interestsService: InterestsService,
    private goalsService: GoalsService,
    private offersService: OffersService,
    private photosService: PhotosService,
    private appStateService: AppStateService
  ) {
    this.usernameFromToken = TokenUtil.getValue('username');
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(HeaderState.editMyProfile);
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
