import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable()
export class MutualConnectionsCountService {
  public static API_URL = '/api/v2/mutual-friends/count/';
  public totalCount$: Observable<number>;
  private _totalCount$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private http: Http) {
    this.totalCount$ = this._totalCount$.asObservable();
  }

  public getTotalCount(userId: string): void {

    this._totalCount$.next(0);

    const params: string = [
      `format=json`,
      `friend_id=${userId}`
    ].join('&');

    let apiUrl = `${MutualConnectionsCountService.API_URL}?${params}`;

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponseCount(res))
      .subscribe((dto: number) => {
        this._totalCount$.next(dto);

      }, (err) => {
        console.log('mutual friends count api error');
      }, () => {
        subs$.unsubscribe();
      });
  }

  private _mapResponseCount(response: Response): number {
    const dto: any = response.json();

    let totalCount: number = 0;
    totalCount = dto.objects && dto.objects.length > 0 ? dto.objects[0].count : 0;
    return totalCount;
  }
}
