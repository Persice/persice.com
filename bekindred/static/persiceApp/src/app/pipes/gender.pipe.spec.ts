/// <reference path="../../../src/typings/_custom.d.ts" />

import {GenderPipe} from './gender.pipe';

describe('GenderPipe', () => {
  let pipe: GenderPipe;
  beforeEach(() => {
    pipe = new GenderPipe();
  });
  it('transforms "m" to "male"', () => {
    expect(pipe.transform('m', [])).toEqual('male');
  });
  it('transforms "f" to "female"', () => {
    expect(pipe.transform('f', [])).toEqual('female');
  });
});
