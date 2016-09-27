import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '.profile-networks',
  templateUrl: './networks.html'
})
export class NetworksComponent {
  @Input() url: any;
  @Input() editable: boolean;
  @Output() openEdit: EventEmitter<any> = new EventEmitter();
}
