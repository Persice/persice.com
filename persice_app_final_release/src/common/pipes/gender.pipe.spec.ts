import { GenderPipe } from './gender.pipe.ts';

describe('GenderPipe', () => {
  let pipe: GenderPipe;
  beforeEach(() => {
    pipe = new GenderPipe();
  });
  it('transforms "m" to "Male"', () => {
    expect(pipe.transform('m', [])).toEqual('Male');
  });
  it('transforms "f" to "Female"', () => {
    expect(pipe.transform('f', [])).toEqual('Female');
  });

  it('doesn\'t transform random string to "Female" or "Male"', () => {
    let text = Math.random().toString(36).substring(7);
    expect(pipe.transform(text, [])).toEqual('');
  });

});
