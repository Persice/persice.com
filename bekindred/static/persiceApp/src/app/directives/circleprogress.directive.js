"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var CircleProgressDirective = (function () {
    function CircleProgressDirective(el) {
        this.el = el;
    }
    CircleProgressDirective.prototype.ngOnInit = function () {
        if (jQuery(this.el.nativeElement).data('circle-progress') === undefined) {
            jQuery(this.el.nativeElement).circleProgress({
                value: this.calculateValue(parseFloat(this.value)),
                size: parseInt(this.size, 10),
                thickness: parseInt(this.thickness, 10),
                startAngle: parseInt(this.angle, 10),
                fill: {
                    color: this.color ? this.color : '#39c9f5'
                },
                reverse: this.reverse === 'true' ? true : false
            });
        }
    };
    CircleProgressDirective.prototype.ngOnChanges = function (changes) {
        if (jQuery(this.el.nativeElement).data('circle-progress') !== undefined) {
            jQuery(this.el.nativeElement).circleProgress({ 'value': this.calculateValue(changes.value.currentValue) });
        }
    };
    CircleProgressDirective.prototype.ngOnDestroy = function () {
        jQuery(this.el.nativeElement).off('circle-progress');
        jQuery(this.el.nativeElement).unbind('circle-progress');
    };
    CircleProgressDirective.prototype.calculateValue = function (value) {
        return parseInt(value, 10) / 100;
    };
    CircleProgressDirective = __decorate([
        core_1.Directive({
            selector: '[circle-progress]',
            properties: ['value: circle-progress', 'size', 'thickness', 'angle', 'reverse', 'color']
        }),
        __param(0, core_1.Inject(core_1.ElementRef))
    ], CircleProgressDirective);
    return CircleProgressDirective;
}());
exports.CircleProgressDirective = CircleProgressDirective;
