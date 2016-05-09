import {SocialNetwork} from "./social-network";
export class SocialNetworkTwitter extends SocialNetwork {

  private networkName: string = 'twitter';

  constructor(id: string) {
    super();
    this.name = this.networkName;
    this.url = id && id !== null ? `https://twitter.com/${id}` : '';
  }
}
