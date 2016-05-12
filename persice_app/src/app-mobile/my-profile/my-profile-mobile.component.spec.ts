import {expect, it, describe, async, inject, beforeEach, beforeEachProviders}
from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';
import {RouteParams} from '@angular/router-deprecated';
import {BaseRequestOptions, Http } from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {provide, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {MyProfileMobileComponent} from "./my-profile-mobile.component";
import {ProfileService} from "../../app/shared/services/profile.service";
import {AppStateService} from '../shared/services';
import {PersonGenerator} from "../shared/model/person-generator";
import {HttpClient} from '../../app/shared/core';

let component: MyProfileMobileComponent;
let mock: ProfileServiceMock;

class ProfileServiceMock extends ProfileService {
  profileDto: any;

  public ofUsername(username: string): Observable<any> {
    return Observable.of(this.profileDto);
  }

  public setResponse(dto: any): void {
    this.profileDto = dto;
  }

  public getProvider(): Provider {
    return provide(ProfileService, { useValue: this });
  }
}

describe('My profile mobile component', () => {
  let fixture: any;

  beforeEachProviders(() => {
    mock = new ProfileServiceMock(null);
    return [
      mock.getProvider(),
      MockBackend,
      BaseRequestOptions,
      HttpClient,
      provide(Http, {
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }),
      AppStateService,
      provide(RouteParams,
        { useValue: new RouteParams({ username: PersonGenerator.givenAnyFirstName() }) })
    ];
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
      MyProfileMobileComponent, [provide(ProfileService, { useValue: mock })])
      .createAsync(MyProfileMobileComponent)
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

  it('should show distance value and unit in subtitle', () => {
    // given
    let aPersonDto: any = PersonGenerator.givenAnyPersonDto();
    mock.setResponse(aPersonDto);

    // when
    fixture.detectChanges();

    // then
    let expectedDistance = aPersonDto.distance[0] + ' ' + aPersonDto.distance[1] + ' from you';
    expect(displayedDistance()).toBe(expectedDistance);
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
    expect(displayedAge()).toBe(aPersonDto.age);
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

  function displayedDistance() {
    let distanceElement = fixture.nativeElement.querySelectorAll('.profile-hero__name-meta')[0];
    return distanceElement.textContent;
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
