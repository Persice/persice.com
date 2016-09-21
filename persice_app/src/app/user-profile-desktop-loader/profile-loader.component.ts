// TODO: After update to RC.5, update code for dynamically creating component
// Example:
// import {Component, Compiler, ViewContainerRef, ViewChild, ComponentRef, ComponentFactory, ComponentFactoryResolver} from '@angular/core'
// import {HelloComponent} from './hello.component'
//
// @Component({
//   selector: 'my-app',
//   providers: [],
//   template: `
//     <div>
//       <h2>Dynamicaly Add Elements</h2>
//       <button (click)="addItem()">add hello</button>
//       <div #placeholder></div>
//     </div>
//   `,
//   entryComponents: [HelloComponent]
// })
// export class App {
//   @ViewChild('placeholder', {read: ViewContainerRef}) viewContainerRef;
//   private componentFactory: ComponentFactory<any>;
//
//   constructor(componentFactoryResolver: ComponentFactoryResolver, compiler: Compiler) {
//     this.componentFactory = componentFactoryResolver.resolveComponentFactory(HelloComponent);
//     //this.componentFactory = compiler.compileComponentSync(HelloComponent);
//   }
//
//   addItem () {
//     this.viewContainerRef.createComponent(this.componentFactory, 0);
//   }
// }
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileDesktopComponent } from '../profile/user-profile-desktop.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { ProfileService } from '../shared/services/profile.service';
import { TokenUtil } from '../../common/core/util';

@Component({
  selector: 'prs-profile-loader',
  template: <any>require('./profile-loader.html'),
  providers: [ProfileService],
  directives: [UserProfileDesktopComponent, LoadingComponent]
})
export class UserProfileDesktopLoader implements OnInit, OnDestroy {
  private user: any;
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

  ngOnInit(): any {
    this.sub = this.route.params.subscribe(params => {
      this.isProfileNotFound = false;
      this.usernameFromUrl = params['username'];
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
