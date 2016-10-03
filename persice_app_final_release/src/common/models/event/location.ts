export class Location {

  public street: string;
  public zipcode: string;
  public state: string;
  public address: string;
  public full_address: string;
  public city: string;
  public country: string;
  public location: string;
  public location_name: string;
  public event_location: string;

  constructor() { }

  public static fromDto(dto: any): Location {
    let location: Location = new Location();

    location.street = dto.street;
    location.zipcode = dto.zipcode;
    location.state = dto.state;
    location.address = dto.address;
    location.full_address = dto.full_address;
    location.city = dto.city;
    location.country = dto.country;
    location.location = dto.location;
    location.location_name = dto.location_name;
    location.event_location = dto.event_location;

    return location;
  }
}
