/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, NgIf} from 'angular2/angular2';

import {GenderPipe} from '../../pipes/gender.pipe';
import {SearchResultUserModel} from '../../models/searchresults.model';
import {ImageStretchDirective} from '../../directives/imagestretch.directive';

let view = require('./searchresultsuser.html');

@Component({
    inputs: ['user'],
    selector: 'searchresult-user'
})
@View({
    pipes: [GenderPipe],
    template: view,
    directives: [NgIf, ImageStretchDirective]

})
export class SearchResultsUserComponent {
    user: SearchResultUserModel;
    constructor() {

    }
}
