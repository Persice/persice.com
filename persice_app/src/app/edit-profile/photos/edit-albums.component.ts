import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FacebookAlbumsService } from '../../shared/services/facebook_albums.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'prs-edit-albums',
  template: <any>require('./edit-albums.html'),
  directives: [
    LoadingComponent
  ],
  providers: [
    FacebookAlbumsService
  ]
})
export class EditAlbumsComponent implements OnDestroy, OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() openCrop: EventEmitter<any> = new EventEmitter();
  @Input() isHidden;
  private loading: boolean = false;
  private loadingPhotos: boolean = false;
  private loadingFinished: boolean = false;
  private isEmpty: boolean = false;
  private next;
  private facebookAlbumsServiceInstance;
  private albums: any[] = [];

  constructor(private facebookAlbumsService: FacebookAlbumsService) { }

  ngOnInit() {
    //subscribe to facebook albums service updates
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
