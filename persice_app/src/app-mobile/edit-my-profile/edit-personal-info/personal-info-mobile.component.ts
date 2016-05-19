import {Component, OnInit, OnDestroy, ElementRef, AfterViewChecked} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {ProfileService} from "../../../app/shared/services/profile.service";
import {LoadingComponent} from "../../../app/shared/components/loading/loading.component";
import {Person} from "../../shared/model/person";
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";

@Component({
  selector: 'prs-mobile-personal-info',
  template: require('./personal-info-mobile.html'),
  providers: [ProfileService, LoadingComponent],
})
export class PersonalInfoMobileComponent implements OnInit, OnDestroy, AfterViewChecked {

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
    this.appStateService.setEditMyProfileState({title: 'Personal info', isDoneButtonVisible: true});
    this.profileService.ofUsername(this.usernameFromCookie).subscribe(resp => {
      this.me = new Person(resp);
      this.isProfileLoaded = true;
    });
  }

  ngAfterViewChecked(): any {
    this.setupDebouncer();
  }

  ngOnDestroy(): any {
    this.appStateService.setHeaderVisibility(true);
  }

  private save(): void {
    this.profileService.updateAboutMe(this.me.about).subscribe(() => {});
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
      return
    }

    this.isDebouncerSet = true;
    Observable.fromEvent(inputElement , 'keyup')
      .debounceTime(500).subscribe(() => {
      this.save();
    });
  }

  public goBack() {
    console.log('back');
  }
}
