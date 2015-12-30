// import {
// iit,
// it,
// ddescribe,
// describe,
// expect,
// inject,
// injectAsync,
// TestComponentBuilder,
// beforeEachProviders,
// fakeAsync,
// tick
// } from 'angular2/testing';

// import {DOM} from 'angular2/src/platform/dom/dom_adapter';

// import {Component, View, provide} from 'angular2/core';

// import {UsersListComponent} from './userslist.component';

// import {users} from './userslist.component.mock';

// declare var dump: any;
// declare var jasmine: any;


// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [UsersListComponent]
// })
// class TestComponent {
//   items = users;
//   setSelectedUser(event) {

//   }
// }

// describe('UsersList component', () => {
//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<users-list [users]="items" (on-clicked)="setSelectedUser($event)"></users-list>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);

//       });
//   }));

//   it('should display list of users', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<users-list [users]="items" (on-clicked)="setSelectedUser($event)"></users-list>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;


//         let usersLength = users.length;

//         expect(DOM.querySelectorAll(componentDOMEl, '.card--user').length).toEqual(usersLength);


//       });
//   }));

// });
