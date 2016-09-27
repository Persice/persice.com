import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-edit-footer',
  templateUrl: './edit-footer.html'
})
export class EditFooterComponent {
  @Input() loadingEdit: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();
}
