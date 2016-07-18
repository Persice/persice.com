import { async, inject, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { Component, EventEmitter } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { EditPhotoThumbComponent } from './edit-photo-thumb.component';
import { AppStateService } from '../../../../shared/services/app-state.service';
import { PhotosGenerators } from '../../photos-generators';
import { Photo } from '../../../../../common/models/photo';

@Component({
  template: `
    <prs-mobile-edit-photo-thumb
      [photo]="thumbPhoto"
      (onDelete)="onDelete.emit($event)">
    </prs-mobile-edit-photo-thumb>
  `,
  directives: [EditPhotoThumbComponent],
  providers: [
    AppStateService
  ]
})
class TestComponent {
  thumbPhoto: Photo;
  onDelete: EventEmitter<any> = new EventEmitter();
}

let component: TestComponent;
let domElement: any;

describe('Edit photo thumb mobile component', () => {

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
    component.thumbPhoto = new Photo(PhotosGenerators.givenPhotoWithDataDto(5));

    //when
    this.componentFixture.detectChanges();

    //expect
    const thumbPhotoLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo');
    const addThumbPhotoLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo-upload');
    expect(thumbPhotoLength).toEqual(1);
    expect(addThumbPhotoLength).toEqual(0);
  });

  it('should display upload profile photo when profile photo is not set', () => {
    //given
    component.thumbPhoto = new Photo({order: 1});

    //when
    this.componentFixture.detectChanges();

    //expect
    const profilePhotoLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo');
    const addProfilePhotoLength = obtainLength(domElement, '.profile-edit__photos__thumb-photo-upload');
    expect(profilePhotoLength).toEqual(0);
    expect(addProfilePhotoLength).toEqual(1);
  });

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }

});
