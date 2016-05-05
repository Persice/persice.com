import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';

import {Component, OnInit} from '@angular/core';

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
