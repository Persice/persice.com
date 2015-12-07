// /// <reference path="../../../typings/_custom.d.ts" />

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


// import {Component, View, provide, DirectiveResolver} from 'angular2/angular2';
// import {Location, Router, RouteRegistry, RouterLink} from 'angular2/router';
// import {SpyLocation} from 'angular2/src/mock/location_mock';
// import {RootRouter} from 'angular2/src/router/router';
// import {DOM} from 'angular2/src/platform/dom/dom_adapter';

// import {AppComponent} from '../app.component';

// import {EventsListComponent} from './eventslist.component';

// import {events} from './eventslist.component.mock';

// declare var dump: any;
// declare var jasmine: any;


// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [EventsListComponent]
// })
// class TestComponent {
//   items = events;
//   setSelected(event) {

//   }
// }

// describe('EventsList component', () => {


//   beforeEachProviders(() => [
//     RouterLink,
//     RouteRegistry,
//     DirectiveResolver,
//     provide(Location, { useClass: SpyLocation }),
//     provide(Router,
//       {
//         useFactory:
//         (registry, location) => { return new RootRouter(registry, location, AppComponent); },
//         deps: [RouteRegistry, Location]
//       })

//   ]);



//   it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><events-list [events]="items" (on-clicked)="setSelected($event)"></events-list></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);

//       });
//   }));

//   it('should display list of events', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><events-list [events]="items" (on-clicked)="setSelected($event)"></events-list></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;


//         let eventsLength = events.length;

//         expect(DOM.querySelectorAll(componentDOMEl, '.card--event').length).toEqual(eventsLength);


//       });
//   }));

// });
