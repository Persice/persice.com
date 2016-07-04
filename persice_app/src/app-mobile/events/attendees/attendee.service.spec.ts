import {addProviders} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {Http, ConnectionBackend, BaseRequestOptions} from '@angular/http';
import {AttendeeService} from './attendee.service';


describe('Attendee service', () => {

  let service: AttendeeService;

  beforeEach(() => {
    addProviders([
      MockBackend,
      BaseRequestOptions,
      AttendeeService,
      {
        provide: Http,
        useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          let http = new Http(backend, defaultOptions);
          console.log(http);
          return http;
        },
        deps: [MockBackend, BaseRequestOptions]
      }
    ]);
  });

  xit('Should initialize', (done: Function) => {
    expect(service).toBeDefined();
    done();
  });
});
