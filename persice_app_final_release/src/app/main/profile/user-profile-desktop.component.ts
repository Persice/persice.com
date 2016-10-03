import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConnectionsService } from '../../../common/connections/connections.service';
import { LikesService } from '../../../common/services/likes.service';
import { MutualConnectionsService } from '../../../common/services/mutual-connections.service';
import { PhotosService } from '../../../common/services/photos.service';
import { Person } from '../../../common/models/person/person';
import { ListUtil } from '../../../common/core/util';
import { Location } from '@angular/common';

@Component({
  selector: 'prs-profile-my',
  templateUrl: './user-profile-desktop.html',
  providers: [
    ConnectionsService,
    LikesService,
    MutualConnectionsService,
    PhotosService
  ]
})
export class UserProfileDesktopComponent implements OnInit {
  @Input() count: number;
  @Input() currentIndex: number;
  @Input() type: string;

  @Input() set user(value) {
    if (value) {
      this._setState(value);
    }
  }

  @Output() reloadUser: EventEmitter<any> = new EventEmitter();

  person: Person;
  section: string = 'profile';

  profilePhotos: any[] = [];
  profileConnections: any[] = [];
  profileLikes: any[] = [];

  loadingLikes: boolean = false;
  loadingConnections: boolean = false;
  loadingPhotos: boolean = false;

  active: boolean = false;

  galleryActive: boolean = false;
  galleryOptions = JSON.stringify({
    hashTracking: false,
    closeOnOutsideClick: true
  });

  constructor(
    protected connectionsService: ConnectionsService,
    protected mutualConnectionsService: MutualConnectionsService,
    protected photosService: PhotosService,
    protected likesService: LikesService,
    protected location: Location
  ) { }

  ngOnInit(): any {
    // listen for event when gallery modal is closed
    jQuery(document).on('closed', '.remodal', (e) => {
      this.galleryActive = false;
    });

    setTimeout(() => {
      jQuery('#userprofile').focus();
      window.scrollTo(0, 0);
    });
  }

  closeProfile(): void {
    this.location.back();
  }

  openGallery(event) {
    let remodal = jQuery('[data-remodal-id=modal-gallery]').remodal();
    remodal.open();
    this.galleryActive = true;
  }

  public refreshUser(event: any): void {
    this.reloadUser.emit(true);
  }

  public refreshPhotos(event: any): void {
    this.getPhotos();
  }

  openEdit(section): void {
    let remodal = jQuery('[data-remodal-id=profile-edit]').remodal();
    remodal.open();
    this.active = true;
    this.section = section;
  }

  eventHandler(key): void {
    switch (key) {
      case 27: //escape
        this.closeProfile();
        break;
      default:
        break;
    }
  }

  protected get friendsTitle(): string {
    return this.type === 'my-profile' ? 'Connections' : 'Mutual Connections';
  }

  protected _setState(user: any): void {
    this.person = new Person(user);

    if (this.type !== 'my-profile') {
      this.getMutualConnections();
    } else {
      this.getConnections();
    }
    this.getLikes();
    this.getPhotos();
  }

  private getConnections(): void {
    this.loadingConnections = true;

    this.connectionsService.get('', 100)
      .subscribe(connections => {
        this.profileConnections = connections.objects;
        this.loadingConnections = false;
      }, () => {
      });
  }

  private getLikes(): void {
    this.loadingLikes = true;
    this.likesService.get('', 100, this.person.id)
      .subscribe(likes => {
        this.profileLikes = likes.objects;
        this.loadingLikes = false;
      }, () => {});
  }

  private getMutualConnections(): void {
    this.loadingConnections = true;

    this.mutualConnectionsService.get(this.person.id, 200)
      .subscribe(connections => {
        this.profileConnections = connections.objects;
        this.loadingConnections = false;
      }, () => {});
  }

  private getPhotos(): void {
    this.loadingPhotos = true;

    this.photosService.get('', 6, +this.person.id)
      .subscribe(photos => {
        this.assignPhotos(photos);
        this.loadingPhotos = false;
      }, () => {});
  }

  private assignPhotos(data): void {
    this.profilePhotos = [];
    if (data.meta.total_count > 0) {
      this.profilePhotos = ListUtil.orderBy(data.objects, [ 'order' ], [ 'asc' ]);
    }
  }
}
