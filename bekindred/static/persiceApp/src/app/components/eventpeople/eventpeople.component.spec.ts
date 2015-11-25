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

import {EventPeopleComponent} from './eventpeople.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [EventPeopleComponent]
})
class TestComponent {

}

describe('EventPeople component', () => {


  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><event-people></event-people><div>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();
        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);


      });
  }));

});
