import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[minimalect]',
  outputs: ['selectedValue']
})
export class SelectDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {
    let changeCounter = 0;

    jQuery(this.el.nativeElement).minimalect({
      searchable: false,
      onchange: (value) => {
        changeCounter++;
        if (changeCounter % 2 === 0) {
          this.selectedValue.next(value);
        }
      }
    });


  }

}
