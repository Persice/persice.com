import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Person } from '../shared/model/person';
import { ProfileService } from '../../app/shared/services';
import { UserProfileComponent } from '../user-profile';
import { LoadingComponent } from '../../app/shared/components/loading';
import { TokenUtil } from '../../common/core';

@Component({
  selector: 'prs-mobile-user-profile',
  template: <any>require('./user-profile-loader.html'),
  providers: [ProfileService],
  directives: [UserProfileComponent, LoadingComponent]
})
export class UserProfileLoaderComponent implements OnInit, OnDestroy {

  private person: Person;
  private type: String;
  private usernameFromToken: string;
  private usernameFromUrl: string;
  private isProfileLoaded: boolean = false;
  private isProfileNotFound: boolean = false;
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
      this.usernameFromUrl = params['username'];
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
