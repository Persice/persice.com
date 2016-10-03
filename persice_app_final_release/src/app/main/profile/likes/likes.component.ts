import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
@Component({
  templateUrl: './likes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'prs-profile-likes',
})
export class LikesComponent {
  @Input() likes: any[];

  private swiperOptions = JSON.stringify({
    slidesPerView: 3,
    spaceBetween: 5,
    nextButton: '.js-slide-users__next-2',
    prevButton: '.js-slide-users__prev-2',
    breakpoints: {
      1480: {
        slidesPerView: 2,
        spaceBetween: 5
      }
    }
  });
}
