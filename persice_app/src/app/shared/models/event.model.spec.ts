import {EventModel} from "./event.model";
import {NumberGenerators} from "../generators/number-generators";
import {StringGenerators} from "../generators/string-generators";
import {DateGenerators} from "../generators/date-generators";
import {max} from "rxjs/operator/max";

describe('Event model', () => {

  it('instantiates', () => {
    // given
    let name: string = StringGenerators.givenAnyString();
    let description: string = StringGenerators.givenAnyString();
    let access_level: string = StringGenerators.givenAnyString();
    let starts_on: string = DateGenerators.givenAnyDate().toDateString();
    let ends_on: string = DateGenerators.givenAnyDate().toDateString();
    let repeat: string = StringGenerators.givenAnyString();
    let event_photo: string = StringGenerators.givenAnyString();
    let street: string = StringGenerators.givenAnyString();
    let city: string = StringGenerators.givenAnyString();
    let zipcode: string = StringGenerators.givenAnyString();
    let state: string = StringGenerators.givenAnyString();
    let full_address: string = StringGenerators.givenAnyString();
    let location_name: string = StringGenerators.givenAnyString();
    let country: string = StringGenerators.givenAnyString();
    let address: string = StringGenerators.givenAnyString();
    let location: string = StringGenerators.givenAnyString();
    let starts_on_date: string = StringGenerators.givenAnyString();
    let starts_on_time: string = StringGenerators.givenAnyString();
    let ends_on_date: string = StringGenerators.givenAnyString();
    let ends_on_time: string = StringGenerators.givenAnyString();
    let max_attendees: number = NumberGenerators.givenAnyNumber();

    // when
    let model: EventModel = new EventModel(
      name, description, access_level, starts_on, ends_on, repeat, event_photo, street, city,
      zipcode, state, full_address, location_name, country, address, location, starts_on_date,
      starts_on_time, ends_on_date, ends_on_time, max_attendees);

    // then
    expect(model.name).toEqual(name);
    expect(model.description).toEqual(description);
    expect(model.access_level).toEqual(access_level);
    expect(model.starts_on).toEqual(starts_on);
    expect(model.ends_on).toEqual(ends_on);
    expect(model.repeat).toEqual(repeat);
    expect(model.event_photo).toEqual(event_photo);
    expect(model.street).toEqual(street);
    expect(model.city).toEqual(city);
    expect(model.zipcode).toEqual(zipcode);
    expect(model.state).toEqual(state);
    expect(model.full_address).toEqual(full_address);
    expect(model.location_name).toEqual(location_name);
    expect(model.country).toEqual(country);
    expect(model.address).toEqual(address);
    expect(model.location).toEqual(location);
    expect(model.starts_on_date).toEqual(starts_on_date);
    expect(model.starts_on_time).toEqual(starts_on_time);
    expect(model.max_attendees).toEqual(max_attendees);
  });
});
