import {Component, Directive, ElementRef, Renderer} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HeaderMainComponent} from './components/headermain/headermain.component';
import {HeaderSubComponent} from './components/headersub/headersub.component';

import {ConnectionsComponent} from './components/connections/connections.component';
import {CrowdComponent} from './components/crowd/crowd.component';

@Component({
  selector: 'app',
  directives: [
    ...ROUTER_DIRECTIVES,
    HeaderMainComponent,
    HeaderSubComponent,
    ConnectionsComponent,
    CrowdComponent
  ],
  template: `
  <header-main></header-main>
  <div class="page-content">
    <header-sub [image]="image"></header-sub>
    <router-outlet></router-outlet>
  </div>
  `
})
@RouteConfig([
  { path: '/connections', component: ConnectionsComponent, name: 'Connections' },
  { path: '/crowd', component: CrowdComponent, name: 'Crowd', useAsDefault: true },
])
export class App {
  image = '/assets/images/empty_avatar.png';
}
