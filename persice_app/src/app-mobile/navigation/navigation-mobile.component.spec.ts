import {expect, it, async, describe, inject, beforeEach, beforeEachProviders}
from '@angular/core/testing';
import {MockRouterProvider} from '../../common/test/mocks/routes';

import {TestComponentBuilder} from '@angular/compiler/testing';
import {NavigationMobileComponent} from './navigation-mobile.component';

let component: NavigationMobileComponent;
let domElement: any;

describe('Navigation mobile component', () => {
  var mockRouterProvider: MockRouterProvider;

  beforeEachProviders(() => {
    mockRouterProvider = new MockRouterProvider();

    return [
      mockRouterProvider.getProviders()
    ];
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(NavigationMobileComponent)
      .then((componentFixture: any) => {
        this.componentFixture = componentFixture;
        component = componentFixture.componentInstance;
        domElement = componentFixture.nativeElement;
      });
  })));

  it('should render', () => {
    this.componentFixture.detectChanges();
    expect(domElement).not.toBeNull();
  });

  it('should have links in sidebar', () => {
    this.componentFixture.detectChanges();

    var sidebarLinks = [
      'my-profile', 'crowd', 'messages', 'connections', 'events', 'settings', 'logout'];
    for (var link in sidebarLinks) {
      expect(domElement.querySelectorAll(`a[href="/${link}"]`)).not.toBeNull();
    }
  });
});
