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

// import {Component, View, provide} from 'angular2/angular2';

// import {EventHostComponent} from './eventhost.component';

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [EventHostComponent]
// })
// class TestComponent {
//   userInfo = {
//     name: 'Sasa',
//     description: 'desc',
//     distance: '10 miles',
//     gender: 'Male',
//     age: '20',
//     image: '/media/images/avatar_user_f.jpg'
//   };
// }

// describe('EventHost component', () => {


//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><event-host [host]="userInfo"></event-host><div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();
//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);


//       });
//   }));

// });
