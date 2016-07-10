import {async, inject, addProviders, TestComponentBuilder} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {EditOffersMobileComponent} from './edit-offers-mobile.component';
import {OffersService} from '../../../app/shared/services/offers.service';
import {AppStateService} from '../../shared/services/app-state.service';
import {OffersGenerators} from './offers-generators';
import {HeaderState} from '../../header/header.state';

let component: EditOffersMobileComponent;
let mock: OffersServiceMock;

class OffersServiceMock extends OffersService {
  response: any;

  public get(url: string, limit: number): Observable<any> {
    return Observable.of(this.response);
  }

  public getCount(): Observable<any> {
    return this.response.objects.length;
  }

  public save(subject: string): Observable<any> {
    return Observable.of(OffersGenerators.givenAnOfferWithSubjectDto(subject));
  }

  public delete(url: string): Observable<any> {
    return Observable.of(null);
  }

  public setEmptyFindResponse(): void {
    this.response = this.response = {
      meta: {
        total_count: 0
      },
      objects: []
    };
  }

  public setNonEmptyFindResponse(): void {
    this.response = {
      meta: {
        total_count: 2
      },
      objects: [
        OffersGenerators.givenAnOfferWithSubjectDto('find a running partner'),
        OffersGenerators.givenAnOfferWithSubjectDto('learn to play guitar')
      ]
    };
  }

  public getProvider(): any {
    return {provide: OffersService, useValue: this};
  }
}

describe('Edit offers mobile component', () => {

  beforeEach(() => {
    mock = new OffersServiceMock(null);
    addProviders([
      mock.getProvider(),
      AppStateService,
      HeaderState
    ]);
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
        EditOffersMobileComponent, [{provide: OffersService, useValue: mock}])
      .createAsync(EditOffersMobileComponent)
      .then((componentFixture: any) => {
        component = componentFixture.componentInstance;
      });
  })));

  it('should initially be empty', () => {
    // when
    mock.setEmptyFindResponse();

    // then
    expect(component.items.length).toEqual(0);
  });

  it('should show items when service returns data', () => {
    // given
    mock.setNonEmptyFindResponse();

    // when
    component.ngOnInit();

    // then
    expect(component.items.length).toEqual(2);
    expect(component.items[0]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('find a running partner'));
    expect(component.items[1]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('learn to play guitar'));
  });

  it('adds items', () => {
    // given
    mock.setEmptyFindResponse();

    // when
    component.ngOnInit();
    component.newItemText = 'something new';
    component.add();

    // then
    expect(component.items[0].id).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('something new').id);
    expect(component.items[0].resource_uri)
      .toEqual(OffersGenerators.givenAnOfferWithSubjectDto('something new').resource_uri);
    expect(component.items[0].subject).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('something new').subject);
  });

  it('removes items', () => {
    // given
    mock.setNonEmptyFindResponse();

    // when
    component.ngOnInit();
    component.remove(OffersGenerators.givenAnOfferWithSubjectDto('find a running partner'));

    // then
    expect(component.items.length).toEqual(1);
    expect(component.items[0]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('learn to play guitar'));
  });

  it('fails to add duplicates', () => {
    // given
    mock.setNonEmptyFindResponse();

    // when
    component.ngOnInit();
    component.newItemText = OffersGenerators.givenAnOfferWithSubjectDto('find a running partner');
    component.add();

    // then
    expect(component.items.length).toEqual(2);
    expect(component.items[0]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('find a running partner'));
    expect(component.items[1]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('learn to play guitar'));
  });

  it('fails to add short items', () => {
    // given
    mock.setNonEmptyFindResponse();

    // when
    component.ngOnInit();
    component.newItemText = 'a';
    component.add();

    // then
    expect(component.items.length).toEqual(2);
    expect(component.items[0]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('find a running partner'));
    expect(component.items[1]).toEqual(OffersGenerators.givenAnOfferWithSubjectDto('learn to play guitar'));
  });
});
