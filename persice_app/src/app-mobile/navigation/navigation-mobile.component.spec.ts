import {fakeAsync, inject, TestComponentBuilder, addProviders} from '@angular/core/testing';
import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {NavigationMobileComponent} from './navigation-mobile.component';
import {
  provideTestRouter,
  routesTestConfigAppMobile,
  createRoot,
  advance,
  obtainElement,
  obtainText
} from '../../common/test/app-mobile-test.helpers';

@Component({
  selector: 'prs-test-component',
  template: `
    <prs-mobile-navigation
      [username]="username"
      [unreadMessagesCounter]="counter"
      [newConnectionsCounter]="counterConnections">
    </prs-mobile-navigation>
    <router-outlet></router-outlet>
  `,
  directives: [NavigationMobileComponent, ROUTER_DIRECTIVES]
})
class TestComponent {
  username: string = '';
  counter: number = 0;
  counterConnections: number = 0;
}

describe('Navigation mobile component', () => {

  beforeEach(() => {
    addProviders([
      provideTestRouter(TestComponent, routesTestConfigAppMobile)
    ]);
  });

  it('should initialize', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);

        // when
        advance(fixture);

        // then
        expect(fixture.nativeElement).not.toBeNull();
      })));

  it('should have links', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);

        // when
        advance(fixture);

        // then
        const sidebarLinks: string[] = [
          'crowd', 'messages', 'connections', 'accounts/logout/'];
        for (let i = sidebarLinks.length - 1; i >= 0; i--) {
          expect(fixture.nativeElement.querySelectorAll(`a[href="/${sidebarLinks[i]}"]`).length).toEqual(1);
        }
      })));

  it('should have a link for my profile page with username', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);
        const username = 'johndoe';

        // when
        fixture.componentInstance.username = username;
        advance(fixture);

        // then
        let myProfileLink = fixture.nativeElement.querySelectorAll(`a[href="/${username}"]`);
        expect(myProfileLink.length).toEqual(1);
      })));

  it('should hide unread messages counter when counter is 0', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);
        fixture.componentInstance.counter = 0;
        // when
        advance(fixture);

        // then
        let counterElement = obtainElement(fixture.nativeElement, '.mob-nav-main__value__messages.is-visible');
        expect(counterElement).toBeNull();
      })));

  it('should display unread messages counter when counter is > 0', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);
        fixture.nativeElement.counter = 5;

        // when
        advance(fixture);

        // then
        let counterValue = parseInt(obtainText(fixture.nativeElement, '.mob-nav-main__value__messages'), 10);
        expect(counterValue).toEqual(fixture.componentInstance.counter);
      })));

  it('should hide new connections counter when counter is 0', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);
        fixture.componentInstance.counterConnections = 0;
        // when
        advance(fixture);

        // then
        let counterElement = obtainElement(fixture.nativeElement, '.mob-nav-main__value__connections.is-visible');
        expect(counterElement).toBeNull();
      })));

  it('should display new connections counter when counter is > 0', fakeAsync(
    inject([Router, TestComponentBuilder],
      (router: Router, tcb: TestComponentBuilder) => {
        // given
        const fixture = createRoot(tcb, router, TestComponent);
        fixture.nativeElement.counterConnections = 5;

        // when
        advance(fixture);

        // then
        let counterValue = parseInt(obtainText(fixture.nativeElement, '.mob-nav-main__value__connections'), 10);
        expect(counterValue).toEqual(fixture.componentInstance.counterConnections);
      })));

});
