import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Http} from 'angular2/http';
import {ListUtil} from '../../core/util';

/**
 * Directives
 */
import {SortableDirective} from '../../directives/sortable.directive';

/**
 * Components
 */
import {ProfileEditFooterComponent} from '../profile_edit_footer/profile_edit_footer.component';


let view = require('./profile_edit_photos.html');

@Component({
  selector: 'profile-edit-photos',
  template: view,
  directives: [
    SortableDirective,
    ProfileEditFooterComponent
  ]
})
export class ProfileEditPhotosComponent {
  @Input() photos;
  @Input() default;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() openAlbums: EventEmitter<any> = new EventEmitter();
  profilePhotos = [];
  loading: boolean = false;

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges(values) {
    if (values.photos && values.photos.currentValue) {
      this.assignPhotos(values.photos.currentValue);
    }
  }

  assignPhotos(photos) {
    this.profilePhotos = ListUtil.orderBy(photos, ['order'], ['asc']);
    if (this.profilePhotos.length === 1 || this.profilePhotos.length === 0) {
      this.profilePhotos = [{
        photo: this.default,
        order: 0
      }];
    }
  }
}
