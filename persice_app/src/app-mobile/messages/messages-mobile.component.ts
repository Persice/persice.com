import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {ConversationsMobileComponent} from './conversations';

@Component({
  selector: 'prs-mobile-messages',
  template: require('./messages-mobile.html'),
  directives: [RouterOutlet]
})
@RouteConfig([
  {
    path: '/',
    component: ConversationsMobileComponent,
    name: 'Conversations',
    useAsDefault: true
  }
])
export class MessagesMobileComponent {

}
