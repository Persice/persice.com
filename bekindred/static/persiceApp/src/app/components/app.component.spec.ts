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
} from 'angular2/testing';

import {Component} from 'angular2/core';



import {AppComponent} from './app.component';



// Create a test component to test directives
@Component({
  selector: 'test-cmp',
  template: '<div>Original Child</div>'
})
class ChildCmp {
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
