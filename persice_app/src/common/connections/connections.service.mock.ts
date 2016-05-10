import {provide, Provider} from '@angular/core';
import {ConnectionsService} from './connections.service';
import {Observable} from 'rxjs';

export class MockConnectionsService extends ConnectionsService {
  fakeResponse: any = null;

  public get(url: string, limit: number): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(ConnectionsService, { useValue: this });
  }
}
