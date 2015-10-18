/// <reference path="../../src/typings/_custom.d.ts" />

describe('App', () => {


  it('should be able to test', () => {
    expect(true).toBe(true);
  });

  it('null is not the same thing as undefined',
    () => expect(null).not.toEqual(undefined)
  );

});