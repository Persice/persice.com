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

// import {LoadingComponent} from './loading.component';

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [LoadingComponent]
// })
// class TestComponent {
//   testStatus = false;
// }

// describe('Loading component', () => {


//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><loading [status]="testStatus"></loading><div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();
//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);


//       });
//   }));

//   it('should by default be hidden', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><loading [status]="testStatus"></loading></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();
//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(componentInstance.status).toEqual(false);


//       });
//   }));



//   it('should change status', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><loading [status]="testStatus"></loading></div>')
//       .createAsync(TestComponent).then((fixture: any) => {

//         fixture.detectChanges();
//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         fixture.debugElement.componentInstance.testStatus = true;
//         fixture.detectChanges();
//         expect(componentInstance.status).toEqual(true);

//         fixture.debugElement.componentInstance.testStatus = false;
//         fixture.detectChanges();
//         expect(componentInstance.status).toEqual(false);

//       });
//   }));

// });
