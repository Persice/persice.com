export class SearchResultUserModel {
  firstName: string;
  age: number;
  gender: string;
  distanceValue: number;
  distanceUnit: string;
  mutualFriends: number;
  matchScore: number;
  image: string;
  constructor(obj?: any) {
    this.firstName = obj && obj.first_name || null;
    this.image = obj && obj.image || ('/static/persiceApp/src/public/images/avatar_user_' + obj.gender + '.jpg');
    this.age = obj && obj.age || null;
    this.gender = obj && obj.gender || null;
    this.distanceValue = obj && obj.distance[0] || null;
    this.distanceUnit = obj && obj.distance[1] || null;
    this.mutualFriends = obj && obj.mutual_friends || 0;
    this.matchScore = obj && obj.match_score || 0;
  }
}


export class SearchResultEventModel {
  name: string;
  city: string;
  state: string;
  date: Date;
  image: string;

  constructor(obj?: any) {
    this.name = obj && obj.name || null;
    this.image = obj && obj.event_photo || '/static/img/placeholder-image.jpg';
    this.city = obj && obj.city || null;
    this.state = obj && obj.state || null;
    this.date = obj && new Date(obj.starts_on) || null;
  }
}
