import { SocialNetwork } from './social-network';
export class SocialNetworkFacebook extends SocialNetwork {

  private networkName: string = 'facebook';

  constructor(id: string) {
    super();
    this.name = this.networkName;
    this.id = id;
    this.url = `https://www.facebook.com/app_scoped_user_id/${id}`;
  }
}
