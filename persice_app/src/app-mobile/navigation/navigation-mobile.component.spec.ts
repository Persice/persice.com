import {expect, it, async, describe, inject, beforeEach, beforeEachProviders}
from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component, provide} from '@angular/core';
import {SpyLocation} from '@angular/common/testing';
import {RootRouter} from '@angular/router-deprecated/src/router';
import {Location} from '@angular/common';

import {
  ROUTER_PRIMARY_COMPONENT,
  Router,
  RouteRegistry,
  RouterLink
} from '@angular/router-deprecated';

import {AppMobileComponent} from '../app-mobile.component';

import {NavigationMobileComponent} from './navigation-mobile.component';

let component: TestComponent;
let domElement: any;

@Component({
  selector: 'prs-test-component',
  template: `
    <prs-mobile-navigation
      [username]="username"
      [unreadMessagesCounter]="counter"
      [newConnectionsCounter]="counterConnections">
    </prs-mobile-navigation>
  `,
  directives: [NavigationMobileComponent]

})
class TestComponent {
  username: string = '';
  counter: number = 0;
  counterConnections: number = 0;
}

describe('Navigation mobile component', () => {

  beforeEachProviders(() => {
    return [
      RouterLink,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(Router, { useClass: RootRouter }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppMobileComponent })
    ];
  });

  beforeEach(async(inject([Router, TestComponentBuilder], (router: Router, tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(TestComponent)
      .then((componentFixture: any) => {
        this.componentFixture = componentFixture;
        component = componentFixture.componentInstance;
        domElement = componentFixture.nativeElement;
      });
  })));

  it('should render', () => {
    // given

    // when
    this.componentFixture.detectChanges();

    // then
    expect(domElement).not.toBeNull();
  });

  it('should have links', () => {
    // given

    // when
    this.componentFixture.detectChanges();

    // then
    var sidebarLinks = [
      'crowd', 'messages', 'connections', 'accounts/logout/'];
    for (var i = sidebarLinks.length - 1; i >= 0; i--) {
      expect(domElement.querySelectorAll(`a[href="/${sidebarLinks[i]}"]`).length).toEqual(1);
    }

  });

  it('should have a link for my profile page with username', () => {
    // given
    const username = 'johndoe';

    // when
    component.username = username;
    this.componentFixture.detectChanges();

    // then
    let myProfileLink = domElement.querySelectorAll(`a[href="/${username}"]`);
    expect(myProfileLink.length).toEqual(1);
  });

  it('should hide unread messages counter when counter is 0', () => {
    // given
    component.counter = 0;

    // when
    this.componentFixture.detectChanges();

    // then
    let counterElement = obtainElement(domElement, '.mob-nav-main__value__counter.is-visible');
    expect(counterElement).toBeNull();
  });

  it('should display unread messages counter when counter is > 0', () => {
    // given
    component.counter = 5;

    // when
    this.componentFixture.detectChanges();

    // then
    let counterValue = parseInt(obtainText(domElement, '.mob-nav-main__value__counter'), 10);
    expect(counterValue).toEqual(component.counter);
  });

  it('should hide new connections counter when counter is 0', () => {
    // given
    component.counterConnections = 0;

    // when
    this.componentFixture.detectChanges();

    // then
    let counterElement = obtainElement(domElement, '.mob-nav-main__value__counter_connections.is-visible');
    expect(counterElement).toBeNull();
  });

  it('should display new connections counter when counter is > 0', () => {
    // given
    component.counterConnections = 10;

    // when
    this.componentFixture.detectChanges();

    // then
    let counterValue = parseInt(obtainText(domElement, '.mob-nav-main__value__counter_connections'), 10);
    expect(counterValue).toEqual(component.counterConnections);
  });

  function obtainText(element, selector) {
    return element.querySelector(selector).textContent;
  }

  function obtainElement(element, selector) {
    return element.querySelector(selector);
  }

});
