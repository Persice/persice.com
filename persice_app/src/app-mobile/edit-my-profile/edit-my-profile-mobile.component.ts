import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouterOutlet, RouteConfig, Router, RouteParams} from '@angular/router-deprecated';

import {AppStateService} from '../shared/services';

import {EditMyProfileNavigationComponent} from './edit-my-profile-navigation.component';
import {EditInterestsMobileComponent} from '../edit-interests';

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

      default:
        break;
    }
  }
}
