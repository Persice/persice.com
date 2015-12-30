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

import {Component} from 'angular2/core';



import {AppComponent} from './app.component';



// Create a test component to test directives
@Component({
  selector: 'test-cmp',
  template: '<div>Original Child</div>'
})
class ChildCmp {
}


describe('App component', () => {
  it('should instantiate a component with valid DOM',
    inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {

      tcb.createAsync(ChildCmp).then((componentFixture) => {
        componentFixture.detectChanges();
        expect(componentFixture.debugElement.nativeElement).toHaveText('Original Child');
        async.done();
      });
    }));

});


