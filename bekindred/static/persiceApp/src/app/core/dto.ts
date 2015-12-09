export interface BaseDto {
  _id?: any;
  createdBy?: any;
  createdAt?: number;
  updatedAt?: number;
}

export interface Notification {
  type: string;
  data?: any;
}
