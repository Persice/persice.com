import {Directive, ElementRef, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[toggle-filter]',
  properties: ['class: toggle-filter'],
  host: {
    '(click)': 'onClick($event)'
  }
})
export class ToggleFilterDirective {
  el: ElementRef;
  class: string;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onClick(event: Event) {
    jQuery('body').toggleClass(this.class);
  }



}
