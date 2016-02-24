var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var ProfileGalleryComponent = (function () {
    function ProfileGalleryComponent() {
    }
    ProfileGalleryComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.galleryTop = new Swiper('.gallery-top', {
                nextButton: '.modal-gallery__arrow--next',
                prevButton: '.modal-gallery__arrow--prev',
                spaceBetween: 15,
            });
            _this.galleryThumbs = new Swiper('.gallery-thumbs', {
                spaceBetween: 15,
                centeredSlides: true,
                slidesPerView: 5,
                touchRatio: 0.2,
                slideToClickedSlide: true
            });
            _this.galleryTop.params.control = _this.galleryThumbs;
            _this.galleryThumbs.params.control = _this.galleryTop;
        }, 500);
    };
    ProfileGalleryComponent.prototype.ngOnDestroy = function () {
        if (this.galleryTop) {
            this.galleryTop.destroy(true, true);
        }
        if (this.galleryThumbs) {
            this.galleryThumbs.destroy(true, true);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ProfileGalleryComponent.prototype, "photos", void 0);
    ProfileGalleryComponent = __decorate([
        core_1.Component({
            selector: 'profile-gallery',
            template: require('./profile_gallery.html')
        }), 
        __metadata('design:paramtypes', [])
    ], ProfileGalleryComponent);
    return ProfileGalleryComponent;
})();
exports.ProfileGalleryComponent = ProfileGalleryComponent;
