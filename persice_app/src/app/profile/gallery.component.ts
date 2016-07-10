import {Component, Input, AfterViewInit, OnDestroy} from '@angular/core';

declare var Swiper: any;
@Component({
  selector: 'prs-profile-gallery',
  template: <any>require('./gallery.html')
})
export class GalleryComponent implements OnDestroy, AfterViewInit {
  @Input() photos;
  @Input() defaultPhoto;
  galleryTop;
  galleryThumbs;

  ngAfterViewInit() {
    setTimeout(() => {
      this.galleryTop = new Swiper('.gallery-top', {
        nextButton: '.modal-gallery__arrow--next',
        prevButton: '.modal-gallery__arrow--prev',
        spaceBetween: 15,
        autoHeight: true
      });
      this.galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 15,
        centeredSlides: true,
        slidesPerView: 5,
        touchRatio: 0.2,
        slideToClickedSlide: true
      });
      this.galleryTop.params.control = this.galleryThumbs;
      this.galleryThumbs.params.control = this.galleryTop;
    }, 500);

  }

  ngOnDestroy() {
    if (this.galleryTop) {
      this.galleryTop.destroy(true, true);
    }

    if (this.galleryThumbs) {
      this.galleryThumbs.destroy(true, true);
    }

  }
}
