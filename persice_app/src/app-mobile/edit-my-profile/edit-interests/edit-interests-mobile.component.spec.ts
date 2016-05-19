// import {expect, it, describe, async, inject, beforeEach, beforeEachProviders}
// from '@angular/core/testing';

// import {TestComponentBuilder} from '@angular/compiler/testing';

// import {EditInterestsMobileComponent} from './edit-interests-mobile.component';
// import {KeywordsService, InterestsService} from '../../app/shared/services';
// import {provide, Provider} from '@angular/core';
// import {Observable} from 'rxjs';

// let component: EditInterestsMobileComponent;
// let mockKeywordsService: KeywordsServiceMock;
// let mockInterestsService: InterestsServiceMock;

// class KeywordsServiceMock extends KeywordsService {
//   findResponse: any;

//   public find(): Observable<any> {
//     return Observable.of(this.findResponse);
//   }

//   public updateOne(resourceUri: string, data: any): Observable<any> {
//     return Observable.of(null);
//   }

//   public setEmptyFindResponse(): void {
//     this.findResponse = this.findResponse = {
//       'objects': [
//         {
//           'keyword': '',
//         }
//       ]
//     };
//   }

//   public setNonEmptyFindResponse(): void {
//     this.findResponse = {
//       'objects': [
//         {
//           'keyword': 'python,cooking',
//         }
//       ]
//     };
//   }

//   public getProvider(): Provider {
//     return provide(KeywordsService, { useValue: this });
//   }
// }

// class InterestsServiceMock extends InterestsService {
//   findResponse: any;

//   public find(): Observable<any> {
//     return Observable.of(this.findResponse);
//   }

//   public updateOne(resourceUri: string, data: any): Observable<any> {
//     return Observable.of(null);
//   }

//   public setEmptyFindResponse(): void {
//     this.findResponse = this.findResponse = {
//       'objects': [
//         {
//           'keyword': '',
//         }
//       ]
//     };
//   }

//   public setNonEmptyFindResponse(): void {
//     this.findResponse = {
//       'objects': [
//         {
//           'keyword': 'python,cooking',
//         }
//       ]
//     };
//   }

//   public getProvider(): Provider {
//     return provide(InterestsService, { useValue: this });
//   }
// }

// describe('Edit interests mobile component', () => {

//   beforeEachProviders(() => {
//     mockKeywordsService = new KeywordsServiceMock(null);
//     mockInterestsService = new InterestsServiceMock(null);
//     return [
//       mockKeywordsService.getProvider(),
//       mockInterestsService.getProvider()
//     ];
//   });

//   beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
//     return tcb
//       .overrideProviders(
//       EditInterestsMobileComponent, [
//       provide(KeywordsService, { useValue: mockKeywordsService }),
//       provide(InterestsService, { useValue: mockInterestsService })
//       ])
//       .createAsync(EditInterestsMobileComponent)
//       .then((componentFixture: any) => {
//         component = componentFixture.componentInstance;
//       });
//   })));

//   it('should initially be empty', () => {
//     // when
//     mock.setEmptyFindResponse();

//     // then
//     expect(component.items.length).toEqual(0);
//   });

//   it('should show items when service returns data', () => {
//     // given
//     mockInterestsService.setNonEmptyFindResponse();
//     mockKeywordsService.setNonEmptyFindResponse();

//     // when
//     component.ngOnInit();

//     // then
//     expect(component.items.length).toEqual(2);
//     // expect(component.items[0]).toEqual('python');
//     // expect(component.items[1]).toEqual('cooking');
//   });

//   // it('adds items', () => {
//   //   // given
//   //   mock.setEmptyFindResponse();

//   //   // when
//   //   component.ngAfterViewInit();
//   //   component.newItemText = 'linux';
//   //   component.add();

//   //   // then
//   //   expect(component.items[0]).toEqual('linux');
//   // });

//   // it('removes items', () => {
//   //   // given
//   //   mock.setNonEmptyFindResponse();

//   //   // when
//   //   component.ngAfterViewInit();
//   //   component.remove('python');

//   //   // then
//   //   expect(component.items.length).toEqual(1);
//   //   expect(component.items[0]).toEqual('cooking');
//   // });

//   // it('fails to add duplicates', () => {
//   //   // given
//   //   mock.setNonEmptyFindResponse();

//   //   // when
//   //   component.ngAfterViewInit();
//   //   component.newItemText = 'python';
//   //   component.add();

//   //   // then
//   //   expect(component.items.length).toEqual(2);
//   //   expect(component.items[0]).toEqual('python');
//   //   expect(component.items[1]).toEqual('cooking');
//   // });

//   it('fails to add short items', () => {
//     // given
//     mock.setNonEmptyFindResponse();

//     // when
//     component.ngAfterViewInit();
//     component.newItemText = 'a';
//     component.add();

//     // then
//     expect(component.items.length).toEqual(2);
//     expect(component.items[0]).toEqual('python');
//     expect(component.items[1]).toEqual('cooking');
//   });
// });
