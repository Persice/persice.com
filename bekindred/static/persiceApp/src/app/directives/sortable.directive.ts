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

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    let options = {
      items: this.items
    };

    jQuery(this.el.nativeElement).sortable(options);

  }

  ngOnDestroy() {
    jQuery(this.el.nativeElement).sortable('destroy');
  }
}
