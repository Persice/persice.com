import { SocialNetworkFacebook } from './social-network-facebook';
describe('Facebook', () => {

  it('instantiates with valid data', () => {
    // given
    let userId: string = 'alice';

    // when
    let network: SocialNetworkFacebook = new SocialNetworkFacebook(userId);

    // then
    expect(network.name).toEqual('facebook');
    expect(network.id).toEqual('alice');
    expect(network.url).toEqual('https://www.facebook.com/app_scoped_user_id/alice');
  });
});
