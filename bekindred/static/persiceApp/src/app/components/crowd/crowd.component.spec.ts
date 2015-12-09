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

// import {Component, View, provide, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
// import {BaseRequestOptions, ConnectionBackend, Http, Response,
// ResponseOptions, HTTP_BINDINGS
// } from 'angular2/http';

// import {RequestMethod} from 'angular2/src/http/enums';

// import {MockBackend} from 'angular2/http/testing';


// import {CrowdComponent} from './crowd.component';

// import {CrowdService} from '../../services/crowd.service';
// import {FriendService} from '../../services/friend.service';
// import {FilterService} from '../../services/filter.service';

// // Create a test component to test directives
// @Component({
//   template: '',
//   viewBindings: [HTTP_BINDINGS],
//   directives: [CrowdComponent, CORE_DIRECTIVES, FORM_DIRECTIVES]
// })
// class TestComponent {
// }


// class MockFilterService extends FilterService {

// }


// class MockFriendService extends FriendService {

// }


// class MockCrowdService extends CrowdService {

// }

// describe('Crowd component', () => {

//   beforeEachProviders(() => [
//     provide(FilterService, {useClass: MockFilterService}),
//     provide(CrowdService, {useClass: MockCrowdService}),
//     provide(FriendService, {useClass: MockFriendService}),
//     BaseRequestOptions,
//     CORE_DIRECTIVES,
//     MockBackend,
//     provide(Http, {
//       useFactory: (connectionBackend: ConnectionBackend,
//         defaultOptions: BaseRequestOptions) => {
//         return new Http(connectionBackend, defaultOptions);
//       },
//       deps: [
//         MockBackend,
//         BaseRequestOptions
//       ]
//     }),
//   ]);


//   it('should exist', inject([TestComponentBuilder, AsyncTestCompleter], (tcb, async) => {
//     tcb.overrideTemplate(TestComponent, '<div><div>')
//       .createAsync(TestComponent).then((fixture: any) => {

//         fixture.detectChanges();
//         // let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
//         let componentDOMEl = fixture.debugElement.nativeElement;
//         let elRef = fixture.debugElement.elementRef;

//         expect(elRef).not.toBeNull(true);
//         async.done();

//       });
//   }));

// });
