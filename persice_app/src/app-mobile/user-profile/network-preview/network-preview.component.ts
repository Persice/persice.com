import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CheckImageDirective } from '../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-network-preview',
  template: <any>require('./network-preview.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkPreviewComponent {
  @Input() set connections(data: any[]) {
    this.items = data;

    // Fill array for displaying empty places
    const length: number = 4 - data.length;
    this.emptyPlacesArray = Array(length).fill(1).map((x, i) => i);
  };

  @Input() connectionsTotalCount: number;
  @Input() mutualConnectionsTotalCount: number = 0;
  @Input() type: string;
  @Input() ownerName: string;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  public items: any[];
  public emptyPlacesArray: any[];

  public openConnections(event: MouseEvent) {
    if (this.items.length > 0) {
      this.onClick.emit(event);
    }
  }
}
