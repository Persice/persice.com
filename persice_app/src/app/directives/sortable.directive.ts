import {Directive, ElementRef, Inject, Output, EventEmitter} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[sortable]',
  properties: [
    'items'
  ]
})
export class SortableDirective {
  @Output() positionChanged: EventEmitter<any> = new EventEmitter();
  el: ElementRef;
  items;
  timeout;
  instance;


  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    let options = {
      items: this.items,
      update: (event, ui) => {
        let order = [];
        order = this.instance.sortable('toArray', { attribute: 'id' });
        console.log(order);
        this.positionChanged.next(order);
      }
    };

    this.instance = jQuery(this.el.nativeElement).sortable(options);

  }

  ngOnDestroy() {
    if (this.instance) {
      this.instance.sortable('destroy');
    }

  }
}
