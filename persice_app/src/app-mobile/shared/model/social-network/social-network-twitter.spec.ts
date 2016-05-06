
import {SocialNetworkTwitter} from "./social-network-twitter";
describe('Twitter', () => {

  it('instantiates with valid data', () => {
    // given
    let userId: string = 'alice';

    // when
    let network: SocialNetworkTwitter = new SocialNetworkTwitter(userId);

    // then
    expect(network.name).toEqual('twitter');
    expect(network.url).toEqual('https://twitter.com/alice');
  });

  it('URL empty when invalid data', () => {
    // given
    let userId: string = '';

    // when
    let network: SocialNetworkTwitter = new SocialNetworkTwitter(userId);

    // then
    expect(network.name).toEqual('twitter');
    expect(network.url).toEqual('');
  });
});
