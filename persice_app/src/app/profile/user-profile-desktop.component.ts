import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
  LikesService,
  UserService
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
export class UserProfileDesktopComponent implements OnInit, OnDestroy {

  @Input() type: string;
  @Input() set user(value) {
    if (value) {
      this._setState(value);
    }
  }
  @Output() reloadUser: EventEmitter<any> = new EventEmitter();

  private person: Person;
  private section: string = 'profile';

  private profilePhotos: any[] = [];
  private profileConnections: any[] = [];
  private profileLikes: any[] = [];

  private loadingLikes: boolean = false;
  private loadingConnections: boolean = false;
  private loadingPhotos: boolean = false;

  private active = false;
  private photosServiceSubscriberUpdate;

  private galleryActive: boolean = false;
  private galleryOptions = JSON.stringify({
    hashTracking: false,
    closeOnOutsideClick: true
  });

  constructor(
    protected connectionsService: ConnectionsService,
    protected mutualConnectionsService: MutualConnectionsService,
    protected photosService: PhotosService,
    protected likesService: LikesService,
    protected userMeService: UserService
  ) { }

  ngOnInit(): any {
    //listen for event when gallery modal is closed
    jQuery(document).on('closed', '.remodal', (e) => {
      this.galleryActive = false;
    });

    setTimeout(() => {
      jQuery('#userprofile').focus();
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): any {
    if (this.photosServiceSubscriberUpdate) {
      this.photosServiceSubscriberUpdate.unsubscribe();
    }
  }

  closeProfile(): void {
    window.history.back(-1);
  }

  openGallery(event) {
    console.log('OPENGALERY');
    let remodal = jQuery('[data-remodal-id=modal-gallery]').remodal();
    remodal.open();
    this.galleryActive = true;
  }

  private get friendsTitle(): string {
    return this.type === 'my-profile' ? 'Connections' : 'Mutual Connections';
  }

  private refreshUser(event): void {
    this.reloadUser.emit(true);
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

  private eventHandler(key): void {
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

  private cropAndSavePhoto(photo): void {
    this.loadingPhotos = true;
    this.photosService.save(photo, (res) => {
      this.refreshPhotos();
      if (photo.order === 0) {
        this.userMeService.getProfileUpdates();
      }
    });
  }

  private deletePhoto(photo): void {
    this.loadingPhotos = true;
    this.photosService.delete(photo.resource_uri, (res) => {
      if (res === -1) {
        this.loadingPhotos = false;
        return;
      }
      this.refreshPhotos();
      // if deleting main profile photo, refresh profile photo in upper right corner
      if (photo.order === 0) {
        this.userMeService.getProfileUpdates();
      }
    });
  }

  private refreshPhotos(): void {
    this.loadingPhotos = true;
    this.getPhotos();
  }

  private reorderPhoto(event): void {
    this.loadingPhotos = true;
    if (this.photosServiceSubscriberUpdate) {
      this.photosServiceSubscriberUpdate.unsubscribe();
    }

    for (var i = 1; i < this.profilePhotos.length; ++i) {
      for (var j = 0; j < event.length; ++j) {
        if (this.profilePhotos[i].id === event[j]) {
          let order = j + 1;
          this.profilePhotos[i].order = order;
        }
      }
    }
    let data = this.profilePhotos.slice(1);

    this.photosServiceSubscriberUpdate = this.photosService.batchUpdateOrder(data)
      .subscribe(data => {
        this.loadingPhotos = false;
      }, err => {
        console.log('could not update order of photos ', err);
        this.loadingPhotos = false;
      });
  }

  private changeProfilePhoto(event): void {
    this.loadingPhotos = true;
    let srcIdx = ListUtil.findIndex(this.profilePhotos, {id: event.src});
    let dstIdx = ListUtil.findIndex(this.profilePhotos, {id: event.dst});

    let srcImg = JSON.parse(JSON.stringify(this.profilePhotos[srcIdx]));
    let dstImg = JSON.parse(JSON.stringify(this.profilePhotos[dstIdx]));

    srcImg.order = this.profilePhotos[dstIdx].order;
    dstImg.order = this.profilePhotos[srcIdx].order;

    let profilePhoto;
    let otherPhoto;
    if (srcImg.order === 0) {
      profilePhoto = srcImg;
      otherPhoto = dstImg;
    } else {
      profilePhoto = dstImg;
      otherPhoto = srcImg;
    }

    this.photosService.updateOrder(otherPhoto, otherPhoto.resource_uri, (res) => {
      if (res === -1) {
        this.loadingPhotos = false;
        return;
      }

      this.photosService.updateOrder({order: 0, resource_uri: profilePhoto.resource_uri},
        profilePhoto.resource_uri, (res) => {
          if (res === -1) {
            this.loadingPhotos = false;
            return;
          }
          this.userMeService.getProfileUpdates();
          this.refreshPhotos();
        });
    });
  }
}
