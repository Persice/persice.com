import {PersonGenerator} from "./person-generator";
import {Person} from "./person";

describe('Person', () => {

  it('instantiates from dto', () => {
    // given
    let dto: any = PersonGenerator.givenAnyPersonDto();

    // when
    let person: Person = new Person(dto);

    // then
    expect(person.id).toEqual(dto.id);
    expect(person.firstName).toEqual(dto.first_name);
    expect(person.lastName).toEqual(dto.last_name);
    expect(person.gender).toEqual(dto.gender === 'm' ? 'Male' : 'Female');
    expect(person.score).toEqual(dto.score);
    expect(person.age).toEqual(dto.age);
    expect(person.distance).toEqual(dto.distance[0]);
    expect(person.distanceUnit).toEqual(dto.distance[1]);
    expect(person.topInterests.length).toBeGreaterThan(0);
    expect(person.image).toEqual(dto.image);
  });

  it('determines first and second half of top interests', () => {
    // given
    let person: Person = PersonGenerator.givenAnyPerson();

    // then
    expect(person.topInterests.length)
      .toEqual(person.topInterestsFirstHalf.length + person.topInterestsSecondHalf.length);

    for (let interest of person.topInterestsFirstHalf) {
      expect(person.topInterests).toContain(interest);
    }

    for (let interest of person.topInterestsSecondHalf) {
      expect(person.topInterests).toContain(interest);
    }
  });
});
