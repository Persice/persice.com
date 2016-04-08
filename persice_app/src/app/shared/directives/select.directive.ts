import {Directive, ElementRef, Output, EventEmitter} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[minimalect]'
})
export class SelectDirective {
  el: ElementRef;
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();

  constructor( el: ElementRef) {
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
