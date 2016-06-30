import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Person} from '../shared/model/person';
import {ProfileService} from '../../app/shared/services';
import {UserProfileComponent} from '../user-profile';
import {LoadingComponent} from '../../app/shared/components/loading';
import {CookieUtil} from '../../app/shared/core';

@Component({
  selector: 'prs-mobile-user-profile',
  template: require('./user-profile-loader.html'),
  providers: [ProfileService],
  directives: [UserProfileComponent, LoadingComponent]
})
export class UserProfileLoaderComponent implements OnInit, OnDestroy {

  private me: Person;
  private type: String;
  private usernameFromCookie: string;
  private usernameFromUrl: string;
  private isProfileLoaded: boolean = false;
  private isStandalonePage: boolean = false;
  private sub: any;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');

    this.sub = this.route.params.subscribe(params => {
      this.usernameFromUrl = params['username'];
    });
  }

  ngOnInit() {
    this.profileService.ofUsername(this.usernameFromUrl).subscribe(resp => {
      this.me = resp;
      this.isProfileLoaded = true;

      if (this.usernameFromCookie === this.usernameFromUrl) {
        this.type = 'my-profile';
      } else {
        this.isStandalonePage = true;
        if (!!resp.connected) {
          this.type = 'connection';
        } else {
          this.type = 'crowd';
        }
      }
    });
  }

  ngOnDestroy(): any {
    this.sub.unsubscribe();
  }
}