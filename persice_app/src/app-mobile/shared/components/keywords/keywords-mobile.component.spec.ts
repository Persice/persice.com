import {
  expect,
  it,
  describe, TestComponentBuilder, injectAsync, beforeEach, beforeEachProviders
} from 'angular2/testing';
import {KeywordsComponentMobile} from "./keywords-mobile.component";
import {FilterService} from "../../../../app/shared/services/filter.service";
import {provide, Provider} from "angular2/core";
import {Observable} from 'rxjs';

let component: KeywordsComponentMobile;
let mock: FilterServiceMock;

class FilterServiceMock extends FilterService {
  findResponse: string;

  public find(): Observable<any> {
    return Observable.of(this.findResponse);
  }

  public setEmptyFindResponse(): void {
    this.findResponse = null;
  }

  public getProvider(): Provider {
    return provide(FilterService, { useValue: this });
  }
}

describe('Keyword mobile component', () => {

  beforeEachProviders(() => {
    mock = new FilterServiceMock(null);
    return [
      mock.getProvider()
    ];
  });

  beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
        KeywordsComponentMobile, [provide(FilterService, { useClass: FilterServiceMock })])
      .createAsync(KeywordsComponentMobile)
      .then((componentFixture: any) => {
        component = componentFixture.componentInstance;
      });
  }));

  it('should initially be empty', () => {
    // when
    mock.setEmptyFindResponse();

    // then
    expect(component.items.length).toEqual(0);
  });
});
