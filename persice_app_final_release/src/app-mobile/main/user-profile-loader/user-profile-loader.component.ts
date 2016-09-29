import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../common/services/profile.service';
import { Person } from '../../../common/models/person';
import { TokenUtil } from '../../../common/core';

@Component({
  selector: 'prs-mobile-user-profile',
  templateUrl: './user-profile-loader.html',
  providers: [ ProfileService ],
})
export class UserProfileLoaderComponent implements OnInit, OnDestroy {

  public isProfileLoaded: boolean = false;
  public isProfileNotFound: boolean = false;

  private person: Person;
  private type: String;
  private usernameFromToken: string;
  private usernameFromUrl: string;

  private isStandalonePage: boolean = false;
  private sub: any;
  private userProfilesub: any;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usernameFromToken = TokenUtil.getValue('username');
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.isProfileNotFound = false;
      this.usernameFromUrl = params[ 'username' ];
      this.userProfilesub = this.profileService.ofUsername(this.usernameFromUrl).subscribe(resp => {
        if (resp) {
          this.person = resp;
          this.isProfileLoaded = true;
          this.isProfileNotFound = false;
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
        } else {
          this.isProfileNotFound = true;
          // Redirect to crowd page if profile is not found
          this.router.navigateByUrl('/events/all');
        }
      }, (err) => {
        this.isProfileNotFound = true;
        console.log('Could not load profile', err);
      }, () => {
      });
    });

  }

  ngOnDestroy(): any {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.userProfilesub) {
      this.userProfilesub.unsubscribe();
    }
  }
}
