import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UserProfileDesktopComponent } from './user-profile-desktop.component';
import { ConnectionsService } from '../../../common/connections/connections.service';
import { LikesService } from '../../../common/services/likes.service';
import { MutualConnectionsService } from '../../../common/services/mutual-connections.service';
import { PhotosService } from '../../../common/services/photos.service';
import { Location } from '@angular/common';

@Component({
  selector: 'prs-profile-crowd-pals',
  templateUrl: './user-profile-desktop.html',
  providers: [
    ConnectionsService,
    LikesService,
    MutualConnectionsService,
    PhotosService
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
    location: Location
  ) {
    super(connectionsService, mutualConnectionsService, photosService, likesService, location);
  }

  ngOnInit(): any {
    super.ngOnInit();
  }

  ngOnDestroy(): any {
    jQuery(document).off('closed', '.remodal');
  }

  passUser(event): void {
    this.passEvent.emit(event);
  }

  acceptUser(event): void {
    this.acceptEvent.emit(event);
  }

  closeProfile(): void {
    this.closeprofileEvent.emit(true);
  }
}
