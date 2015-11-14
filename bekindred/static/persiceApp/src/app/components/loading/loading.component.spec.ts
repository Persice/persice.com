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

import {LoadingComponent} from './loading.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [LoadingComponent]
})
class TestComponent {
}

describe('Loading component', () => {
  it('should change status', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(LoadingComponent).then((fixture: any) => {

        let compiled = fixture.debugElement.nativeElement;
        let status = fixture.debugElement.componentInstance.status;

        fixture.detectChanges();
        expect(status).toBe(false);

        fixture.debugElement.componentInstance.status = true;
        status = fixture.debugElement.componentInstance.status;
        fixture.detectChanges();
        expect(status).toBe(true);
      });
  }));

});
