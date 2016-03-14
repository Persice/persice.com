import {Component} from 'angular2/core';

let view = require('./home.html');
@Component({
  selector: 'home',
  template: view
})
export class HomeComponent {

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
