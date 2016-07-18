import { inject, async, addProviders, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FriendService, FilterService } from '../shared/services';
import { ConnectionsDesktopComponent } from './connections-desktop.component';
import { ConnectionsService } from '../../common/connections/connections.service';
import { MockConnections, MockConnectionsEmpty } from '../../common/connections/connections.mock';
import { MockConnectionsService } from '../../common/connections/connections.service.mock';
import { HttpClient } from '../shared/core/http-client';

// Create a test component to test directives.
@Component({
  template: '<prs-connections></prs-connections>',
  directives: [ConnectionsDesktopComponent],
  providers: [
    FilterService
  ]
})
class TestComponent {
}

let componentInstance: TestComponent;
let componentElement: any;

xdescribe('Connections desktop component', () => {
  let mockConnectionsService: MockConnectionsService;

  beforeEach(() => {
    mockConnectionsService = new MockConnectionsService(null);
    addProviders([
      mockConnectionsService.getProvider(),
      FilterService,
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
        ConnectionsDesktopComponent, [{provide: ConnectionsService, useValue: mockConnectionsService}])
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
    const connectionsLength = obtainLength(componentElement, '.card--user');
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
