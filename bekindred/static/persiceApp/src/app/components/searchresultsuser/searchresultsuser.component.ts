/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, NgIf} from 'angular2/angular2';

import {GenderPipe} from '../../pipes/gender.pipe';
import {SearchResultUserModel} from '../../models/searchresults.model';

let view = require('./searchresultsuser.html');

@Component({
    inputs: ['user'],
    selector: 'searchresult-user'
})
@View({
    pipes: [GenderPipe],
    template: view,
    directives: [NgIf]

})
export class SearchResultsUserComponent {
    user: SearchResultUserModel;
    constructor() {

    }
}
