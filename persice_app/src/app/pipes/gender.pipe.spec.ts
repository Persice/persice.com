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
beforeEach,
fakeAsync,
tick
} from 'angular2/testing';

import {GenderPipe} from './gender.pipe';

describe('GenderPipe', () => {
  let pipe: GenderPipe;
  beforeEach(() => {
    pipe = new GenderPipe();
  });
  it('transforms "m" to "male"', () => {
    expect(pipe.transform('m', [])).toEqual('Male');
  });
  it('transforms "f" to "female"', () => {
    expect(pipe.transform('f', [])).toEqual('Female');
  });

  it('doesn\'t transform random string to "Female" or "Male"', () => {
    let text = Math.random().toString(36).substring(7);
    expect(pipe.transform(text, [])).toEqual(text);
  });

});
