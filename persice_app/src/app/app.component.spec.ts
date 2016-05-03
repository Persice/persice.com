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
  beforeEachProviders
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component, OnInit} from '@angular/core';

import {AppComponent} from './app.component';

// Create a test component to test directives
@Component({
  selector: 'prs-test-cmp',
  template: '<div>Original Child</div>'
})
class ChildCmp implements OnInit {
  ngOnInit() {
    console.log('hello Home component');
  }
}

describe('App component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    ChildCmp
  ]);

  it('should log ngOnInit', inject([ChildCmp], (app) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    app.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
