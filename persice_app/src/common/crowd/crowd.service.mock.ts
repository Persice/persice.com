import {provide, Provider} from 'angular2/core';
import {CrowdService} from './crowd.service';
import {Observable} from 'rxjs';
import {HttpClient} from "../../app/shared/core/http-client";

export class MockCrowdService extends CrowdService {
  fakeResponse: any = null;

  public get(url: string, limit: number): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(CrowdService, { useValue: this });
  }
}
