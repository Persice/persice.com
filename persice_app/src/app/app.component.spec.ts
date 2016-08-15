// import { inject, addProviders } from '@angular/core/testing';
// import { Location } from '@angular/common';
// import { AppComponent } from './app.component';
// import { SpyLocation } from '@angular/common/testing';

// xdescribe('App component', () => {
//   var location, router;

//   beforeEach(() => {

//     addProviders([

//       {provide: Location, useClass: SpyLocation},

//     ]);
//   });

//   beforeEach(inject([Location], ( l) => {
//     router = r;
//     location = l;
//   }));

//   it('Should be able to navigate to Crowd', done => {
//     router.navigate(['Crowd']).then(() => {
//       expect(location.path()).toBe('/crowd');
//       done();
//     }).catch(e => done.fail(e));
//   });

//   it('Should be able to navigate to Pals', done => {
//     router.navigate(['Connections']).then(() => {
//       expect(location.path()).toBe('/pals');
//       done();
//     }).catch(e => done.fail(e));
//   });

//   it('Should be able to navigate to Events', done => {
//     router.navigateByUrl('/events').then(() => {
//       expect(location.path()).toBe('/events');
//       done();
//     }).catch(e => done.fail(e));
//   });

//   it('Should be able to navigate to Messages', done => {
//     router.navigate(['Messages']).then(() => {
//       expect(location.path()).toBe('/messages/new/');
//       done();
//     }).catch(e => done.fail(e));
//   });
// });
