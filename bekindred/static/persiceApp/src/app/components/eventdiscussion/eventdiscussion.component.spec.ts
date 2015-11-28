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

import {EventDiscussionComponent} from './eventdiscussion.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [EventDiscussionComponent]
})
class TestComponent {

}

describe('EventDiscussion component', () => {


  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><event-discussion></event-discussion><div>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();
        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);


      });
  }));

});
