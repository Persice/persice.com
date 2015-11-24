/// <reference path="../../../typings/_custom.d.ts" />

import {
iit,
it,
ddescribe,
describe,
expect,
inject,
injectAsync,
TestComponentBuilder,
beforeEachProviders,
fakeAsync,
tick
} from 'angular2/testing';

import {DOM} from 'angular2/src/core/dom/dom_adapter';

import {Component, View, provide} from 'angular2/angular2';

import {EventCardComponent} from './eventcard.component';

import {event} from './eventcard.component.mock';

import {ObjectUtil, DateUtil} from '../../core/util';


declare var dump: any;
declare var jasmine: any;

// Create a test component to test directives
@Component({
  template: '',
  directives: [EventCardComponent]
})
class TestComponent {
  eventTest = event;
  onUserClicked(event) {

  }
}

describe('UserCard component', () => {
  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><event-card [event]="eventTest"></event-card></div>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let eventCardInstance = fixture.debugElement.componentInstance;
        let eventCardDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);

      });
  }));

  it('should display event image', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><event-card [event]="eventTest"></event-card></div>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;


        let image = 'url(http://localhost:9876' + event.event_photo + ')';

        let el = DOM.querySelectorAll(componentDOMEl, '.card--event__img__holder')[0];
        let imageBackground = DOM.getStyle(el, 'background-image');

        expect(imageBackground).toEqual(image);


      });
  }));


  it('should display event name, date, location, distance, score and attendees', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><event-card [event]="eventTest"></event-card></div>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        let date = DateUtil.format(event.starts_on, 'ddd, D MMM YYYY');

        expect(DOM.querySelector(componentDOMEl, 'h4.card-title').textContent).toEqual(event.name);

        expect(DOM.querySelector(componentDOMEl, 'p.card-subtitle').textContent.trim()).toEqual('Central Park / New York');
        expect(DOM.querySelector(componentDOMEl, '.eventdate').textContent.trim()).toEqual(date);
        expect(DOM.querySelector(componentDOMEl, '.eventdistance').textContent.trim()).toEqual('6,898 km');
        expect(DOM.querySelector(componentDOMEl, '.eventscore').textContent.trim()).toEqual('20 Similar');
        expect(DOM.querySelector(componentDOMEl, '.eventattendees').textContent.trim()).toEqual('10 Connections');
      });
  }));

});