/// <reference path="../../../typings_custom/_custom.d.ts" />

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

import {NumeralPipe} from './numeral.pipe';

describe('NumeralPipe', () => {
  let pipe: NumeralPipe;
  beforeEach(() => {
    pipe = new NumeralPipe();
  });
  it('transforms "10000" to "10,000"', () => {
    expect(pipe.transform(10000, [])).toEqual('10,000');
  });

});
