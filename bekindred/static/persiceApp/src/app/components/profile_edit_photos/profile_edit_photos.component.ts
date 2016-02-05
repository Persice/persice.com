import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Http} from 'angular2/http';
import {ListUtil, CookieUtil} from '../../core/util';

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

  constructor(private _http: Http) {

  }

  ngOnInit() {
    let token = CookieUtil.getValue('user_token');
    let url = `https://graph.facebook.com/me/?fields=albums.limit(30){picture, name, photos.limit(6)}&access_token=${token}`;
    this._http.get(url).map(res => res.json())
    .subscribe((data) => {
      console.log('FB albums', data);
    });
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
