import { SocialProfile } from './social-profile';

export class SocialProfileGenerator {

  public static givenSocialProfileDto(type: string): any {
    return {
      id: "99670053",
      username: 'alice',
      goals: null,
      offers: null,
      likes: null,
      interests: null,
      image: 'https://pbs.twimg.com/profile_images/602085130371354624/vncLc7uq_normal.jpg',
      about: null,
      lives_in: null,
      position: null,
      first_name: this.givenAnyFirstName(),
      last_name: this.givenAnyLastName(),
      distance: [],
      connected: false,
      top_interests: null,
      gender: null,
      score: null,
      age: null,
      facebook_id: this.givenAnyFacebookId(),
      twitter_username: this.givenAnyTwitterUsername(),
      linkedin_provider: this.givenAnyLinkedinProvider(),
      user_type: type
    };
  }


  public static givenSocialProfile(type: string): SocialProfile {
    return new SocialProfile(this.givenSocialProfileDto(type));
  }

  public static givenAnyFirstName(): string {
    return 'Alice';
  }

  public static givenAnyLastName(): string {
    return 'Surname';
  }

  public static givenAnyFacebookId(): number {
    return 123;
  }

  public static givenAnyTwitterUsername(): string {
    return 'alice';
  }

  public static givenAnyLinkedinProvider(): string {
    return 'https://www.linkedin.com/in/sa%C5%A1a-macakanja-637ba5b1';
  }
}
