import {Component, Input} from 'angular2/core';

declare var Swiper: any;
@Component({
  selector: 'profile-gallery',
  template: require('./profile_gallery.html')
})
export class ProfileGalleryComponent {
  @Input() photos;
  galleryTop;
  galleryThumbs;

  ngAfterViewInit() {
    setTimeout(() => {
      this.galleryTop = new Swiper('.gallery-top', {
        nextButton: '.modal-gallery__arrow--next',
        prevButton: '.modal-gallery__arrow--prev',
        spaceBetween: 15,
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
