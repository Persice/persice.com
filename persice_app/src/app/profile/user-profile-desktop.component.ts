import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListUtil } from '../../common/core/';
import { AvatarComponent } from './avatar/avatar.component';
import { AboutComponent } from './about/about.component';
import { LikesComponent } from './likes/likes.component';
import { FriendsComponent } from './connections/friends.component';
import { NetworksComponent } from './networks/networks.component';
import { ItemsComponent } from './item/items.component';
import { EditProfileComponent } from '../edit-profile';
import { LoadingComponent } from '../shared/components/loading';
import { RemodalDirective } from '../shared/directives';
import {
  PhotosService,
  LikesService
} from '../shared/services';
import { ConnectionsService } from '../../common/connections';
import { Person } from '../../common/models/person/person';
import { AcceptPassComponent } from './acceptpass/acceptpass.component';
import { MutualConnectionsService } from '../../app-mobile/user-profile/network-mutual-connections/mutual-connections.service';
import { GalleryComponent } from './gallery/gallery.component';

@Component({
  selector: 'prs-profile-my',
  template: <any>require('./user-profile-desktop.html'),
  directives: [
    AvatarComponent,
    AboutComponent,
    AcceptPassComponent,
    FriendsComponent,
    GalleryComponent,
    LikesComponent,
    NetworksComponent,
    ItemsComponent,
    EditProfileComponent,
    RemodalDirective,
    LoadingComponent
  ],
  providers: [
    ConnectionsService,
    LikesService,
    MutualConnectionsService,
    PhotosService
  ]
})
export class UserProfileDesktopComponent implements OnInit {

  @Input() type: string;
  @Input() set user(value) {
    if (value) {
      this._setState(value);
    }
  }
  @Output() reloadUser: EventEmitter<any> = new EventEmitter();

  protected person: Person;
  protected section: string = 'profile';

  protected profilePhotos: any[] = [];
  protected profileConnections: any[] = [];
  protected profileLikes: any[] = [];

  protected loadingLikes: boolean = false;
  protected loadingConnections: boolean = false;
  protected loadingPhotos: boolean = false;

  protected active: boolean = false;

  protected galleryActive: boolean = false;
  protected galleryOptions = JSON.stringify({
    hashTracking: false,
    closeOnOutsideClick: true
  });

  constructor(
    protected connectionsService: ConnectionsService,
    protected mutualConnectionsService: MutualConnectionsService,
    protected photosService: PhotosService,
    protected likesService: LikesService
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
    window.history.back(-1);
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

  private openEdit(section): void {
    let remodal = jQuery('[data-remodal-id=profile-edit]').remodal();
    remodal.open();
    this.active = true;
    this.section = section;
  }

  protected eventHandler(key): void {
    switch (key) {
      case 27: //escape
        this.closeProfile();
        break;
      default:
        break;
    }
  }

  private assignPhotos(data): void {
    this.profilePhotos = [];
    if (data.meta.total_count > 0) {
      this.profilePhotos = ListUtil.orderBy(data.objects, ['order'], ['asc']);
    }
  }
}
