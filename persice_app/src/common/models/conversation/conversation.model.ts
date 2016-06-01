import {StringUtil, DateUtil} from '../../../app/shared/core';

export class Conversation {

  private _id: number;
  private _threadId: number;
  private _name: string;
  private _senderId: string;
  private _sentAt: string;
  private _readAt: string;
  private _date: string;
  private _unread: boolean;
  private _unreadCounter: number;
  private _body: string;
  private _image: string;

  constructor(dto: any) {
    this._id = dto.id;
    this._threadId = parseInt(dto.friend_id, 10);
    this._name = dto.first_name;
    this._senderId = dto.sender_id ? dto.sender_id :  `api/v1/auth/user/${dto.sender_id}`;
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

  get threadId(): number {
    return this._threadId;
  }

  get name(): string {
    return this._name;
  }

  get senderId(): string {
    return this._senderId;
  }

  get sentAt(): string {
    return this._sentAt;
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

  get unreadCounter(): number {
    return this._unreadCounter;
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

    if (DateUtil.isBeforeToday(date)) {
      dateFormated = DateUtil.format(date, 'll');
    } else {
      dateFormated = DateUtil.fromNow(date);
    }

    return dateFormated;
  }

}
