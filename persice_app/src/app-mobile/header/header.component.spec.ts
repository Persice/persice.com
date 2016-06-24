import {
  ROUTER_PRIMARY_COMPONENT,
  Router,
  RouteRegistry
} from '@angular/router-deprecated';
import {
  it,
  describe,
  beforeEach,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SpyLocation} from '@angular/common/testing';
import {RootRouter} from '@angular/router-deprecated/src/router';
import {Location} from '@angular/common';

import {MockBackend} from "@angular/http/testing";
import {Http, ConnectionBackend, BaseRequestOptions} from "@angular/http";
import {TestComponentBuilder, ComponentFixture} from "@angular/compiler/testing";
import {HttpClient} from "../../app/shared/core/http-client";
import {HeaderComponent} from "./header.component";
import {FilterService} from "../../app/shared/services/filter.service";
import {NotificationService} from "../../app/shared/services/notification.service";
import {AppMobileComponent} from "../app-mobile.component";
import {AppStateService} from "../shared/services/app-state.service";
import {HeaderState} from "./header.state";

describe('Headercomponent mobile', () => {

  let _tcb: TestComponentBuilder;
  let _instance: HeaderComponent;

  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      RouteRegistry,
      MockBackend,
      HttpClient,
      provide(Http, {
        useFactory: (connectionBackend: ConnectionBackend,
                     defaultOptions: BaseRequestOptions) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      }),
      FilterService,
      NotificationService,
      provide(Location, { useClass: SpyLocation }),
      provide(Router, { useClass: RootRouter }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppMobileComponent }),
      AppStateService
    ];
  });

  beforeEach(inject([TestComponentBuilder], ( tcb) => {
    _tcb = tcb;
  }));

  it('Should instantiate', done => {
    return _tcb.createAsync(HeaderComponent).then((componentFixture: ComponentFixture<HeaderComponent>) => {
      // given
      componentFixture.detectChanges();
      componentFixture.componentInstance.ngOnInit();
      _instance = componentFixture.componentInstance;

      // then
      expect(_instance).toBeDefined();
      expect(_instance.headerState).toBe(HeaderState.initial);
      done();
    }).catch(e => done.fail(e));
  });

  it('Opens filters', done => {
    return _tcb.createAsync(HeaderComponent).then((componentFixture: ComponentFixture<HeaderComponent>) => {
      // given
      componentFixture.detectChanges();
      componentFixture.componentInstance.ngOnInit();
      _instance = componentFixture.componentInstance;

      // when
      _instance.onAction(_instance.actions.FiltersOpen);

      // then
      expect(_instance.isHeaderVisible).toBe(false);
      done();
    }).catch(e => done.fail(e));
  });
});

