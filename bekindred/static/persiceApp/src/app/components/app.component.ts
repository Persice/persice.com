/// <reference path="../../typings/_custom.d.ts" />

/*
 * Angular 2 decorators and services
 */
import {Directive, Component, View, ElementRef} from 'angular2/angular2';
import {RouteConfig, Router} from 'angular2/router';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/*
 * Components
 */


import {HeaderMainComponent} from './headermain/headermain.component';
import {HeaderSubComponent} from './headersub/headersub.component';
import {UsersListComponent} from './userslist/userslist.component';
import {FilterComponent} from './filter/filter.component';


import {AuthUserModel} from '../models/user.model';
import {FilterModel, InterfaceFilter} from '../models/filter.model';


let view = require('./app.html');

const defaultFilters: InterfaceFilter = {
  distance: 10000,
  distance_unit: 'miles',
  keyword: '',
  gender: 'm,f',
  min_age: '25',
  max_age: '60',
  order_criteria: 'match_score'
};

/*
 * Persice App Component
 * Top Level Component
 */
@Component({
  selector: 'persice-app',
  viewBindings: [HTTP_BINDINGS]
})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    HeaderMainComponent,
    HeaderSubComponent,
    UsersListComponent,
    FilterComponent
  ],
  styles: [`
   `],
  template: view
})
export class AppComponent {
  crowd: Array<any>;
  user: AuthUserModel;
  image: string;
  filters: FilterModel;
  constructor(public http: Http) {
    this.image = '';
  }
  onInit() {
    // set initial filters for Crowd page
    this.filters = new FilterModel(defaultFilters);

    // Crowd page load users list
    this.http.get('/api/v1/matchfeed/?format=json&filter=true')
      .toRx()
      .map(res => res.json())
      .subscribe(data => this.crowd = data.objects);

    // Get AuthUser info for the app
    this.http.get('/api/v1/me/?format=json')
      .toRx()
      .map(res => res.json())
      .subscribe(data => this.assignAuthUser(data));
  }

  // Assign AuthUser user from the /me Api
  assignAuthUser(data) {
    this.user = new AuthUserModel(data.objects[0]);
    this.image = this.user.info.image;
  }




}
