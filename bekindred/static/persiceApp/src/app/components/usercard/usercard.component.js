"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var circleprogress_directive_1 = require('../../directives/circleprogress.directive');
var gender_pipe_1 = require('../../pipes/gender.pipe');
var util_1 = require('../../core/util');
var view = require('./usercard.html');
var UserCardComponent = (function () {
    function UserCardComponent() {
        this.interests = [];
        this.onClick = new core_1.EventEmitter;
        this.passEvent = new core_1.EventEmitter;
        this.acceptEvent = new core_1.EventEmitter;
        this.passIsActive = false;
        this.acceptIsActive = false;
    }
    UserCardComponent.prototype.passUser = function (event) {
        var _this = this;
        this.acceptIsActive = false;
        if (this.timeoutAccept) {
            window.clearTimeout(this.timeoutAccept);
        }
        if (this.passIsActive) {
            return;
        }
        this.passIsActive = true;
        if (this.timeoutPass) {
            window.clearTimeout(this.timeoutPass);
        }
        this.timeoutPass = setTimeout(function () {
            _this.passEvent.next({ user: _this.user.id, next: false });
        }, 1500);
    };
    UserCardComponent.prototype.acceptUser = function (event) {
        var _this = this;
        this.passIsActive = false;
        if (this.timeoutPass) {
            window.clearTimeout(this.timeoutPass);
        }
        if (this.acceptIsActive) {
            return;
        }
        this.acceptIsActive = true;
        if (this.timeoutAccept) {
            window.clearTimeout(this.timeoutAccept);
        }
        this.timeoutAccept = setTimeout(function () {
            _this.acceptEvent.next({ user: _this.user.id, next: false });
        }, 1500);
    };
    UserCardComponent.prototype.userClicked = function () {
        this.onClick.next(this.user.id);
    };
    UserCardComponent.prototype.ngAfterContentInit = function () {
        this.interests = util_1.ObjectUtil.firstSorted(this.user.top_interests[0], 3);
        if (!this.user.image) {
            this.user.image = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
        }
        else {
            //fix if no image present
            if (this.user.image && this.user.image === '' && this.user.gender === 'm') {
                this.user.image = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
            }
            if (this.user.image && this.user.image === '' && this.user.gender === 'f') {
                this.user.image = '/static/persiceApp/src/assets/images/avatar_user_f.jpg';
            }
            if (this.user.image && this.user.image === '' && this.user.gender === '') {
                this.user.image = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
            }
        }
    };
    __decorate([
        core_1.Input()
    ], UserCardComponent.prototype, "showButtons");
    __decorate([
        core_1.Output()
    ], UserCardComponent.prototype, "onClick");
    __decorate([
        core_1.Output()
    ], UserCardComponent.prototype, "passEvent");
    __decorate([
        core_1.Output()
    ], UserCardComponent.prototype, "acceptEvent");
    UserCardComponent = __decorate([
        core_1.Component({
            inputs: ['user'],
            selector: 'user-card',
            pipes: [gender_pipe_1.GenderPipe],
            template: view,
            directives: [circleprogress_directive_1.CircleProgressDirective]
        })
    ], UserCardComponent);
    return UserCardComponent;
}());
exports.UserCardComponent = UserCardComponent;
