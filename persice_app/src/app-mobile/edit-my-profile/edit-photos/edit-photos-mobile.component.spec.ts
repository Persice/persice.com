import { async, inject, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { EditPhotosMobileComponent } from './edit-photos-mobile.component';
import { PhotosService, FacebookAlbumsService } from '../../../app/shared/services';
import { AppStateService } from '../../shared/services/app-state.service';
import { HttpClient } from '../../../app/shared/core';
import { PhotosGenerators } from './photos-generators';
import { Photo } from '../../../common/models/photo';
import { HeaderState } from '../../header/header.state';

class MockPhotosService extends PhotosService {
  response: any = null;

  public getMyPhotos(limit: number): Observable<any> {
    return Observable.of(this.response);
  }

  public setResponse(response: any): void {
    this.response = response;
  }

  public getProvider(): any {
    return {provide: PhotosService, useValue: this};
  }

  public setEmptyResponse(): void {
    this.response = {
      meta: {
        total_count: 0
      },
      objects: []
    };
  }

  public setMainProfilePhotoResponse(): void {
    this.response = {
      meta: {
        total_count: 1
      },
      objects: [PhotosGenerators.givenPhotoWithDataDto(0)]
    };
  }

  public setMainProfilePhotoWithThumbPhotoResponse(): void {
    this.response = {
      meta: {
        total_count: 2
      },
      objects: [
        PhotosGenerators.givenPhotoWithDataDto(0),
        PhotosGenerators.givenPhotoWithDataDto(1),
      ]
    };
  }

}

let component: EditPhotosMobileComponent;
let domElement: any;

describe('Edit photos mobile component', () => {
  let mockPhotosService: MockPhotosService;

  beforeEach(() => {
    mockPhotosService = new MockPhotosService(null);

    addProviders([
      HttpClient,
      FacebookAlbumsService,
      MockBackend,
      AppStateService,
      BaseRequestOptions,
      HttpClient,
      HeaderState,
      {
        provide: Http,
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      },
      mockPhotosService.getProvider(),
    ]);
  });

  beforeEach(async(inject([TestComponentBuilder],
    (tcb: TestComponentBuilder) => {
      return tcb
        .overrideProviders(
          EditPhotosMobileComponent, [
            {provide: PhotosService, useValue: mockPhotosService}
          ])
        .createAsync(EditPhotosMobileComponent)
        .then((componentFixture: any) => {
          this.componentFixture = componentFixture;
          component = componentFixture.componentInstance;
          domElement = componentFixture.nativeElement;
        });
    })));

  it('should not display photos when photos service returns empty response', () => {
    //given
    mockPhotosService.setEmptyResponse();

    //when
    this.componentFixture.detectChanges();

    //expect
    expect(component.photosCount).toEqual(0);
    expect(component.photos.length).toEqual(EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT);
    expect(component.photos).toEqual(PhotosService.getEditPhotos(
      mockPhotosService.response, EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT));

    const thumbsEmptyLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo-upload');
    expect(thumbsEmptyLength).toEqual(4);
  });

  it('should display main profile photo when photos service returns non empty response', () => {
    //given
    mockPhotosService.setMainProfilePhotoResponse();

    //when
    this.componentFixture.detectChanges();

    //expect
    expect(component.photosCount).toEqual(mockPhotosService.response.meta.total_count);
    expect(component.photos[0]).toEqual(new Photo(PhotosGenerators.givenPhotoWithDataDto(0)));
    expect(component.photos.length).toEqual(EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT);

    const profilePhotoLength = obtainLength(domElement, '.profile-edit__photos__main-photo');
    expect(profilePhotoLength).toEqual(1);

    const thumbsEmptyLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo-upload');
    expect(thumbsEmptyLength).toEqual(4);

  });

  it('should display thumb photo when photos service returns non empty response', () => {
    //given
    mockPhotosService.setMainProfilePhotoWithThumbPhotoResponse();

    //when
    this.componentFixture.detectChanges();

    //expect
    expect(component.photosCount).toEqual(mockPhotosService.response.meta.total_count);
    expect(component.photos[0]).toEqual(new Photo(PhotosGenerators.givenPhotoWithDataDto(0)));
    expect(component.photos[1]).toEqual(new Photo(PhotosGenerators.givenPhotoWithDataDto(1)));

    const profilePhotoLength = obtainLength(domElement, '.profile-edit__photos__main-photo');
    expect(profilePhotoLength).toEqual(1);

    const thumbsLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo');
    expect(thumbsLength).toEqual(1);

    const thumbsEmptyLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo-upload');
    expect(thumbsEmptyLength).toEqual(3);

  });

  it('should be able to open other edit photos pages', () => {
    //given
    component.page = 3;

    //when
    this.componentFixture.detectChanges();

    //expect
    const arrangePhotosLength = obtainLength(domElement, '.mob-edit-photos-arrange');
    expect(arrangePhotosLength).toEqual(0);
  });

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }

});
