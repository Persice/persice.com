import {Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {CheckImageDirective} from '../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-network-preview',
  template: require('./network-preview.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkPreviewComponent {

  // When [items] from Input property change, set internal state for our component
  @Input() set items(itemsList: any[]) {
    this.connections = itemsList;
  }

  @Input() otherConnectionsCount: number = 0;
  @Input() mutualConnectionsCount: number = 0;
  @Input() type: string;

  // List and counter for all connections
  public connections: any[];

}
