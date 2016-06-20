import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';

import {PhotosService} from '../../../app/shared/services';
import {SwiperDirective} from '../../../app/shared/directives';

/**
 * Component for displaying person photos
 */
@Component({
  selector: 'prs-mobile-photos',
  template: require('./photos-mobile.html'),
  providers: [PhotosService],
  directives: [SwiperDirective]
})
export class PhotosMobileComponent implements OnInit {
  @Input() personId: number;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  public photos: string[] = [];
  public isPhotosLoaded = false;

  public swiperOpts = JSON.stringify({
    pagination: '.js-swiper-gallery__pagination',
    initialSlide: 0,
    observer: true,
    autoHeight: true
  });

  constructor(private photosService: PhotosService) { }

  ngOnInit(): any {
    // Get oerson photos from backend
    let subs: Subscription = this.photosService.get('', 5, this.personId).subscribe((photos) => {
      if (!!photos && !!photos.objects) {
        this.photos = photos.objects;
        this.isPhotosLoaded = true;
      }
      subs.unsubscribe();
    });
  }

}
