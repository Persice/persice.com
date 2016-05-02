import {Component, Input, ChangeDetectionStrategy } from 'angular2/core';
import {CheckImageDirective} from '../../app/shared/directives';

const ITEMS_LIMIT: number = 100;

@Component({
  selector: 'prs-mobile-connections-list',
  template: require('./connections-list-mobile.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsListMobileComponent {

  // When [items] from Input property change, set internal state for our component
  @Input() set items(itemsList: any[]) {
    this.connections = itemsList;
  }

  // When count from Input property changes, set internal state for our component
  @Input() set count(count: number) {
    this.connectionsCount = count;
    if (count > 4) {
      this.moreVisible = true;
    }
  }

  // List and counter for all connections
  public connections: any[];

  // Counter for total number of all connections
  public connectionsCount: number = 0;

  // Indicator for is more button visible
  public moreVisible: boolean = false;

}
