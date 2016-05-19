export class Gender {

  private _shortCode: string;
  private _value: string;

  constructor(shortCode: string) {
    this._shortCode = shortCode;
    this._value = Gender.parseGender(shortCode);
  }

  get shortCode(): string {
    return this._shortCode;
  }

  get value(): string {
    return this._value;
  }

  static parseGender(value: string): string {
    let retValue: string = '';
    switch (value) {
      case 'm':
        retValue = 'Male';
        break;
      case 'f':
        retValue = 'Female';
        break;
      default:
        retValue = '';
        break;
    }

    return retValue;
  }
}
