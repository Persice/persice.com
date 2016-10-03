import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PhotosService } from '../../../../common/services/photos.service';
import { UserService } from '../../../../common/services/user.service';
import { ListUtil } from '../../../../common/core/util';

@Component({
  selector: 'prs-edit-photos',
  templateUrl: './edit-photos.html',
  providers: [ PhotosService ]
})
export class EditPhotosComponent implements OnDestroy {
  @Input() set photos(values: any[]) {
    this.assignPhotos(values);
  };

  @Input() loading: boolean;
  @Input() default;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() refreshPhotos: EventEmitter<any> = new EventEmitter();
  @Output() loadingPhotos: EventEmitter<any> = new EventEmitter();
  @Output() openAlbums: EventEmitter<any> = new EventEmitter();

  profilePhotos: any[] = [];
  drakeInstance;
  deleteDisabled: boolean = false;
  photosServiceSubscriberUpdate: Subscription;

  constructor(private photosService: PhotosService, private userService: UserService) { }

  ngOnDestroy() {
    if (this.drakeInstance) {
      this.drakeInstance.destroy();
    }
  }

  assignPhotos(photos) {
    // Disable delete photo if only one photo exists
    if (photos.length > 1) {
      this.deleteDisabled = false;
    } else {
      this.deleteDisabled = true;
    }

    this.profilePhotos = [
      {
        cropped_photo: '',
        id: null,
        order: 0,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 1,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 2,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 3,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 4,
        photo: '',
        resource_uri: '',
        user: ''
      },
    ];
    for (var i = 0; i < photos.length; ++i) {
      for (var j = 0; j < this.profilePhotos.length; ++j) {
        if (photos[ i ].order === this.profilePhotos[ j ].order) {
          this.profilePhotos[ j ] = photos[ i ];
        }
      }

    }

    this.profilePhotos = ListUtil.orderBy(this.profilePhotos, [ 'order' ], [ 'asc' ]);
    setTimeout(() => {
      this.initializeDragAndDrop();
    }, 100);
  }

  checkOrderAndOpenAlbums(event) {
    for (var j = 0; j < this.profilePhotos.length; ++j) {
      if (this.profilePhotos[ j ].id === null) {
        this.openAlbums.emit(this.profilePhotos[ j ].order);
        return;
      }
    }
  }

  initializeDragAndDrop() {
    if (!!this.drakeInstance) {
      this.drakeInstance.destroy();
    }

    this.drakeInstance = dragula([
      document.getElementById('profile-photo-big'),
      document.getElementById('profile-photos')
    ]);

    this.drakeInstance.on('drop', (el, target, source, sibling) => {
      // Remove class added in 'over' event
      el.classList.remove('is-over-target');

      // Override default behavior only if we are moving images from one to
      // another container
      if (target.id === source.id) {

        let items = jQuery('.profile-edit__photos__thumb-photo-container').children();

        let arrayOfIds = jQuery.map(items, (n, i) => {
          return parseInt(n.id.match(/\d+/g)[ 0 ], 10);
        });
        this.reorderPhoto(arrayOfIds);
        return true;
      }
      // Cancel default behavior
      this.drakeInstance.cancel(true);

      if (sibling === null) {
        sibling = jQuery(target).children().last()[ 0 ];
      }

      // replace main profile background image
      let styleEl = jQuery(`#${el.id}`).css('background-image');
      let styleSibling = jQuery(`#${sibling.id}`).css('background-image');
      jQuery(`#${el.id}`).css('background-image', styleSibling);
      jQuery(`#${sibling.id}`).css('background-image', styleEl);

      this.changeProfileImage({
        src: parseInt(el.id.match(/\d+/g)[ 0 ], 10),
        dst: parseInt(sibling.id.match(/\d+/g)[ 0 ], 10)
      });

    });

    this.drakeInstance.on('over', (el, target, source) => {
      // Add class to element as soon as it gets added to the target container.
      // It makes sure that image is proper size for the target container.
      jQuery(el).toggleClass('is-over-target', target.id !== source.id);
    });
  }

  private deletePhoto(photo): void {
    this.loadingPhotos.emit(true);
    this.photosService.delete(photo.resource_uri, (res) => {
      // if (res === -1) {
      //   this.loadingPhotos.emit(false);
      //   return;
      // }
      this.refreshPhotos.emit(true);
      // if deleting main profile photo, refresh profile photo in upper right corner
      if (photo.order === 0) {
        this.userService.getProfileUpdates();
      }
    });
  }

  private reorderPhoto(event): void {
    this.loadingPhotos.emit(true);
    if (this.photosServiceSubscriberUpdate) {
      this.photosServiceSubscriberUpdate.unsubscribe();
    }

    for (var i = 1; i < this.profilePhotos.length; ++i) {
      for (var j = 0; j < event.length; ++j) {
        if (this.profilePhotos[ i ].id === event[ j ]) {
          let order = j + 1;
          this.profilePhotos[ i ].order = order;
        }
      }
    }
    let data = this.profilePhotos.slice(1);

    this.photosServiceSubscriberUpdate = this.photosService.batchUpdateOrder(data)
      .subscribe(() => {
        this.loadingPhotos.emit(false);
      }, err => {
        console.log('could not update order of photos ', err);
        this.loadingPhotos.emit(false);
      });
  }

  private changeProfileImage(event): void {
    this.loadingPhotos.emit(true);
    let srcIdx = ListUtil.findIndex(this.profilePhotos, { id: event.src });
    let dstIdx = ListUtil.findIndex(this.profilePhotos, { id: event.dst });

    let srcImg = JSON.parse(JSON.stringify(this.profilePhotos[ srcIdx ]));
    let dstImg = JSON.parse(JSON.stringify(this.profilePhotos[ dstIdx ]));

    srcImg.order = this.profilePhotos[ dstIdx ].order;
    dstImg.order = this.profilePhotos[ srcIdx ].order;

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
        this.loadingPhotos.emit(false);
        return;
      }

      this.photosService.updateOrder({ order: 0, resource_uri: profilePhoto.resource_uri },
        profilePhoto.resource_uri, (res) => {
          if (res === -1) {
            this.loadingPhotos.emit(false);
            return;
          }
          this.userService.getProfileUpdates();
          this.refreshPhotos.emit(true);
        });
    });
  }
}
