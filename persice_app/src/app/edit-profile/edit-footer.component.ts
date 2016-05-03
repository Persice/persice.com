import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'prs-edit-footer',
  template: require('./edit-footer.html')
})
export class EditFooterComponent {
  @Input() loadingEdit;
  @Output() close: EventEmitter<any> = new EventEmitter();
}
