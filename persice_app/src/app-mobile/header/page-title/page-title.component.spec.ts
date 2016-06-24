import {
  expect,
  it,
  describe,
  async,
  inject,
  beforeEach,
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {Component} from '@angular/core';
import {PageTitleComponent} from './page-title.component';

@Component({
  selector: 'prs-test-component',
  directives: [PageTitleComponent],
  template: `
  <div>
    <prs-page-title [title]="pageTitle"></prs-page-title>
  </div>
  `
})
export class TestComponent {
  pageTitle = 'Persice';
}

let componentInstance: TestComponent;
let componentElement: any;

describe('Page title component', () => {

  beforeEach(async(inject([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture<any>) => {
        this.componentFixture = componentFixture;
        componentInstance = componentFixture.componentInstance;
        componentElement = componentFixture.nativeElement;
      });
  })));

  it('should show default page title', () => {
    // given
    const expectedTitle = 'Persice';

    // when
    this.componentFixture.detectChanges();

    // then
    let pageTitle = obtainText(componentElement, '.mob-header__title-value');
    expect(pageTitle).toBe(expectedTitle);
  });

  it('should show new page title when it changes', () => {
    // given
    componentInstance.pageTitle = 'New page title';
    const expectedTitle = 'New page title';

    // when
    this.componentFixture.detectChanges();

    // then
    let pageTitle = obtainText(componentElement, '.mob-header__title-value');
    expect(pageTitle).toBe(expectedTitle);
  });

  it('should be empty when title is empty string', () => {
    // given
    componentInstance.pageTitle = '';
    const expectedTitle = '';

    // when
    this.componentFixture.detectChanges();

    // then
    let pageTitle = obtainText(componentElement, '.mob-header__title-value');
    expect(pageTitle).toBe(expectedTitle);
  });

  function obtainText(element, selector) {
    return element.querySelector(selector).textContent;
  }

});
