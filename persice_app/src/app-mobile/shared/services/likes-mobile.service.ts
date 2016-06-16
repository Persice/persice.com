import {Injectable} from "@angular/core";
import {Response} from '@angular/http';
import {Observable} from "rxjs/Rx";
import {TwoListService} from "./two-list.service";
import {HttpClient} from "../../../app/shared/core/http-client";

@Injectable()
export class LikesMobileService extends TwoListService {

  static MUTUAL_LIKES_API_URL: string = '/api/v1/mutual_likes/';
  static OTHER_LIKES_API_URL: string = '/api/v1/other_likes/';
  next: string = '';

  constructor(private http: HttpClient) {
    super();
  }

  public mutual(url: string, limit: number, user: string): Observable<any> {
    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${LikesMobileService.MUTUAL_LIKES_API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public other(url: string, limit: number, user: string): Observable<any> {
    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${LikesMobileService.OTHER_LIKES_API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public firstList(firstParam?: any, secondParam?: any, thirdParam?: any): Observable<any> {
    return this.mutual(firstParam, secondParam, thirdParam);
  }

  public secondList(firstParam?: any, secondParam?: any, thirdParam?: any): Observable<any> {
    return this.other(firstParam, secondParam, thirdParam);
  }
}
