import {
  it,
  describe,
  expect,
  inject,
  async,
  beforeEachProviders
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component, provide} from '@angular/core';
import {BaseRequestOptions, ConnectionBackend, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {UserCardComponent} from './user-card.component';

import {user} from './user-card.component.mock';

import {ObjectUtil} from '../../core';

// Create a test component to test directives
@Component({
  template: `
  <prs-user-card [showButtons]="1" [user]="userTest"
  (onClick)="onClick($event)"
  (passEvent)="passEvent($event)"
  (acceptEvent)="acceptEvent($event)">
  Content
  </prs-user-card>
  `,
  directives: [UserCardComponent]
})
class TestComponent {
  userTest = user;
  onUserClicked(event) {

  }

  passEvent(event) {

  }

  acceptEvent(event) {

  }
}

describe('UserCard component', () => {

  beforeEachProviders(() => [
    BaseRequestOptions,
    MockBackend,
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
  ]);

  it('should exist', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(TestComponent).then((fixture: any) => {
      fixture.detectChanges();

      let elRef = fixture.debugElement.elementRef;

      expect(elRef).not.toBeNull(true);

    });
  })));


  it('should display user interests', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(TestComponent).then((fixture: any) => {
      fixture.detectChanges();

      let componentInstance = fixture.componentInstance,
        element = fixture.nativeElement;

      let interests = ObjectUtil.first(user.top_interests[0], 3);


      let interestsHeader = element.querySelector('h6').textContent.trim();
      let interestsLength = element.querySelectorAll('li.interest-list-match').length;
      expect(interestsHeader).toEqual('Interests');
      expect(interestsLength).toEqual(3);


      let interest0 = element.querySelectorAll('li')[0].textContent.trim();
      let interest1 = element.querySelectorAll('li')[1].textContent.trim();
      let interest2 = element.querySelectorAll('li')[2].textContent.trim();

      expect(interest0).toEqual('antiques');
      expect(interest1).toEqual('badminton');
      expect(interest2).toEqual('ballet');

    });
  })));


  it('should display user information', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(TestComponent).then((fixture: any) => {
      fixture.detectChanges();

      let componentInstance = fixture.componentInstance,
        element = fixture.nativeElement;

      let header = element.querySelector('h4.card-title').innerText;
      let subtitle = element.querySelector('p.card-subtitle').textContent.trim();

      expect(header).toBe(user.first_name);
      expect(subtitle).toEqual('Female / age 35 / 10 meters');
    });
  })));

});
