// import {
//   expect,
//   it,
//   describe,
//   injectAsync,
//   TestComponentBuilder,
//   beforeEachProviders
// } from 'angular2/testing';

// import {Component, provide} from 'angular2/core';
// import {BaseRequestOptions, ConnectionBackend, Http, Response,
//   ResponseOptions, HTTP_BINDINGS
// } from 'angular2/http';

// import {RequestMethod} from 'angular2/src/http/enums';

// import {MockBackend} from 'angular2/http/testing';


// import {ConnectionsComponent} from './connections.component';

// import {ConnectionsService} from '../shared/services';
// import {FilterService} from '../shared/services';

// // Create a test component to test directives
// @Component({
//   template: '',
//   directives: [ConnectionsComponent]
// })
// class TestComponent {
// }


// class MockFilterService extends FilterService {

// }



// class MockConnectionsService extends ConnectionsService {

// }

// describe('Connections component', () => {

//   beforeEachProviders(() => [
//     provide(FilterService, { useClass: MockFilterService }),
//     provide(ConnectionsService, { useClass: MockConnectionsService }),
//     BaseRequestOptions,
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


//   it('should exist', injectAsync(
//     [TestComponentBuilder], (tcb) => {
//       return tcb.overrideTemplate(TestComponent, '<div><div>')
//         .createAsync(TestComponent).then((fixture) => {
//           fixture.detectChanges();
//           let componentDOMEl = fixture.debugElement.nativeElement;
//           let elRef = fixture.debugElement.elementRef;
//           expect(elRef).not.toBeNull(true);
//         });
//     }
//   ));


// });
