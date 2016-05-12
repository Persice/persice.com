import {expect, it, describe, async, inject, beforeEach, beforeEachProviders}
  from '@angular/core/testing';

import {TestComponentBuilder} from '@angular/compiler/testing';
import {RouteParams} from '@angular/router-deprecated';

import {provide, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {MyProfileMobileComponent} from "./my-profile-mobile.component";
import {ProfileService} from "../../app/shared/services/profile.service";
import {PersonGenerator} from "../shared/model/person-generator";

let component: MyProfileMobileComponent;
let mock: ProfileServiceMock;

class ProfileServiceMock extends ProfileService {
  profileDto: any;

  public ofUsername(username:string): Observable<any> {
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
      provide(RouteParams,
        { useValue: new RouteParams({ username: PersonGenerator.givenAnyFirstName()}) })
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

  it('should show username in title', () => {
    // given
    let aPersonDto: any = PersonGenerator.givenAnyPersonDto();
    mock.setResponse(aPersonDto);

    // when
    component.ngOnInit();

    // then
    expect(displayedUsername()).toBe(aPersonDto.first_name);
  });

  function displayedUsername() {
    let titleElement = fixture.nativeElement.querySelectorAll('.profile-hero__name');
    return titleElement.textContent;
  }
});
