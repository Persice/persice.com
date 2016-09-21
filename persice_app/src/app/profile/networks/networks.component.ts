import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '.profile-networks',
  template: <any>require('./networks.html')
})
export class NetworksComponent {
  @Input() url: string;
  @Input() editable: boolean;
  @Output() openEdit: EventEmitter<any> = new EventEmitter();
}
