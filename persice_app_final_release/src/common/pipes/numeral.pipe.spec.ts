import { NumeralPipe } from './numeral.pipe';

describe('NumeralPipe', () => {
  let pipe: NumeralPipe;
  beforeEach(() => {
    pipe = new NumeralPipe();
  });
  it('transforms "10000" to "10,000"', () => {
    expect(pipe.transform(10000, [])).toEqual('10,000');
  });

});
