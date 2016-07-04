import {inject, async, addProviders, TestComponentBuilder, ComponentFixture} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {
  MockConnections,
  MockConnectionsEmpty,
  MockConnectionsService,
  ConnectionsService
} from '../../common/connections';
import {AppStateService} from '../shared/services';
import {ConnectionsMobileComponent} from './connections-mobile.component';
import {FilterService, FriendService} from '../../app/shared/services';
import {NewConnectionsCounterService} from '../../common/services';
import {HttpClient} from '../../app/shared/core/http-client';
import {provideStore} from '@ngrx/store';
import STORE_REDUCERS from '../../common/reducers';
import STORE_ACTIONS from '../../common/actions';

@Component({
  template: `<prs-mobile-connections></prs-mobile-connections>`,
  directives: [ConnectionsMobileComponent],
  providers: [
    FilterService
  ]
})
class TestComponent {
}

let componentInstance: TestComponent;
let componentElement: any;

describe('Connections mobile component', () => {
  let mockConnectionsService: MockConnectionsService;

  beforeEach(() => {
    mockConnectionsService = new MockConnectionsService(null);
    addProviders([
      provideStore(STORE_REDUCERS),
      STORE_ACTIONS,
      mockConnectionsService.getProvider(),
      FilterService,
      NewConnectionsCounterService,
      AppStateService,
      FriendService,
      MockBackend,
      BaseRequestOptions,
      HttpClient,
      {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }
    ]);
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideProviders(
        ConnectionsMobileComponent, [{provide: ConnectionsService, useValue: mockConnectionsService}])
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture<any>) => {
        this.componentFixture = componentFixture;
        componentInstance = componentFixture.componentInstance;
        componentElement = componentFixture.nativeElement;
      });
  })));

  it('should show connections list when connections returns results', () => {
    // given
    connectionsServiceReturnsResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const connectionsLength = obtainLength(componentElement, '.user-card');
    expect(connectionsLength).toBeGreaterThan(0);
  });

  it('should be empty when connections returns zero results', () => {
    // given
    connectionsServiceReturnsNoResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const connectionsLength = obtainLength(componentElement, '.user-card');
    expect(connectionsLength).toEqual(0);
  });

  function connectionsServiceReturnsResults() {
    mockConnectionsService.setResponse(MockConnections);
  }

  function connectionsServiceReturnsNoResults() {
    mockConnectionsService.setResponse(MockConnectionsEmpty);
  }

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }

});
