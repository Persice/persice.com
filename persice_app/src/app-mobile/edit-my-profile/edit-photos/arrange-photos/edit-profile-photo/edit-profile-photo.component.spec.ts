import { async, inject, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { Component, EventEmitter } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { EditProfilePhotoComponent } from './edit-profile-photo.component';
import { AppStateService } from '../../../../shared/services/app-state.service';
import { PhotosGenerators } from '../../photos-generators';
import { Photo } from '../../../../../common/models/photo';

@Component({
  template: `
    <prs-mobile-edit-profile-photo
      [photo]="profilePhoto"
      [isDeletionEnabled]="isProfilePhotoDeletable"
      (onDelete)="onDelete.emit($event)">
    </prs-mobile-edit-profile-photo>
  `,
  directives: [EditProfilePhotoComponent],
  providers: [
    AppStateService
  ]
})
class TestComponent {
  profilePhoto: Photo = new Photo({order: 0});
  onDelete: EventEmitter<any> = new EventEmitter();
  isProfilePhotoDeletable: boolean = true;

}

let component: TestComponent;
let domElement: any;

describe('Edit profile photo mobile component', () => {

  beforeEach(() => {
    addProviders([
      AppStateService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      },
    ]);
  });

  beforeEach(async(inject([TestComponentBuilder],
    (tcb: TestComponentBuilder) => {
      return tcb.createAsync(TestComponent)
        .then((componentFixture: any) => {
          this.componentFixture = componentFixture;
          component = componentFixture.componentInstance;
          domElement = componentFixture.nativeElement;
        });
    })));

  it('should display main profile photo when profile photo is set', () => {
    //given
    component.profilePhoto = new Photo(PhotosGenerators.givenPhotoWithDataDto(0));

    //when
    this.componentFixture.detectChanges();

    //expect
    const profilePhotoLength = obtainLength(domElement, '.profile-edit__photos__main-photo');
    const addProfilePhotoLength = obtainLength(domElement, '.profile-edit__photos__main-photo-upload');
    expect(profilePhotoLength).toEqual(1);
    expect(addProfilePhotoLength).toEqual(0);
  });

  it('should display upload profile photo when profile photo is not set', () => {
    //given
    component.profilePhoto = new Photo({order: 0});

    //when
    this.componentFixture.detectChanges();

    //expect
    const profilePhotoLength = obtainLength(domElement, '.profile-edit__photos__main-photo');
    const addProfilePhotoLength = obtainLength(domElement, '.profile-edit__photos__main-photo-upload');
    expect(profilePhotoLength).toEqual(0);
    expect(addProfilePhotoLength).toEqual(1);
  });

  it('should show delete button if deletion is enabled', () => {
    //given
    component.profilePhoto = new Photo(PhotosGenerators.givenPhotoWithDataDto(0));
    component.isProfilePhotoDeletable = true;

    //when
    this.componentFixture.detectChanges();

    //expect
    const deleteButtonLength = obtainLength(domElement,
      '.profile-edit__photos__main-photo__delete');
    expect(deleteButtonLength).toEqual(1);
  });

  it('should hide delete button if deletion is disabled', () => {
    //given
    component.profilePhoto = new Photo(PhotosGenerators.givenPhotoWithDataDto(0));
    component.isProfilePhotoDeletable = false;

    //when
    this.componentFixture.detectChanges();

    //expect
    const deleteButtonLength = obtainLength(domElement,
      '.profile-edit__photos__main-photo__delete');
    expect(deleteButtonLength).toEqual(0);
  });

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }

});
