import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  beforeEachProviders,
  beforeEach,
  fakeAsync,
  tick
} from '@angular/core/testing';

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
