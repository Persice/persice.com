/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, NgIf} from 'angular2/angular2';

import {ImageStretchDirective} from '../../directives/imagestretch.directive';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {GenderPipe} from '../../pipes/gender.pipe';

let view = require('./usercard.html');

@Component({
    inputs: ['user'],
    selector: 'user-card'
})
@View({
    pipes: [GenderPipe],
    template: view,
    directives: [CircleProgressDirective, ImageStretchDirective, NgIf]

})
export class UserCardComponent {
    user: any;
    constructor() {

    }
}
