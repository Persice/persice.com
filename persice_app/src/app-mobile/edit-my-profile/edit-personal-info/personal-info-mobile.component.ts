import {Component, OnInit, ElementRef} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {Observable} from "rxjs";
import {ProfileService} from "../../../app/shared/services/profile.service";
import {LoadingComponent} from "../../../app/shared/components/loading/loading.component";
import {Person} from "../../shared/model/person";
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";
import {HeaderActions, LeftHeaderState, RightHeaderState, CenterHeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-personal-info',
  template: require('./personal-info-mobile.html'),
  providers: [ProfileService],
  directives: [LoadingComponent, RouterLink]
})
export class PersonalInfoMobileComponent implements OnInit {

  private me: Person;
  private usernameFromCookie: string;
  private isProfileLoaded: boolean = false;
  private isDebouncerSet: boolean = false;

  constructor(
    private profileService: ProfileService,
    private appStateService: AppStateService,
    public element: ElementRef
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit({
      left: LeftHeaderState.Back,
      leftAction: HeaderActions.EditMyProfile,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: HeaderActions.EditMyProfile,
      transparent: false,
      title: 'Personal Info'
    });

    this.profileService.ofUsername(this.usernameFromCookie).subscribe(resp => {
      this.me = new Person(resp);
      this.isProfileLoaded = true;
    });
    this.setupDebouncer();
  }

  private save(): void {
    this.profileService.updateAboutMe(this.me.about).subscribe(() => { });
  }

  private setupDebouncer(): void {
    // This method should be idempotent - calling it multiple times should cause no ill effect.
    // Do nothing if input field is not initialized.
    let inputElement = this.element.nativeElement.querySelector('#aboutMeInput');
    if (!inputElement) {
      return;
    }

    // Do nothing if we already registered a debouncer.
    if (this.isDebouncerSet) {
      return;
    }

    this.isDebouncerSet = true;
    Observable.fromEvent(inputElement, 'keyup')
      .debounceTime(500).subscribe(() => {
        this.save();
      });
  }
}
