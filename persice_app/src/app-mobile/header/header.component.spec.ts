// TODO(sasa): fix unit tests once @angular/router has testing exported
import { inject, addProviders, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions } from '@angular/http';
import { HttpClient } from '../../app/shared/core/http-client';
import { HeaderComponent } from './header.component';
import { FilterService } from '../../app/shared/services/filter.service';
import { NotificationService } from '../../app/shared/services/notification.service';
import { AppStateService } from '../shared/services/app-state.service';
import { HeaderState } from './header.state';

xdescribe('Headercomponent mobile', () => {

  let _tcb: TestComponentBuilder;
  let _instance: HeaderComponent;

  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      HttpClient,
      {
        provide: Http,
        useFactory: (
          connectionBackend: ConnectionBackend,
          defaultOptions: BaseRequestOptions
        ) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      },
      FilterService,
      NotificationService,
      {provide: Location, useClass: SpyLocation},
      AppStateService
    ]);
  });

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    _tcb = tcb;
  }));

  it('Should instantiate', done => {
    return _tcb.createAsync(<any>HeaderComponent).then((componentFixture: ComponentFixture<HeaderComponent>) => {
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
    return _tcb.createAsync(<any>HeaderComponent).then((componentFixture: ComponentFixture<HeaderComponent>) => {
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

