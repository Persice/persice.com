import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Person} from '../shared/model/person';
import {ProfileService} from '../../app/shared/services';
import {UserProfileComponent} from '../user-profile';
import {LoadingComponent} from '../../app/shared/components/loading';
import {CookieUtil} from '../../app/shared/core';

@Component({
  selector: 'prs-mobile-user-profile',
  template: <any>require('./user-profile-loader.html'),
  providers: [ProfileService],
  directives: [UserProfileComponent, LoadingComponent]
})
export class UserProfileLoaderComponent implements OnInit, OnDestroy {

  private me: Person;
  private type: String;
  private usernameFromCookie: string;
  private usernameFromUrl: string;
  private isProfileLoaded: boolean = false;
  private isProfileNotFound: boolean = false;
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
    let sub = this.profileService.ofUsername(this.usernameFromUrl).subscribe(resp => {
      if (resp) {
        this.me = resp;
        this.isProfileLoaded = true;
        this.isProfileNotFound = false;
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
      } else {
        this.isProfileNotFound = true;
        // Redirect to crowd page if profile is not found
        this.router.navigateByUrl('/crowd');
      }
    }, (err) => {
      this.isProfileNotFound = true;
      console.log('Could not load profile', err);
    }, () => {
      sub.unsubscribe();
    });
  }

  ngOnDestroy(): any {
    this.sub.unsubscribe();
  }
}
