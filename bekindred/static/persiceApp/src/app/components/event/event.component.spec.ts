/// <reference path="../../../typings/_custom.d.ts" />

import {
  it,
  iit,
  xit,
  describe,
  ddescribe,
  xdescribe,
  expect,
  tick,
  beforeEach,
  inject,
  beforeEachProviders,
  TestComponentBuilder,
  AsyncTestCompleter
} from 'angular2/testing_internal';

import {Component, View, provide} from 'angular2/angular2';

import {EventComponent} from './event.component';

import {EventService} from '../../services/event.service';
// Create a test component to test directives
@Component({
  template: '<div>Original Child</div>',
  directives: [EventComponent]
})
class ChildCmp {

}

describe('Event component', () => {


  it('should instantiate a component with valid DOM',
    inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {

      tcb.createAsync(ChildCmp).then((componentFixture) => {
        componentFixture.detectChanges();
        expect(componentFixture.debugElement.nativeElement).toHaveText('Original Child');
        async.done();
      });
    }));

});
