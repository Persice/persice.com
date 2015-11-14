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

import {CrowdComponent} from './crowd.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [CrowdComponent]
})
class TestComponent {
}

describe('Crowd component', () => {
  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(TestComponent).then((fixture: any) => {

        let compiled = fixture.debugElement.nativeElement;

        fixture.detectChanges();
        expect(true).toBe(true);


      });
  }));

});
