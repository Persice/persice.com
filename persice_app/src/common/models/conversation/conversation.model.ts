import {StringUtil, DateUtil} from '../../../app/shared/core';

export class Conversation {

  private _id: number;
  private _senderId: string;
  private _name: string;
  private _sender: string;
  private _sentAt: string;
  private _readAt: string;
  private _date: string;
  private _unread: boolean;
  private _unreadCounter: number;
  private _body: string;
  private _image: string;

  public static getCollection(dtoArray: any): Conversation[] {
    let items: Conversation[] = [];
    for (var i = 0; i < dtoArray.length; ++i) {
      let item = new Conversation(dtoArray[i]);
      items = [...items, item];
    }
    return items;
  }

  constructor(dto: any) {
    this._id = dto.id;
    this._senderId = dto.friend_id;
    this._name = dto.first_name;
    this._sender = dto.sender_id ? dto.sender_id : `api/v1/auth/user/${dto.sender_id}`;
    this._sentAt = this.formatDate(dto.sent_at);
    this._date = dto.sent_at ? dto.sent_at : '';
    this._readAt = dto.read_at;
    this._unread = dto.unread_counter && dto.unread_counter > 0 ? true : false;
    this._unreadCounter = dto.unread_counter;
    this._body = dto.last_message_body ? StringUtil.words(dto.last_message_body, 50) : '';
    this._image = dto.image ? dto.image : '';
  }

  get id(): number {
    return this._id;
  }

  get senderId(): string {
    return this._senderId;
  }

  get name(): string {
    return this._name;
  }

  get sender(): string {
    return this._sender;
  }

  get sentAt(): string {
    return this._sentAt;
  }

  set sentAt(date: string) {
    this._date = date;
    this._sentAt = date;
  }

  get readAt(): string {
    return this._readAt;
  }

  get date(): string {
    return this._date;
  }

  get unread(): boolean {
    return this._unread;
  }

  set unread(state: boolean) {
    this._unread = state;
  }

  get unreadCounter(): number {
    return this._unreadCounter;
  }

  set unreadCounter(counter: number) {
    this._unreadCounter = counter;
  }

  get body(): string {
    return this._body;
  }

  set body(value: string) {
    this._body = value;
  }

  get image(): string {
    return this._image;
  }

  private formatDate(date: any): string {
    if (date === null) {
      return '';
    }

    let dateFormated = '';

    if (DateUtil.isBeforeToday(date)) {
      dateFormated = DateUtil.format(date, 'll');
    } else {
      dateFormated = DateUtil.fromNow(date);
    }

    return dateFormated;
  }

}
