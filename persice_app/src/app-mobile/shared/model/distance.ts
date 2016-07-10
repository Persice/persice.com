export class Distance {

  private _amount: string;
  private _unit: string;

  constructor(array: string[]) {
    this._amount = array[0];
    this._unit = array[1];
  }

  get amount(): string {
    return this._amount;
  }

  get unit(): string {
    return this._unit;
  }
}