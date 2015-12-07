export interface InterfaceNotification {
  type: string;
  title: string;
  body: string;
  autoclose: number;
}

export class NotificationModel {
  constructor(
    public type: string,
    public title: string,
    public body: string,
    public autoclose: number = 0
  ) {

  }
}
