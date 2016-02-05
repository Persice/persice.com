import {Component, Input, Output, EventEmitter} from 'angular2/core';

/**
 * Services
 */


@Component({
	selector: 'profile-edit-photos-albums',
	template: require('./profile_edit_photos_albums.html'),
	directives: [
	]
})
export class ProfileEditPhotosAlbumsComponent {
	@Output() close: EventEmitter<any> = new EventEmitter();
	@Output() openCrop: EventEmitter<any> = new EventEmitter();
	@Input() isHidden;
	loading: boolean = false;
}
