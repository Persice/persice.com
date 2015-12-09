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

// import {Component, View, provide} from 'angular2/angular2';

// import {UserCardComponent} from './usercard.component';

// import {user} from './usercard.component.mock';

// import {ObjectUtil} from '../../core/util';

// declare var dump: any;
// declare var jasmine: any;

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [UserCardComponent]
// })
// class TestComponent {
//   userTest = user;
//   onUserClicked(event) {

//   }
// }

// describe('UserCard component', () => {
//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<user-card [user]="userTest" (on-click)="onUserClicked($event)">Content</user-card>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let userCardInstance = fixture.debugElement.componentInstance;
//         let userCardDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);

//       });
//   }));

//   it('should display user image', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<user-card [user]="userTest" (on-click)="onUserClicked($event)">Content</user-card>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;


//         let image = 'url(http://localhost:9876' + user.image + ')';

//         let el = DOM.querySelectorAll(componentDOMEl, '.avatar-holder')[0];
//         let imageBackground = DOM.getStyle(el, 'background-image');

//         expect(imageBackground).toEqual(image);


//       });
//   }));

//   it('should display user interests', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<user-card [user]="userTest" (on-click)="onUserClicked($event)">Content</user-card>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         let interests = ObjectUtil.first(user.top_interests[0], 3);


//         expect(componentInstance.interests).toEqual(interests);
//         expect(DOM.querySelector(componentDOMEl, 'h6').textContent).toEqual('Interests');
//         expect(DOM.querySelectorAll(componentDOMEl, 'li').length).toEqual(3);
//         expect(DOM.querySelectorAll(componentDOMEl, 'li')[0].textContent.trim()).toEqual('antiques');
//         expect(DOM.querySelectorAll(componentDOMEl, 'li')[1].textContent.trim()).toEqual('badminton');
//         expect(DOM.querySelectorAll(componentDOMEl, 'li')[2].textContent.trim()).toEqual('ballet');

//       });
//   }));


//   it('should display user first name, age, gender and distance', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<user-card [user]="userTest" (on-click)="onUserClicked($event)">Content</user-card>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(DOM.querySelector(componentDOMEl, 'h4.card-title').textContent).toEqual(user.first_name);

//         expect(DOM.querySelector(componentDOMEl, 'p.card-subtitle').textContent.trim()).toEqual('female / age 35 / 10 meters');
//       });
//   }));

// });
