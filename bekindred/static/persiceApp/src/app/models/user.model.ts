
export class AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  facebook_id: string;
  constructor(
    id: number,
    first_name: string,
    last_name: string,
    image: string,
    facebook_id: string
   ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.image = image;
    this.facebook_id = facebook_id;
  }
}
