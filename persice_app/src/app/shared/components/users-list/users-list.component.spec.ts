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

import {Component, provide} from 'angular2/core';

import {UsersListComponent} from './users-list.component';

import {users} from './users-list.component.mock';

declare var dump: any;
declare var jasmine: any;


// Create a test component to test directives
@Component({
  template: '',
  directives: [UsersListComponent]
})
class TestComponent {
  items = users;
  setSelectedUser(event) {

  }
}

describe('UsersList component', () => {
  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-users-list [users]="items" (onClicked)="setSelectedUser($event)"></prs-users-list>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();
        let userCardInstance = fixture.debugElement.componentInstance;
        let userCardDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);

      });
  }));

  it('should display list of users', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-users-list [users]="items" (onClicked)="setSelectedUser($event)"></prs-users-list>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let componentInstance = fixture.componentInstance,
          element = fixture.nativeElement;

        let usersLength = users.length;
        expect(element.querySelectorAll('.card--user').length).toEqual(usersLength);

      });
  }));

});
