import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../common/services/profile.service';
import { TokenUtil } from '../../../common/core/util';

@Component({
  selector: 'prs-profile-loader',
  templateUrl: './profile-loader.html',
  providers: [ ProfileService ]
})
export class UserProfileDesktopLoader implements OnInit, OnDestroy {
  user: any;
  type: String;
  usernameFromToken: string;
  usernameFromUrl: string;
  isProfileLoaded: boolean = false;
  isProfileNotFound: boolean = false;
  isStandalonePage: boolean = false;
  sub: any;
  userProfilesub: any;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usernameFromToken = TokenUtil.getValue('username');
  }

  ngOnInit(): any {
    this._loadUser();
  }

  ngOnDestroy(): any {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.userProfilesub) {
      this.userProfilesub.unsubscribe();
    }
  }

  public refreshUser(event): void {
    this._loadUser();
  }

  private _loadUser(event?: any): void {
    this.sub = this.route.params.subscribe(params => {
      this.isProfileNotFound = false;
      this.usernameFromUrl = params[ 'username' ];
      this.userProfilesub = this.profileService.ofUsername(this.usernameFromUrl).subscribe(resp => {
        if (resp) {
          this.user = resp;
          if (this.usernameFromToken === this.usernameFromUrl) {
            this.type = 'my-profile';
          } else {
            this.isStandalonePage = true;
            if (!!resp.connected) {
              this.type = 'connection';
            } else {
              this.type = 'crowd';
            }
          }
          this.isProfileLoaded = true;
          this.isProfileNotFound = false;
        } else {
          this.isProfileNotFound = true;
          this.router.navigateByUrl('/');
        }
      }, (err) => {
        this.isProfileNotFound = true;
        console.log('Could not load profile', err);
      }, () => {
      });
    });
  }

}
