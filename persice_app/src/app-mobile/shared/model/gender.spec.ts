import { Gender } from './gender';

describe('Gender', () => {

  it('instantiates', () => {
    expect(new Gender('m').value).toEqual('Male');
    expect(new Gender('f').value).toEqual('Female');
    expect(new Gender('M').value).toEqual('');
    expect(new Gender('F').value).toEqual('');
    expect(new Gender('error').value).toEqual('');

    expect(new Gender('m').shortCode).toEqual('m');
    expect(new Gender('f').shortCode).toEqual('f');
    expect(new Gender('M').shortCode).toEqual('M');
    expect(new Gender('F').shortCode).toEqual('F');
    expect(new Gender('error').shortCode).toEqual('error');
  });

  it('determines gender', () => {
    expect(Gender.parseGender('m')).toEqual('Male');
    expect(Gender.parseGender('f')).toEqual('Female');
    expect(Gender.parseGender('M')).toEqual('');
    expect(Gender.parseGender('F')).toEqual('');
    expect(Gender.parseGender('error')).toEqual('');
  });
});
