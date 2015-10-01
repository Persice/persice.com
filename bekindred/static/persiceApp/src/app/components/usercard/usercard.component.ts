/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, Pipe, Injectable} from 'angular2/angular2';


// We use the @Pipe decorator to register the name of the pipe
@Pipe({
  name: 'gender'
})
@Injectable()
class GenderPipe {
  transform(value: string, args: any[]) {
    if (value === 'f') {
      return 'female';
    }
    else {
      return 'male';
    }

    return;
  }
}



let view = require('./usercard.html');

@Component({
  properties: ['user'],
  selector: 'user-card'
})
@View({
  pipes: [GenderPipe],
  template: require('./usercard.html')

})
export class UserCardComponent {
  user: any;
  constructor() {

  }
}
