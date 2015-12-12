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

// import {EventDescriptionComponent} from './eventdescription.component';

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [EventDescriptionComponent]
// })
// class TestComponent {
//   description = 'Test event description';
// }

// describe('Single Event component', () => {


//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><event-description [description]="description"></event-description><div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();
//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);


//       });
//   }));

// });
