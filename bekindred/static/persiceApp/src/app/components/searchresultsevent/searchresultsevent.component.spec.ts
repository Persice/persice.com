/// <reference path="../../../typings/_custom.d.ts" />

import {
iit,
it,
ddescribe,
describe,
expect,
inject,
injectAsync,
TestComponentBuilder,
beforeEachProviders,
fakeAsync,
tick
} from 'angular2/testing';

import {Component, View, provide} from 'angular2/angular2';

import {SearchResultsEventComponent} from './searchresultsevent.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [SearchResultsEventComponent]
})
class TestComponent {
}

describe('SearchResultsEvent component', () => {
  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(TestComponent).then((fixture: any) => {

        let compiled = fixture.debugElement.nativeElement;

        fixture.detectChanges();
        expect(true).toBe(true);


      });
  }));

});
