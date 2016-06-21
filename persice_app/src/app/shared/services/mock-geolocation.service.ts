import {GeolocationService} from "./geolocation.service";
import {SpyObject} from "../../../common/test/mocks/helper";
import {provide} from "@angular/core";

export class MockGeolocationService extends SpyObject {
  getLocationSpy;
  fakeResponse;

  constructor() {
    super(GeolocationService);

    this.fakeResponse = null;
    this.getLocationSpy = this.spy('getLocation').andReturn(this);
  }

  setResponse(json: any): void {
    this.fakeResponse = json;
  }

  getProviders(): Array<any> {
    return [provide(GeolocationService, {useValue: this})];
  }
}
