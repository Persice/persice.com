import { inject, async, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { UsersListComponent } from './users-list.component';
import { users } from './users-list.component.mock';

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

  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      {
        provide: Http,
        useFactory: (
          connectionBackend: ConnectionBackend,
          defaultOptions: BaseRequestOptions
        ) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      },
    ]);
  });

  it('should exist', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-users-list [users]="items" (onClicked)="setSelectedUser($event)"></prs-users-list>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();
        let elRef = fixture.debugElement.elementRef;
        expect(elRef).not.toBeNull(true);
      });
  })));

  it('should display list of users', async(inject([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<prs-users-list [users]="items" (onClicked)="setSelectedUser($event)"></prs-users-list>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let element = fixture.nativeElement;

        let usersLength = users.length;
        expect(element.querySelectorAll('.card--user').length).toEqual(usersLength);

      });
  })));

});
