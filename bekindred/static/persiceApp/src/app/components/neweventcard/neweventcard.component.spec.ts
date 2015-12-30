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

// import {NewEventCardComponent} from './neweventcard.component';


// declare var dump: any;
// declare var jasmine: any;

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [NewEventCardComponent]
// })
// class TestComponent {
//   onNewEventClicked(event) {

//   }
// }

// describe('NewEventCard component', () => {
//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><newevent-card (on-click)="onNewEventClicked($event)"></newevent-card></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let userCardInstance = fixture.debugElement.componentInstance;
//         let userCardDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);

//       });
//   }));

//   it('should display add new event', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><newevent-card (on-click)="onNewEventClicked($event)"></newevent-card></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;



//         let elHeader = DOM.querySelector(componentDOMEl, 'h4.card-title');

//         expect(elHeader.textContent).toEqual('New event');

//         let elSubtitle = DOM.querySelector(componentDOMEl, 'p.card-subtitle');

//         expect(elSubtitle.textContent).toEqual('Add new event and invite your connections');


//       });
//   }));


// });
