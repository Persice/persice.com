import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouterOutlet, RouteConfig, Router, RouteParams} from '@angular/router-deprecated';

import {AppStateService} from '../shared/services';

import {EditMyProfileNavigationComponent} from './navigation/edit-my-profile-navigation.component.ts';
import {EditInterestsMobileComponent} from './edit-interests';
import {PersonalInfoMobileComponent} from "./edit-personal-info/personal-info-mobile.component";
import {ReligiousViewsMobileComponent} from "./edit-religious-views/religious-views-mobile.component";
import {PoliticalViewsMobileComponent} from "./edit-political-views/political-views-mobile.component";

@Component({
  selector: 'prs-mobile-edit-my-profile',
  template: require('./edit-my-profile-mobile.html'),
  directives: [RouterOutlet]
})
@RouteConfig([
  {
    path: '/',
    component: EditMyProfileNavigationComponent,
    name: 'EditNavigation',
    useAsDefault: true
  },
  {
    path: '/interests',
    component: EditInterestsMobileComponent,
    name: 'EditInterests'
  },
  {
    path: '/personal',
    component: PersonalInfoMobileComponent,
    name: 'EditPersonalInfo'
  },
  {
    path: '/religious',
    component: ReligiousViewsMobileComponent,
    name: 'EditReligiousViews'
  },
  {
    path: '/political',
    component: PoliticalViewsMobileComponent,
    name: 'EditPoliticalViews'
  }
])
export class EditMyProfileMobileComponent implements OnInit, OnDestroy {
  public title: string = 'edit';
  public isDoneButtonVisible: boolean = false;

  private username: string;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private params: RouteParams
  ) {
    this.username = params.get('username');
  }

  ngOnInit() {
    this.appStateService.setHeaderVisibility(false);

    this.appStateService.editMyProfileStateEmitter
      .subscribe((state: any) => {
        this.title = state.title;
        this.isDoneButtonVisible = state.isDoneButtonVisible;
      });
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
  }

  public goBack(event) {
    switch (this.title) {
      case 'edit':
        this.router.parent.navigate(['./MyProfile', { username: this.username }]);
        break;
      case 'interests':
        this.router.navigate(['EditNavigation']);
        break;
      case 'personal info':
        this.router.navigate(['EditNavigation']);
        break;
      case 'religious views':
        this.router.navigate(['EditPersonalInfo']);
        break;
      case 'political views':
        this.router.navigate(['EditPersonalInfo']);
        break;

      default:
        break;
    }
  }
}
