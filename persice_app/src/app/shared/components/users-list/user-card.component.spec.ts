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
  fakeAsync,
  tick
} from 'angular2/testing';

import {DOM} from 'angular2/src/platform/dom/dom_adapter';

import {Component, provide} from 'angular2/core';

import {UserCardComponent} from './user-card.component';

import {user} from './user-card.component.mock';

import {ObjectUtil} from '../../core';


// Create a test component to test directives
@Component({
  template: '',
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
  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<user-card [user]="userTest" (on-click)="onUserClicked($event)">Content</user-card>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let userCardInstance = fixture.debugElement.componentInstance;
        let userCardDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);

      });
  }));

  // it('should display user image', injectAsync([TestComponentBuilder], (tcb) => {
  //   return tcb.overrideTemplate(TestComponent, '<prs-user-card [user]="userTest" (on-click)="onUserClicked($event)">Content</prs-user-card>')
  //     .createAsync(TestComponent).then((fixture: any) => {
  //       fixture.detectChanges();

  //       // let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
  //       let componentDOMEl = fixture.debugElement.nativeElement;
  //       let elRef = fixture.debugElement.elementRef;


  //       let image = 'url(http://localhost:9876' + user.image + ')';

  //       let el = DOM.querySelector(componentDOMEl, '.avatar-holder');
  //       let imageBackground = DOM.getStyle(el, 'background-image');

  //       expect(imageBackground).toEqual(image);


  //     });
  // }));

  it('should display user interests', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-user-card [showButtons]="1" [user]="userTest" (onClick)="onClick($event)" (passEvent)="passEvent($event)" (acceptEvent)="acceptEvent($event)">Content</prs-user-card>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let componentInstance = fixture.componentInstance,
          element = fixture.nativeElement;

        let interests = ObjectUtil.first(user.top_interests[0], 3);


        // expect(componentInstance.interests).toEqual(interests);
        expect(element.querySelector('h6').textContent.trim()).toEqual('Interests');
        expect(element.querySelectorAll('li.interest-list-match').length).toEqual(3);

        expect(element.querySelectorAll('li')[0].textContent.trim()).toEqual('antiques');
        expect(element.querySelectorAll('li')[1].textContent.trim()).toEqual('badminton');
        expect(element.querySelectorAll('li')[2].textContent.trim()).toEqual('ballet');

      });
  }));


  it('should display user first name, age, gender and distance', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-user-card [showButtons]="1" [user]="userTest" (onClick)="onClick($event)" (passEvent)="passEvent($event)" (acceptEvent)="acceptEvent($event)">Content</prs-user-card>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let componentInstance = fixture.componentInstance,
          element = fixture.nativeElement;

        expect(element.querySelector('h4.card-title').innerText).toBe(user.first_name);
        expect(element.querySelector('p.card-subtitle').textContent.trim()).toEqual('Female / age 35 / 10 meters');
      });
  }));

});
