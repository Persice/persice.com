import {ObjectUtil} from "../../../app/shared/core/util";
import {SocialNetworkFacebook} from "./social-network/social-network-facebook";
import {SocialNetworkLinkedin} from "./social-network/social-network-linkedin";
import {SocialNetworkTwitter} from "./social-network/social-network-twitter";
import {Gender} from "./gender";
export class Person {

  public topInterestsFirstHalf: any[];
  public topInterestsSecondHalf: any[];

  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _gender: Gender;
  private _age: number;
  private _distance: number;
  private _distanceUnit: string;
  private _topInterests: any[] = [];
  private _goals: any[];
  private _goalsCount: number;
  private _offers: any[];
  private _offersCount: number;
  private _interests: any[];
  private _interestsCount: number;
  private _likesMutualCount: number;
  private _likesCount: number;
  private _connectionsCount: number;
  private _connectionsMutualCount: number;
  private _image: string;
  private _score: number;
  private _facebook: SocialNetworkFacebook;
  private _twitter: SocialNetworkTwitter;
  private _linkedin: SocialNetworkLinkedin;
  private _job: string;
  private _company: string;
  private _about: string;
  private _livesIn: string;
  private _religiousViews: any[];
  private _politicalViews: any[];

  constructor(dto: any) {
    this._id = dto.id;
    this._firstName = dto.first_name;
    this._lastName = dto.last_name;
    this._gender = new Gender(dto.gender);
    this._age = dto.age;

    if (dto.distance) {
      this._distance = dto.distance[0];
      this._distanceUnit = dto.distance[1] ;
    }
    this._image = dto.image;
    this._score = dto.score;
    this._about = dto.about ? dto.about : '';
    this._livesIn = dto.lives_in ? dto.lives_in : '';
    this._job = dto.position && dto.position.job ? dto.position.job : '';
    this._company = dto.position && dto.position.company ? dto.position.company : '';

    this._connectionsCount = 0;
    this._connectionsMutualCount = 0;

    if (dto.top_interests) {
      let topInterestsFromDto = ObjectUtil.firstSorted(dto.top_interests[0], 6);
      let halfLength = Math.ceil(topInterestsFromDto.length / 2);

      this._topInterests = ObjectUtil.firstSorted(dto.top_interests[0], 6);
      this.topInterestsFirstHalf = topInterestsFromDto.splice(0, halfLength);
      this.topInterestsSecondHalf = topInterestsFromDto;
    }

    let goalsFromDto = ObjectUtil.transformSorted(dto.goals[0]),
      offersFromDto = ObjectUtil.transformSorted(dto.offers[0]),
      interestsFromDto = ObjectUtil.transformSorted(dto.interests[0]);

    this._goals = goalsFromDto;
    this._goalsCount = goalsFromDto.length;
    this._offers = offersFromDto;
    this._offersCount = offersFromDto.length;
    this._interests = interestsFromDto;
    this._interestsCount = interestsFromDto.length;
    this._likesCount = dto.total_likes_count;
    this._likesMutualCount = dto.mutual_likes_count;

    this._religiousViews = dto.religious_views;
    this._politicalViews = dto.political_views;

    this._facebook = new SocialNetworkFacebook(dto.facebook_id);
    this._twitter = new SocialNetworkTwitter(dto.twitter_username);
    this._linkedin = new SocialNetworkLinkedin(dto.linkedin_provider);
  }

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get formatedName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get gender(): string {
    return this._gender.value;
  }

  get age(): number {
    return this._age;
  }

  get distance(): number {
    return this._distance;
  }

  get distanceUnit(): string {
    return this._distanceUnit;
  }

  get topInterests(): any[] {
    return this._topInterests;
  }

  get image(): string {
    return this._image;
  }

  get score(): number {
    return this._score;
  }

  get livesIn(): string {
    return this._livesIn;
  }

  get about(): string {
    return this._about;
  }

  get job(): string {
    return this._job;
  }

  get company(): string {
    return this._company;
  }

  get jobDescription(): string {
    return `${this._job} at ${this._company}`;
  }

  get facebookUrl() {
    return this._facebook.url;
  }

  get twitterUrl() {
    return this._twitter.url;
  }

  get linkedinUrl() {
    return this._linkedin.url;
  }

  get interests(): any[] {
    return this._interests;
  }

  get interestsCount(): number {
    return this._interestsCount;
  }

  get offers(): any[] {
    return this._offers;
  }

  get offersCount(): number {
    return this._offersCount;
  }

  get goals(): any[] {
    return this._goals;
  }

  get goalsCount(): number {
    return this._goalsCount;
  }

  get likesCount(): number {
    return this._likesCount;
  }

  get likesMutualCount(): number {
    return this._likesMutualCount;
  }

  get connectionsCount(): number {
    return this._connectionsCount;
  }

  set connectionsCount(count: number) {
    this._connectionsCount = count;
  }

  get connectionsMutualCount(): number {
    return this._connectionsMutualCount;
  }

  set connectionsMutualCount(count: number) {
    this._connectionsMutualCount = count;
  }

  get politicalViews(): any[] {
    return this._politicalViews;
  }

  get religiousViews(): any[] {
    return this._religiousViews;
  }

  set about(text: string) {
    this._about = text;
  }

  public toDto(): any {
    return {
      id: this.id,
      goals: this.goals,
      offers: this.offers,
      interests: this.interests,
      about: this.about,
      lives_in: this.livesIn,
      position: { job: this.job, company: this.company },
      first_name: this.firstName,
      total_likes_count: this.likesCount,
      mutual_likes_count: this.likesMutualCount,
      last_name: this.lastName,
      distance: [this.distance, this.distanceUnit],
      top_interests: this.topInterests,
      gender: this._gender.shortCode,
      score: this.score,
      age: this.age,
      facebook_id: this._facebook.id,
      twitter_username: this._twitter.id,
      linkedin_provider: this._linkedin.id
    };
  }
}
