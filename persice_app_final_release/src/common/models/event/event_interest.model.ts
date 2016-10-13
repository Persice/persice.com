export class EventInterest {
  private _id: string;
  private _name: string;
  private _personCount: number;

  constructor(dto: any) {
    this._id = dto.id;
    this._name = dto.description;
    this._personCount = dto.num_interests;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get personCount(): number {
    return this._personCount;
  }
}
