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

// import {Component, View, provide, DirectiveResolver} from 'angular2/core';
// import {Location, Router, RouteRegistry, RouterLink} from 'angular2/router';
// import {SpyLocation} from 'angular2/src/mock/location_mock';
// import {RootRouter} from 'angular2/src/router/router';
// import {DOM} from 'angular2/src/platform/dom/dom_adapter';

// import {NavMainComponent} from './navmain.component';
// import {AppComponent} from '../app.component';

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [NavMainComponent]
// })
// class TestComponent {
// }

// describe('NavMain component', () => {

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
//     return tcb.overrideTemplate(TestComponent, '<div><nav-main></nav-main></div>')
//       .createAsync(TestComponent).then((fixture: any) => {

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);


//       });
//   }));


//   it('should have links', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.overrideTemplate(TestComponent, '<div><nav-main></nav-main></div>')
//       .createAsync(TestComponent).then((fixture: any) => {

//         let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;


//         let links = DOM.querySelectorAll(componentDOMEl, 'li');

//         expect(links.length).toEqual(4);
//         expect(links[0].textContent.trim()).toEqual('Crowd');
//         expect(links[1].textContent.trim()).toEqual('Messages');
//         expect(links[2].textContent.trim()).toEqual('Connections');
//         expect(links[3].textContent.trim()).toEqual('Events');



//       });
//   }));

// });
