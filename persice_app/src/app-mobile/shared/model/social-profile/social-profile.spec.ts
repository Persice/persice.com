import {SocialProfile} from './social-profile';
import {SocialProfileGenerator} from './social-profile-generator';

describe('Social Profile', () => {
  it('instantiates facebook profile from dto', () => {
    // given
    let dto: any = SocialProfileGenerator.givenSocialProfileDto('facebook');

    // when
    let profile: SocialProfile = new SocialProfile(dto);

    // then
    expect(profile.name).toEqual(dto.first_name);
    expect(profile.image).toEqual(`//graph.facebook.com/${dto.facebook_id}/picture?type=square`);
    expect(profile.url).toEqual(`https://www.facebook.com/app_scoped_user_id/${dto.facebook_id}`);
  });

  it('instantiates twitter profile from dto', () => {
    // given
    let dto: any = SocialProfileGenerator.givenSocialProfileDto('twitter');

    // when
    let profile: SocialProfile = new SocialProfile(dto);

    // then
    expect(profile.name).toEqual(dto.first_name);
    expect(profile.image).toEqual(dto.image);
    expect(profile.url).toEqual(`https://twitter.com/${dto.username}`);
  });

  it('instantiates linkedin profile from dto', () => {
    // given
    let dto: any = SocialProfileGenerator.givenSocialProfileDto('linkedin');

    // when
    let profile: SocialProfile = new SocialProfile(dto);

    // then
    expect(profile.name).toEqual(dto.first_name);
    expect(profile.image).toEqual(dto.image);
    expect(profile.url).toEqual(dto.linkedin_provider);
  });
});
