/// <reference path="../../typings/_custom.d.ts" />


import {
iit,
it,
ddescribe,
describe,
expect,
inject,
injectAsync,
TestComponentBuilder,
beforeEachProviders,
beforeEach,
fakeAsync,
tick
} from 'angular2/testing';

import {Component, View, provide} from 'angular2/angular2';

import {AppComponent} from './app.component';

import {HomeComponent} from './home/home.component';
import {CrowdComponent} from './crowd/crowd.component';
import {MessagesComponent} from './messages/messages.component';
import {ConnectionsComponent} from './connections/connections.component';
import {EventsComponent} from './events/events.component';
import {ProfileComponent} from './profile/profile.component';


import {HeaderMainComponent} from './headermain/headermain.component';
import {HeaderSubComponent} from './headersub/headersub.component';
import {LoadingComponent} from './loading/loading.component';
import {NotificationComponent} from './notification/notification.component';

import {AuthUserModel} from '../models/user.model';

import {FilterService} from '../services/filter.service';
import {UserService} from '../services/user.service';
import {NotificationService} from '../services/notification.service';


// Create a test component to test directives
@Component({
  selector: 'test-cmp',
  template: '',
  directives: [AppComponent]
})
class TestComponent {
}


describe('App component', () => {


  beforeEachProviders(() => [
    FilterService,
    UserService,
    NotificationService
  ]);

  it('should work',
    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.overrideTemplate(TestComponent, '<div>Lalala</div>')
        .createAsync(TestComponent)
        .then((fixture) => {
          let elRef = fixture.debugElement.elementRef;

          fixture.detectChanges();
          expect(elRef).not.toBeNull(true);

        });
    }));
});


