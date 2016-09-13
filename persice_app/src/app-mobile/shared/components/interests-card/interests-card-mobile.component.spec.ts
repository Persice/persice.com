import { async, inject, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { InterestsCardMobileComponent } from './interests-card-mobile.component';
import { PersonGenerator } from '../../../../common/models/person/person-generator';
import { Person } from '../../../../common/models/person/index';

@Component({
  template: `<prs-mobile-interests-card [person]="person"></prs-mobile-interests-card>`,
  directives: [InterestsCardMobileComponent]
})
class TestComponent {
  person: Person;
}

let componentInstance: TestComponent;
let componentElement: any;

describe('Interests card mobile component', () => {

  beforeEach(async(inject([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture<any>) => {
        this.componentFixture = componentFixture;
        componentInstance = componentFixture.componentInstance;
        componentElement = componentFixture.nativeElement;
      });
  })));

  it('should display interests', () => {
    // given
    let alice: Person = PersonGenerator.givenAnyPerson();

    // when
    componentInstance.person = alice;
    this.componentFixture.detectChanges();

    // then
    expect(numberOfInterests()).toBeGreaterThan(0);
  });

  it('shows no interest when a person has none', () => {
    // given
    let bob: Person = PersonGenerator.givenAPersonWithoutInterest();

    // when
    componentInstance.person = bob;
    this.componentFixture.detectChanges();

    // then
    expect(numberOfInterests()).toEqual(0);
  });

  function numberOfInterests(): number {
    return obtainLength(componentElement, '.user-card__similarity__list > li');
  }

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }
});
