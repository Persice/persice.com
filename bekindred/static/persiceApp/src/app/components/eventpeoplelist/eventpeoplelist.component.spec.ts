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

// import {Component, View, provide} from 'angular2/core';

// import {EventPeopleListComponent} from './eventpeoplelist.component';

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [EventPeopleListComponent]
// })
// class TestComponent {

// }

// describe('EventPeopleList component', () => {


//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><event-peoplelist></event-peoplelist><div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();
//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);


//       });
//   }));

// });
