
import {SocialNetworkLinkedin} from "./social-network-linkedin";
describe('Linkedin', () => {

  it('instantiates with valid data', () => {
    // given
    let userId: string = 'alice';

    // when
    let network: SocialNetworkLinkedin = new SocialNetworkLinkedin(userId);

    // then
    expect(network.name).toEqual('linkedin');
    expect(network.url).toEqual('alice');
  });

  it('URL empty when invalid data', () => {
    // given
    let userId: string = '';

    // when
    let network: SocialNetworkLinkedin = new SocialNetworkLinkedin(userId);

    // then
    expect(network.url).toEqual('');
  });
});
