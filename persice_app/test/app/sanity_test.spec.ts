import {
describe,
expect,
injectAsync,
it
} from 'angular2/testing';

describe('Universal truths', () => {


  it('should be able to test', () => {
    expect(true).toBe(true);
  });

  it('should do math', () => {
    expect(1 + 1).toBe(2); // Almost passing test
  });

  it('null is not the same thing as undefined',
    () => expect(null).not.toEqual(undefined)
  );

  xit('should skip this', () => {
    expect(4).toEqual(40);
  });

});
