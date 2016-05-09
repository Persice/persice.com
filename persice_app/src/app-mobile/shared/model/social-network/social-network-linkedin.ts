import {SocialNetwork} from "./social-network";
export class SocialNetworkLinkedin extends SocialNetwork {

  private networkName: string = 'linkedin';

  constructor(id: string) {
    super();
    this.name = this.networkName;
    this.url = id && id !== null ? id : '';
  }
}
