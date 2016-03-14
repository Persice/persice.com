import {Component, Input, Output, EventEmitter} from 'angular2/core';


/**
 * Components
 */
import {LoadingComponent} from '../loading/loading.component';

/**
 * Services
 */
import {FacebookAlbumsService} from '../../services/facebook_albums.service';

@Component({
  selector: 'profile-edit-photos-albums',
  template: require('./profile_edit_photos_albums.html'),
  directives: [
    LoadingComponent
  ],
  providers: [
    FacebookAlbumsService
  ]
})
export class ProfileEditPhotosAlbumsComponent {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() openCrop: EventEmitter<any> = new EventEmitter();
  @Input() isHidden;
  loading: boolean = false;
  loadingPhotos: boolean = false;
  loadingFinished: boolean = false;
  isEmpty: boolean = false;
  next;
  facebookAlbumsServiceInstance;
  albums = [];

  constructor(private facebookAlbumsService: FacebookAlbumsService) {

  }

  ngOnInit() {

    //subscribe to inbox service updates
    this.facebookAlbumsServiceInstance = this.facebookAlbumsService.serviceObserver()
      .subscribe((res) => {
        this.loading = res.loading;
        this.loadingPhotos = res.loadingPhotos;
        this.albums = res.data;
        this.loadingFinished = res.finished;
        this.isEmpty = res.isEmpty;
        this.next = res.next;

        if (this.loadingFinished === false) {
          jQuery('#photoAlbums').bind('scroll', this.handleScrollEvent.bind(this));
        } else {
          jQuery('#photoAlbums').unbind('scroll');
        }

      });


    this.facebookAlbumsService.startLoadingAlbums();
  }


  loadMorePhotos(albumId) {
    if (this.loadingPhotos) {
      return;
    }
    this.facebookAlbumsService.loadMorePhotos(albumId);
  }


  handleScrollEvent(event) {
    let scrollOffset = jQuery('#photoAlbums').scrollTop();
    let threshold = jQuery('#photoAlbums').height() - jQuery('#photoAlbums').height() - 60;

    if (this.next && scrollOffset > threshold) {
      if (!this.loading) {
        this.facebookAlbumsService.loadMore();
      }
    }

  }

  ngOnDestroy() {
    if (this.facebookAlbumsServiceInstance) {
      this.facebookAlbumsServiceInstance.unsubscribe();
    }
  }
}
