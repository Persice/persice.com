// import {
// it,
// iit,
// xit,
// describe,
// ddescribe,
// xdescribe,
// expect,
// tick,
// beforeEach,
// inject,
// beforeEachProviders,
// TestComponentBuilder,
// AsyncTestCompleter
// } from 'angular2/testing_internal';

// import {Component, View, provide, DirectiveResolver} from 'angular2/angular2';
// import {Location, Router, RouteRegistry, RouterLink} from 'angular2/router';
// import {SpyLocation} from 'angular2/src/mock/location_mock';
// import {RootRouter} from 'angular2/src/router/router';
// import {DOM} from 'angular2/src/platform/dom/dom_adapter';

// import {EventCardComponent} from './eventcard.component';
// import {AppComponent} from '../app.component';

// import {event} from './eventcard.component.mock';

// import {ObjectUtil, DateUtil} from '../../core/util';


// declare var dump: any;
// declare var jasmine: any;

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [EventCardComponent]
// })
// class TestComponent {
//   eventTest = event;
//   onUserClicked(event) {

//   }
// }

// describe('EventCard component', () => {

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


//   it('should exist', inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
//     return tcb.overrideTemplate(TestComponent, '<div><event-card [event]="eventTest"></event-card></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let eventCardInstance = fixture.debugElement.componentInstance;
//         let eventCardDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);

//       });
//   }));

//   it('should display event image', inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
//     return tcb.overrideTemplate(TestComponent, '<div><event-card [event]="eventTest"></event-card></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;


//         let image = 'url(http://localhost:9876' + event.event_photo + ')';

//         let el = DOM.querySelectorAll(componentDOMEl, '.card--event__img__holder')[0];
//         let imageBackground = DOM.getStyle(el, 'background-image');

//         expect(imageBackground).toEqual(image);


//       });
//   }));


//   it('should display event name, date, location, distance, score and attendees', inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
//     return tcb.overrideTemplate(TestComponent, '<div><event-card [event]="eventTest"></event-card></div>')
//       .createAsync(TestComponent).then((fixture: any) => {
//         fixture.detectChanges();

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         let date = DateUtil.format(event.starts_on, 'ddd, D MMM YYYY');

//         expect(DOM.querySelector(componentDOMEl, 'h4.card-title').textContent).toEqual(event.name);

//         expect(DOM.querySelector(componentDOMEl, 'p.card-subtitle').textContent.trim()).toEqual('Central Park / New York');
//         expect(DOM.querySelector(componentDOMEl, '.eventdate').textContent.trim()).toEqual(date);
//         expect(DOM.querySelector(componentDOMEl, '.eventdistance').textContent.trim()).toEqual('6,898 km');
//         expect(DOM.querySelector(componentDOMEl, '.eventscore').textContent.trim()).toEqual('20 Similar');
//         expect(DOM.querySelector(componentDOMEl, '.eventattendees').textContent.trim()).toEqual('10 Connections');
//       });
//   }));

// });
