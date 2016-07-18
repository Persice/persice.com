import { DateUtil } from '../../../app/shared/core';

export class Message {

  private _senderName: string;
  private _senderUsername: string;
  private _date: string;
  private _time: string;
  private _body: string;
  private _image: string;

  public static getCollection(dtoArray: any): Message[] {
    let items: Message[] = [];
    for (var i = 0; i < dtoArray.length; ++i) {
      let item = new Message(dtoArray[i]);
      items = [item, ...items];
    }
    return items;
  }

  constructor(dto: any) {

    this._senderName = dto.sender_name;
    this._senderUsername = dto.sender_sender;
    this._date = this.formatDate(dto.sent_at);
    this._time = DateUtil.format(dto.sent_at, 'LT');

    this._body = dto.body;
    this._image = dto.sender_image ? dto.sender_image : '';
  }

  get senderName(): string {
    return this._senderName;
  }

  get senderUsername(): string {
    return this._senderUsername;
  }

  get date(): string {
    return this._date;
  }

  get time(): string {
    return this._time;
  }

  get body(): string {
    return this._body;
  }

  get image(): string {
    return this._image;
  }

  private formatDate(date: any): string {
    if (date === null) {
      return '';
    }

    let dateFormated = '';

    if (!DateUtil.isBeforeToday(date)) {
      dateFormated = 'Today';
    } else {
      if (DateUtil.isWithinLastWeek(date)) {
        dateFormated = DateUtil.format(date, 'dddd');
      } else {
        dateFormated = DateUtil.format(date, 'ddd, D MMMM YYYY');
      }
    }

    return dateFormated;
  }

}
