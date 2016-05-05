import {Person} from "./person";

export class PersonGenerator {

  public static givenAnyPersonDto(): any {
    return {
      id: 1,
      first_name: `${this.givenAnyFirstName()}`,
      last_name: `${this.givenAnyLastName()}`,
      distance: [`${this.givenAnyDistance()}`, `${this.givenAnyDistanceUnit()}`],
      top_interests: `${this.givenAnyTopInterests()}`,
      gender: `${this.givenAnyGenderServerResponse()}`,
      score: `${this.givenAnyScore()}`,
      age: `${this.givenAnyAge()}`
    };
  }

  public static givenAPersonWithoutInterestDto(): any {
    return {
      id: 1,
      first_name: `${this.givenAnyFirstName()}`,
      last_name: `${this.givenAnyLastName()}`,
      distance: [`${this.givenAnyDistance()}`, `${this.givenAnyDistanceUnit()}`],
      top_interests: [],
      gender: `${this.givenAnyGenderServerResponse()}`,
      score: `${this.givenAnyScore()}`,
      age: `${this.givenAnyAge()}`
    };
  }

  public static givenAnyPerson(): Person {
    return new Person(this.givenAnyPersonDto());
  }

  public static givenAPersonWithoutInterest(): Person {
    return new Person(this.givenAPersonWithoutInterestDto());
  }

  public static givenAnyFirstName(): string {
    return 'Alice';
  }

  public static givenAnyLastName(): string {
    return 'Surname';
  }

  public static givenAnyDistance(): number {
    return 10;
  }

  public static givenAnyDistanceUnit(): string {
    return 'miles';
  }

  public static givenAnyTopInterests(): any {
    return {
      acting: 0,
      bird: 0,
      learn: 1,
      swimming: 0,
      coding: 0
    };
  }

  public static givenAnyGenderServerResponse(): string {
    return 'f';
  }

  public static givenAnyScore(): number {
    return 5;
  }

  public static givenAnyAge(): number {
    return 24;
  }
}
