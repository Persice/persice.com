// import { async, inject, addProviders, TestComponentBuilder } from '@angular/core/testing';
// import { Observable } from 'rxjs';
// import { EditGoalsMobileComponent } from './edit-goals-mobile.component';
// import { GoalsService } from '../../../app/shared/services/goals.service';
// import { AppStateService } from '../../shared/services/app-state.service';
// import { GoalsGenerators } from './goals-generators';
// import { HeaderState } from '../../header/header.state';
//
// let component: EditGoalsMobileComponent;
// let mock: GoalsServiceMock;
//
// class GoalsServiceMock extends GoalsService {
//   response: any;
//
//   public get(url: string, limit: number): Observable<any> {
//     return Observable.of(this.response);
//   }
//
//   public getCount(): Observable<any> {
//     return this.response.objects.length;
//   }
//
//   public save(subject: string): Observable<any> {
//     return Observable.of(GoalsGenerators.givenAGoalWithSubjectDto(subject));
//   }
//
//   public delete(url: string): Observable<any> {
//     return Observable.of(null);
//   }
//
//   public setEmptyFindResponse(): void {
//     this.response = this.response = {
//       meta: {
//         total_count: 0
//       },
//       objects: []
//     };
//   }
//
//   public setNonEmptyFindResponse(): void {
//     this.response = {
//       meta: {
//         total_count: 2
//       },
//       objects: [
//         GoalsGenerators.givenAGoalWithSubjectDto('find a running partner'),
//         GoalsGenerators.givenAGoalWithSubjectDto('learn to play guitar')
//       ]
//     };
//   }
//
//   public getProvider(): any {
//     return {provide: GoalsService, useValue: this};
//   }
// }
//
// describe('Edit goals mobile component', () => {
//
//   beforeEach(() => {
//     mock = new GoalsServiceMock(null);
//     addProviders([
//       mock.getProvider(),
//       AppStateService,
//       HeaderState
//     ]);
//   });
//
//   beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
//     return tcb
//       .overrideProviders(
//         EditGoalsMobileComponent, [{provide: GoalsService, useValue: mock}])
//       .createAsync(EditGoalsMobileComponent)
//       .then((componentFixture: any) => {
//         component = componentFixture.componentInstance;
//       });
//   })));
//
//   it('should initially be empty', () => {
//     // when
//     mock.setEmptyFindResponse();
//
//     // then
//     expect(component.items.length).toEqual(0);
//   });
//
//   it('should show items when service returns data', () => {
//     // given
//     mock.setNonEmptyFindResponse();
//
//     // when
//     component.ngOnInit();
//
//     // then
//     expect(component.items.length).toEqual(2);
//     expect(component.items[0]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('find a running partner'));
//     expect(component.items[1]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('learn to play guitar'));
//   });
//
//   it('adds items', () => {
//     // given
//     mock.setEmptyFindResponse();
//
//     // when
//     component.ngOnInit();
//     component.newItemText = 'something new';
//     component.add();
//
//     // then
//     expect(component.items[0].id).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('something new').id);
//     expect(component.items[0].resource_uri)
//       .toEqual(GoalsGenerators.givenAGoalWithSubjectDto('something new').resource_uri);
//     expect(component.items[0].subject).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('something new').subject);
//   });
//
//   it('removes items', () => {
//     // given
//     mock.setNonEmptyFindResponse();
//
//     // when
//     component.ngOnInit();
//     component.remove(GoalsGenerators.givenAGoalWithSubjectDto('find a running partner'));
//
//     // then
//     expect(component.items.length).toEqual(1);
//     expect(component.items[0]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('learn to play guitar'));
//   });
//
//   it('fails to add duplicates', () => {
//     // given
//     mock.setNonEmptyFindResponse();
//
//     // when
//     component.ngOnInit();
//     component.newItemText = GoalsGenerators.givenAGoalWithSubjectDto('find a running partner');
//     component.add();
//
//     // then
//     expect(component.items.length).toEqual(2);
//     expect(component.items[0]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('find a running partner'));
//     expect(component.items[1]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('learn to play guitar'));
//   });
//
//   it('fails to add short items', () => {
//     // given
//     mock.setNonEmptyFindResponse();
//
//     // when
//     component.ngOnInit();
//     component.newItemText = 'a';
//     component.add();
//
//     // then
//     expect(component.items.length).toEqual(2);
//     expect(component.items[0]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('find a running partner'));
//     expect(component.items[1]).toEqual(GoalsGenerators.givenAGoalWithSubjectDto('learn to play guitar'));
//   });
// });
