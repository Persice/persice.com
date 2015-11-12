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

  it('doesn\'t transform random string to "female" or "male"', () => {
    let text = Math.random().toString(36).substring(7);
    expect(pipe.transform(text, [])).toEqual(text);
  });

});
