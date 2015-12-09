import {Component} from 'angular2/angular2';
import {RouterLink } from 'angular2/router';

let view = require('./messages.html');
@Component({
  selector: 'message',
  template: view,
  directives: [RouterLink]
})
export class MessagesComponent {
  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
