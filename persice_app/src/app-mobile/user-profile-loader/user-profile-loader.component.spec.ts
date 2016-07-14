import {async, inject, TestComponentBuilder, addProviders} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {
  provideTestRouter,
  routesTestConfigAppMobile
} from '../../common/test/app-mobile-test.helpers';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {provideStore} from '@ngrx/store';
import STORE_REDUCERS from '../../common/reducers';
import STORE_ACTIONS from '../../common/actions';

import {Observable} from 'rxjs';
import {UserProfileLoaderComponent} from './user-profile-loader.component';
import {ProfileService} from '../../app/shared/services/profile.service';
import {PersonGenerator} from '../shared/model/person-generator';
import {HttpClient} from '../../app/shared/core';
import {AppStateService} from '../shared/services/app-state.service';

let component: UserProfileLoaderComponent;
let mock: ProfileServiceMock;

@Component({
  selector: 'prs-test-component',
  template: `
    <prs-mobile-user-profile>
    </prs-mobile-user-profile>
    <router-outlet></router-outlet>
  `,
  directives: [UserProfileLoaderComponent, ROUTER_DIRECTIVES]
})
class TestComponent { }

class ProfileServiceMock extends ProfileService {
  profileDto: any;

  public ofUsername(username: string): Observable<any> {
    return Observable.of(this.profileDto);
  }

  public setResponse(dto: any): void {
    this.profileDto = dto;
  }

  public getProvider(): any {
    return { provide: ProfileService, useValue: this };
  }
}

describe('User profile loader', () => {
  let fixture: any;

  beforeEach(() => {
    mock = new ProfileServiceMock(null);
    addProviders([
      provideStore(STORE_REDUCERS),
      STORE_ACTIONS,
      mock.getProvider(),
      MockBackend,
      BaseRequestOptions,
      HttpClient,
      AppStateService,
      {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      },
      provideTestRouter(TestComponent, routesTestConfigAppMobile),
    ]);
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
      UserProfileLoaderComponent, [{ provide: ProfileService, useValue: mock }])
      .createAsync(UserProfileLoaderComponent)
      .then((componentFixture: any) => {
        fixture = componentFixture;
        component = componentFixture.componentInstance;
      });
  })));

  it('should show first name in title', () => {
    // given
    let aPersonDto: any = PersonGenerator.givenAnyPersonDto();
    mock.setResponse(aPersonDto);

    // when
    fixture.detectChanges();

    // then
    expect(displayedUsername()).toBe(aPersonDto.first_name);
  });

  it('should show gender inside profile box', () => {
    // given
    let aPersonDto: any = PersonGenerator.givenAnyPersonDto();
    mock.setResponse(aPersonDto);

    // when
    fixture.detectChanges();

    // then
    expect(displayedGender()).toBe('Female');
  });

  it('should show age inside profile box', () => {
    // given
    let aPersonDto: any = PersonGenerator.givenAnyPersonDto();
    mock.setResponse(aPersonDto);

    // when
    fixture.detectChanges();

    // then
    expect(displayedAge()).toBe(aPersonDto.age.toString());
  });

  it('should show lives in inside profile box', () => {
    // given
    let aPersonDto: any = PersonGenerator.givenAnyPersonDto();
    mock.setResponse(aPersonDto);

    // when
    fixture.detectChanges();

    // then
    expect(displayedLivesIn()).toBe(aPersonDto.lives_in);
  });

  function displayedUsername() {
    let titleElement = fixture.nativeElement.querySelectorAll('.profile-hero__name')[0];
    return titleElement.textContent;
  }

  function displayedGender() {
    let genderElement = fixture.nativeElement.querySelectorAll('.profile-info__gender-value')[0];
    return genderElement.textContent;
  }

  function displayedAge() {
    let ageElement = fixture.nativeElement.querySelectorAll('.profile-info__age-value')[0];
    return ageElement.textContent;
  }

  function displayedLivesIn() {
    let livesinElement = fixture.nativeElement.querySelectorAll('.profile-info__livesin-value')[0];
    return livesinElement.textContent;
  }
});
