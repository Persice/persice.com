import {Component, Input} from 'angular2/core';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./eventpeoplelist.html');

@Component({
  template: view,
  selector: 'event-peoplelist',
  directives: [SlickDirective]
})
export class EventPeopleListComponent {
  @Input() people;
  @Input() count;
}
