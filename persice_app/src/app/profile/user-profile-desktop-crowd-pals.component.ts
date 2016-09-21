import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { AvatarComponent } from './avatar/avatar.component';
import { AboutComponent } from './about/about.component';
import { LikesComponent } from './likes/likes.component';
import { NetworksComponent } from './networks/networks.component';
import { ItemsComponent } from './item/items.component';
import { AcceptPassComponent } from './acceptpass/acceptpass.component';
import { LoadingComponent } from '../shared/components/loading';
import { RemodalDirective } from '../shared/directives';
import { PhotosService } from '../shared/services';
import { UserProfileDesktopComponent } from './user-profile-desktop.component';
import { MutualConnectionsService } from '../../app-mobile/user-profile/network-mutual-connections/mutual-connections.service';
import { ConnectionsService } from '../../common/connections/connections.service';
import { LikesService } from '../shared/services/likes.service';
import { UserService } from '../shared/services/user.service';
import { FriendsComponent } from './connections/friends.component';

@Component({
  selector: 'prs-profile-crowd-pals',
  template: <any>require('./user-profile-desktop.html'),
  directives: [
    AvatarComponent,
    AboutComponent,
    AcceptPassComponent,
    FriendsComponent,
    ItemsComponent,
    LikesComponent,
    LoadingComponent,
    NetworksComponent,
    RemodalDirective,
    ROUTER_DIRECTIVES
  ],
  providers: [
    ConnectionsService,
    LikesService,
    MutualConnectionsService,
    PhotosService,
    UserService
  ]
})
export class UserProfileDesktopCrowdPalsComponent extends UserProfileDesktopComponent implements OnInit, OnDestroy {
  @Input() set profileType(type) {
    if (type) {
      this.type = type;
    }
  }
  @Input() set user(user) {
    if (user) {
      this._setState(user);
    }
  };
  @Input() count: number;
  @Input() currentIndex: number;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  @Output() nextEvent: EventEmitter<any> = new EventEmitter;
  @Output() previousEvent: EventEmitter<any> = new EventEmitter;

  constructor(
    connectionsService: ConnectionsService,
    mutualConnectionsService: MutualConnectionsService,
    photosService: PhotosService,
    likesService: LikesService,
    userMeService: UserService,
  ) {
    super(connectionsService, mutualConnectionsService, photosService, likesService, userMeService);
  }

  ngOnInit(): any {
    super.ngOnInit();
  }

  ngOnDestroy(): any {
    super.ngOnDestroy();
    jQuery(document).off('closed', '.remodal');
  }

  private passUser(event): void {
    this.passEvent.next(event);
  }

  private acceptUser(event): void {
    this.acceptEvent.next(event);
  }

  closeProfile(): void {
    this.closeprofileEvent.next(true);
  }
}
