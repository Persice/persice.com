export class EventDate {
  private _hour: string;
  private _day: string;
  private _dayName: string;
  private _month: string;
  private _year: string;

  constructor(hour: string, day: string, dayName: string, month: string, year: string) {
    this._hour = hour;
    this._day = day;
    this._dayName = dayName;
    this._month = month;
    this._year = year;
  }

  get hour(): string {
    return this._hour;
  }

  get day(): string {
    return this._day;
  }

  get dayName(): string {
    return this._dayName;
  }

  get month(): string {
    return this._month;
  }

  get year(): string {
    return this._year;
  }
}
