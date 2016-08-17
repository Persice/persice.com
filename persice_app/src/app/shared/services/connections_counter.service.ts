import { provide, Injectable } from '@angular/core';
import { HttpClient } from '../core';
import { Subject } from 'rxjs';

@Injectable()
export class ConnectionsCounterService {
  static API_URL = '/api/v2/new_connections/counter/';
  _state: number = 0;
  _observer: Subject<any> = new Subject();

  constructor(private http: HttpClient) {
    this._loadCounter();
  }

  public refreshCounter() {
    this._loadCounter();
  }

  public serviceObserver(): Subject<any> {
    return this._observer;
  }

  private _loadCounter() {
    let url = `${ConnectionsCounterService.API_URL}?format=json`;

    let channel = this.http.get(url)
      .map((res) => res.json())
      .subscribe((res) => {
        if (!!res.meta && res.meta.total_count === 1) {
          this._state = res.objects[0].new_connection_counter;
        }
        this._notify();
        channel.unsubscribe();
      }, (error) => {
        console.log(`Could not load connections counter ${error}`);
        channel.unsubscribe();
      });
  }

  private _notify() {
    this._observer.next({
      counter: this._state
    });
  }

}

export var connectionsCounterServiceInjectables: any[] = [
  provide(ConnectionsCounterService, {useClass: ConnectionsCounterService})
];
