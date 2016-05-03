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

import {UsersListComponent} from './users-list.component';

import {users} from './users-list.component.mock';

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
  it('should exist', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-users-list [users]="items" (onClicked)="setSelectedUser($event)"></prs-users-list>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();
        let userCardInstance = fixture.debugElement.componentInstance;
        let userCardDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);

      });
  })));

  it('should display list of users', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-users-list [users]="items" (onClicked)="setSelectedUser($event)"></prs-users-list>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let componentInstance = fixture.componentInstance,
          element = fixture.nativeElement;

        let usersLength = users.length;
        expect(element.querySelectorAll('.card--user').length).toEqual(usersLength);

      });
  })));

});
