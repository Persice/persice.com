import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {AppStateService} from '../shared/services';
import {InterestsService, GoalsService, OffersService, PhotosService}
from '../../app/shared/services';

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

  editProfileActive: boolean = true;

  constructor(
    private interestsService: InterestsService,
    private goalsService: GoalsService,
    private offersService: OffersService,
    private photosService: PhotosService,
    private appStateService: AppStateService
  ) { }

  ngOnInit() {
    this._getCounters();
    this.appStateService.setEditMyProfileState({ title: 'edit', isDoneButtonVisible: false });
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
