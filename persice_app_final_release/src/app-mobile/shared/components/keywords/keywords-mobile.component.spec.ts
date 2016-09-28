// import { async, inject, TestComponentBuilder, addProviders } from '@angular/core/testing';
// import { KeywordsComponentMobile } from './keywords-mobile.component';
// import { FilterService } from '../../../../app/shared/services/filter.service';
// import { Observable } from 'rxjs';
//
// let component: KeywordsComponentMobile;
// let mock: FilterServiceMock;
//
// class FilterServiceMock extends FilterService {
//   findResponse: any;
//
//   public find(): Observable<any> {
//     return Observable.of(this.findResponse);
//   }
//
//   public updateOne(resourceUri: string, data: any): Observable<any> {
//     return Observable.of(null);
//   }
//
//   public setEmptyFindResponse(): void {
//     this.findResponse = this.findResponse = {
//       'objects': [
//         {
//           'keyword': '',
//         }
//       ]
//     };
//   }
//
//   public setNonEmptyFindResponse(): void {
//     this.findResponse = {
//       'objects': [
//         {
//           'keyword': 'python,cooking',
//         }
//       ]
//     };
//   }
//
//   public getProvider(): any {
//     return {provide: FilterService, useValue: this};
//   }
// }
//
// describe('Keyword mobile component', () => {
//
//   beforeEach(() => {
//     mock = new FilterServiceMock(null);
//     addProviders([
//       mock.getProvider()
//     ]);
//   });
//
//   beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
//     return tcb
//       .overrideProviders(
//         KeywordsComponentMobile, [{provide: FilterService, useValue: mock}])
//       .createAsync(KeywordsComponentMobile)
//       .then((componentFixture: any) => {
//         component = componentFixture.componentInstance;
//       });
//   })));
//
//   it('should initially be empty', () => {
    // when
    // mock.setEmptyFindResponse();

    // then
    // expect(component.items.length).toEqual(0);
  // });
  //
  // it('should show items when service returns data', () => {
    // given
    // mock.setNonEmptyFindResponse();

    // when
    // component.ngAfterViewInit();

    // then
    // expect(component.items.length).toEqual(2);
    // expect(component.items[0]).toEqual('python');
    // expect(component.items[1]).toEqual('cooking');
  // });
  //
  // it('adds items', () => {
    // given
    // mock.setEmptyFindResponse();

    // when
    // component.ngAfterViewInit();
    // component.newItemText = 'linux';
    // component.add();

    // then
    // expect(component.items[0]).toEqual('linux');
  // });
  //
  // it('removes items', () => {
    // given
    // mock.setNonEmptyFindResponse();

    // when
    // component.ngAfterViewInit();
    // component.remove('python');

    // then
    // expect(component.items.length).toEqual(1);
    // expect(component.items[0]).toEqual('cooking');
  // });
  //
  // it('fails to add duplicates', () => {
    // given
    // mock.setNonEmptyFindResponse();

    // when
    // component.ngAfterViewInit();
    // component.newItemText = 'python';
    // component.add();

    // then
    // expect(component.items.length).toEqual(2);
    // expect(component.items[0]).toEqual('python');
    // expect(component.items[1]).toEqual('cooking');
  // });
  //
  // it('fails to add short items', () => {
    // given
    // mock.setNonEmptyFindResponse();

    // when
    // component.ngAfterViewInit();
    // component.newItemText = 'a';
    // component.add();

    // then
    // expect(component.items.length).toEqual(2);
    // expect(component.items[0]).toEqual('python');
    // expect(component.items[1]).toEqual('cooking');
  // });
// });
