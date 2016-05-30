import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {PhotosService} from '../../../app/shared/services';
import {SwiperDirective} from '../../../app/shared/directives';
import {AppStateService} from '../../shared/services';

@Component({
  selector: 'prs-mobile-photos',
  template: require('./photos-mobile.html'),
  providers: [PhotosService],
  directives: [SwiperDirective]
})
export class PhotosMobileComponent implements OnInit, OnDestroy {
  @Input() personId: number;
  @Input() profileType: string;
  @Input() profileScore: string;

  @Output() onClosePhotos: EventEmitter<any> = new EventEmitter();

  photos: string[] = [];
  isProfileLoaded = false;

  swiperOpts = JSON.stringify({
    pagination: '.js-swiper-gallery__pagination',
    initialSlide: 0,
    observer: true,
    autoHeight: true
  });

  constructor(private photosService: PhotosService, private appStateService: AppStateService) { }

  ngOnInit(): any {
    this.appStateService.setProfileFooterVisibility({
      visibility: false
    });

    this.photosService.get('', 5, this.personId).subscribe((photos) => {
        if (photos) {
          this.photos = photos.objects.reverse();
          this.isProfileLoaded = true;
        }
      });
  }

  ngOnDestroy(): void {
    switch (this.profileType) {
      case 'my-profile':
        break;
      case 'connection':
        this.appStateService.setProfileFooterVisibility({
          type: this.profileType,
          visibility: true
        });
      case 'crowd':
        this.appStateService.setProfileFooterVisibility({
          type: this.profileType,
          score: this.profileScore,
          userId: this.personId,
          visibility: true
        });
      default:
        break;
    }

  }
}
