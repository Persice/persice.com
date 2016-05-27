import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {PhotosService} from "../../../app/shared/services/photos.service";
import {ProfileService} from "../../../app/shared/services/profile.service";
import {Person} from "../../shared/model/person";
import {SwiperDirective} from "../../../app/shared/directives/swiper.directive";

@Component({
  selector: 'prs-mobile-photos',
  template: require('./photos-mobile.html'),
  providers: [PhotosService, ProfileService],
  directives: [SwiperDirective]
})
export class PhotosMobileComponent implements OnInit {
  photos: string[] = [];
  isProfileLoaded = false;
  user: Person;
  usernameFromUrl: string;

  swiperOpts = JSON.stringify({
    initialSlide: 0
  });

  constructor(
    private _params: RouteParams,
    private photosService: PhotosService,
    private profileService: ProfileService
  ) {
      this.usernameFromUrl = _params.get('username');
  }

  ngOnInit(): any {
    this.profileService.ofUsername(this.usernameFromUrl).subscribe((data) => {
      this.user = new Person(data);
      this.photosService.get('', 6, data.id).subscribe((photos) => {
        if (photos) {
          this.photos = photos;
          this.isProfileLoaded = true;
        }
      })
    });
  }
}
