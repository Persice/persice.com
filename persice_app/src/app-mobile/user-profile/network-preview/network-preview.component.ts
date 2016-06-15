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

  // When count from Input property changes, set internal state for our component
  @Input() set count(count: number) {
    this.connectionsCount = count;
  }

  // List and counter for all connections
  public connections: any[];

  // Counter for total number of all connections
  public connectionsCount: number = 0;

}
