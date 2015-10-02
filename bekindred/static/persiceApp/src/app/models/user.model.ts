
interface InterfaceAuthUser {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  facebook_id: string;
}

export class AuthUserModel {
  info: InterfaceAuthUser;
  constructor(
    info: InterfaceAuthUser
   ) {
      this.info = info;
  }
}
