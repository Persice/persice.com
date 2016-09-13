import { Person } from './person';

export class PersonGenerator {

  public static givenAnyPersonDto(): any {
    return {
      id: 1,
      username: 'alice',
      goals: [],
      offers: [],
      likes: [],
      interests: [],
      about: '',
      lives_in: '',
      position: {job: null, company: null},
      first_name: this.givenAnyFirstName(),
      last_name: this.givenAnyLastName(),
      distance: [this.givenAnyDistance(), this.givenAnyDistanceUnit()],
      connected: false,
      top_interests: this.givenAnyTopInterests(),
      gender: this.givenAnyGenderServerResponse(),
      score: this.givenAnyScore(),
      age: this.givenAnyAge(),
      facebook_id: this.givenAnyFacebookId(),
      twitter_username: this.givenAnyTwiiterUsername(),
      linkedin_provider: this.givenAnyLinkedinProvider(),
    };
  }

  public static givenAnyPersonWithoutLinkedinAndTwitterDto(): any {
    return {
      id: 1,
      goals: [],
      offers: [],
      likes: [],
      interests: [],
      about: '',
      lives_in: '',
      position: {job: null, company: null},
      first_name: this.givenAnyFirstName(),
      last_name: this.givenAnyLastName(),
      distance: [this.givenAnyDistance(), this.givenAnyDistanceUnit()],
      top_interests: this.givenAnyTopInterests(),
      gender: this.givenAnyGenderServerResponse(),
      score: this.givenAnyScore(),
      age: this.givenAnyAge(),
      facebook_id: this.givenAnyFacebookId(),
      twitter_username: null,
      linkedin_provider: null,
    };
  }

  public static givenAPersonWithoutInterestDto(): any {
    return {
      id: 1,
      goals: [],
      offers: [],
      likes: [],
      interests: [],
      about: '',
      lives_in: '',
      position: {job: null, company: null},
      first_name: this.givenAnyFirstName(),
      last_name: this.givenAnyLastName(),
      distance: [this.givenAnyDistance(), this.givenAnyDistanceUnit()],
      top_interests: [],
      gender: this.givenAnyGenderServerResponse(),
      score: this.givenAnyScore(),
      age: this.givenAnyAge(),
      facebook_id: this.givenAnyFacebookId(),
      twitter_username: this.givenAnyTwiiterUsername(),
      linkedin_provider: this.givenAnyLinkedinProvider(),
    };
  }

  public static givenAnyPersonDtoWithoutInterestsAndDistance(): any {
    let dto = this.givenAnyPersonDto();

    delete dto.top_interests;
    delete dto.distance;

    return dto;
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
    return [{
      acting: 0,
      bird: 0,
      learn: 1,
      swimming: 0,
      coding: 0
    }];
  }

  public static givenAnyGenderServerResponse(): string {
    return 'f';
  }

  public static givenAnyScore(): number {
    return 5;
  }

  public static givenAnyAbout(): string {
    return 'this is about me';
  }

  public static givenAnyAge(): number {
    return 24;
  }

  public static givenAnyFacebookId(): number {
    return 123;
  }

  public static givenAnyTwiiterUsername(): string {
    return 'alice';
  }

  public static givenAnyLinkedinProvider(): string {
    return 'alice';
  }
}
