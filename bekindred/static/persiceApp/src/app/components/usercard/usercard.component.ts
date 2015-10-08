/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive} from 'angular2/angular2';

import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {GenderPipe} from '../../pipes/gender.pipe';

let view = require('./usercard.html');

@Component({
    inputs: ['user'],
    selector: 'user-card'
})
@View({
    pipes: [GenderPipe],
    template: require('./usercard.html'),
    directives: [CircleProgressDirective]

})
export class UserCardComponent {
    user: any;
    constructor() {

    }
}
