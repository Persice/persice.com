import {Directive, ElementRef, Output, EventEmitter, OnInit} from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[minimalect]'
})
export class SelectDirective implements OnInit {
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();

  constructor(public el: ElementRef) { }

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
