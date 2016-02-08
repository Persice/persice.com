import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[sortable]',
  properties: [
    'items'
  ]
})
export class SortableDirective {
  el: ElementRef;
  items;
  timeout;
  instance;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    let options = {
      items: this.items
    };

    this.instance = jQuery(this.el.nativeElement).sortable(options);

  }

  ngOnDestroy() {


  }
}
