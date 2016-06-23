import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {Observable} from 'rxjs';

import {CookieUtil} from '../../app/shared/core';

import {
  UnreadMessagesCounterService,
  NewConnectionsCounterService
} from '../../common/services';
import {WebsocketService} from '../../app/shared/services';

import {CounterComponent} from './counter';

@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  providers: [
    UnreadMessagesCounterService,
    NewConnectionsCounterService
  ],
  directives: [
    RouterLink,
    CounterComponent
  ]
})
export class NavigationMobileComponent implements OnInit {

  public messagesCounter: Observable<number>;
  public connectionsCounter: Observable<number>;
  public username: string = CookieUtil.getValue('user_username');

  constructor(
    private messagesService: UnreadMessagesCounterService,
    private connectionsService: NewConnectionsCounterService,
    private websocketService: WebsocketService
  ) {
    this.messagesCounter = messagesService.counter$;
    this.connectionsCounter = connectionsService.counter$;
  }

  ngOnInit(): any {
    // Refresh unread messages counter.
    this.messagesService.refresh();

    // Refresh new connections counter.
    this.connectionsService.refresh();

    // If new message received via websocket, increase unread messages counter state.
    this.websocketService.on('messages:new').subscribe((data: any) => {
      this.messagesService.increase();
    });

    // If new connection message received via websocket, increase new connections counter state.
    this.websocketService.on('connections:new').subscribe((data: any) => {
      this.connectionsService.increase();
    });
  }
}
