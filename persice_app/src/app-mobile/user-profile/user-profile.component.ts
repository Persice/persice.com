import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit
} from 'angular2/core';

import {GenderPipe} from '../../app/shared/pipes';
import {CheckImageDirective} from "../../app/shared/directives";

import {AboutMobileComponent} from './about-mobile.component';
import {ItemsListMobileComponent} from './items-list.component';
import {ObjectUtil} from '../../app/shared/core';

import {
  ReligiousViewsService,
  PoliticalViewsService
} from '../../app/shared/services';

@Component({
  selector: 'prs-user-profile',
  template: require('./user-profile.html'),
  pipes: [GenderPipe],
  directives: [
    CheckImageDirective,
    AboutMobileComponent,
    ItemsListMobileComponent
  ],
  providers: [
    ReligiousViewsService,
    PoliticalViewsService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements AfterViewInit {

  // When [user] from Input property change, set internal state for our component
  @Input() set user(value) {
    this._setState(value);
  }
  @Output() onCloseProfile: EventEmitter<any> = new EventEmitter();

  // Person object which is displayed in the component template
  person: any;

  // Boolean flag which controls whether full profile information is collapsed and visible
  profileExtraInfoVisible: boolean = false;

  // List of religious views for person
  religiousViews = [];

  // List of political views for person
  politicalViews = [];

  // Lists and counters for profile interests, goals and offers
  interests: any[] = [];
  goals: any[] = [];
  offers: any[] = [];
  interestsCount: number = 0;
  goalsCount: number = 0;
  offersCount: number = 0;

  // Indicator for which tab is active: interests(0), goals(1), offers(2)
  activeTab: number = 0;

  constructor(
    private _religiousViewsService: ReligiousViewsService,
    private _politicalViewsService: PoliticalViewsService
  ) {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  public toggleProfileExtraInfoVisibility(event) {
    this.profileExtraInfoVisible = !this.profileExtraInfoVisible;
  }

  /**
   * Activate interests, goals or offers tab
   * @param {number} tab active tab: interests(0), goals(1), offers(2)
   */
  public activateTab(tab: number) {
    this.activeTab = tab;
  }

  private _getReligiousViews(id) {
    this._religiousViewsService.getByUser('', 100, id)
      .subscribe((data: any) => {
        if (data.meta.total_count > 0) {
          let items = data.objects;
          this.religiousViews = items;
        }
      });
  }

  private _getPoliticalViews(id) {
    this._politicalViewsService.getByUser('', 100, id)
      .subscribe(
      (data: any) => {
        if (data.meta.total_count > 0) {
          let items = data.objects;
          this.politicalViews = items;
        }
      });
  }

  private _setState(value: any) {
    this.person = value;
    this._getReligiousViews(this.person.id);
    this._getPoliticalViews(this.person.id);

    this.offers = ObjectUtil.transformSorted(this.person.offers[0]);
    this.interests = ObjectUtil.transformSorted(this.person.interests[0]);
    this.goals = ObjectUtil.transformSorted(this.person.goals[0]);
    this.interestsCount = ObjectUtil.count(this.person.interests[0]);
    this.offersCount = ObjectUtil.count(this.person.offers[0]);
    this.goalsCount = ObjectUtil.count(this.person.goals[0]);
  }

}
