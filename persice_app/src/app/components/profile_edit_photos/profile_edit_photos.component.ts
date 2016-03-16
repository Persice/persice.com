import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ListUtil} from '../../core/util';

/**
 * Components
 */
import {ProfileEditFooterComponent} from '../profile_edit_footer/profile_edit_footer.component';

import {CheckImageDirective} from '../../directives/checkimage.directive';

let view = require('./profile_edit_photos.html');


@Component({
  selector: 'profile-edit-photos',
  template: view,
  directives: [
    ProfileEditFooterComponent,
    CheckImageDirective
  ]
})
export class ProfileEditPhotosComponent {
  @Input() photos;
  @Input() loading;
  @Input() default;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() changeProfilePhoto: EventEmitter<any> = new EventEmitter();
  @Output() openAlbums: EventEmitter<any> = new EventEmitter();
  profilePhotos = [];
  drakeInstance;
  deleteDisabled = true;

  ngOnChanges(values) {
    if (values.photos && values.photos.currentValue) {
      this.assignPhotos(values.photos.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.drakeInstance) {
      this.drakeInstance.destroy();
    }

  }

  deletePhoto(photo) {
    this.delete.next(photo);
  }

  assignPhotos(photos) {
    if (photos.length > 1) {
      this.deleteDisabled = false;
    }
    else {
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
        if (photos[i].order === this.profilePhotos[j].order) {
          this.profilePhotos[j] = photos[i];
        }
      }

    }

    this.profilePhotos = ListUtil.orderBy(this.profilePhotos, ['order'], ['asc']);
    setTimeout(() => {
      this.initializeDragAndDrop();
    });
  }

  checkOrderAndOpenAlbums(event) {
    for (var j = 0; j < this.profilePhotos.length; ++j) {
      if (this.profilePhotos[j].id === null) {
        this.openAlbums.next(this.profilePhotos[j].order);
        return;
      }
    }
  }


  initializeDragAndDrop() {

    if (this.drakeInstance) {
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
          return parseInt(n.id.match(/\d+/g)[0], 10);
        });
        this.reorder.emit(arrayOfIds);
        return true;
      }
      // Cancel default behavior
      this.drakeInstance.cancel(true);


      if (sibling === null) {
        sibling = jQuery(target).children().last()[0];
      }


      // replace main profile background image
      let styleEl = jQuery(`#${el.id}`).css('background-image');
      let styleSibling = jQuery(`#${sibling.id}`).css('background-image');
      jQuery(`#${el.id}`).css('background-image', styleSibling);
      jQuery(`#${sibling.id}`).css('background-image', styleEl);


      this.changeProfilePhoto.emit({
        src: parseInt(el.id.match(/\d+/g)[0], 10),
        dst: parseInt(sibling.id.match(/\d+/g)[0], 10)
      });


    });

    this.drakeInstance.on('over', (el, target, source) => {
      // Add class to element as soon as it gets added to the target container.
      // It makes sure that image is proper size for the target container.
      jQuery(el).toggleClass('is-over-target', target.id !== source.id);
    });
  }
}
