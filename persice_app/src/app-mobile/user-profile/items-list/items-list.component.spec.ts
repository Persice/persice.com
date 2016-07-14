import { async, inject, TestComponentBuilder } from '@angular/core/testing';
import { ItemsListMobileComponent } from './items-list.component';

let component: ItemsListMobileComponent;
let domElement: any;

describe('Items list mobile component', () => {

  var givenEmptyList = function () {
    return [];
  };

  var givenListWithSevenItems = function () {
    return [
      {value: 1},
      {value: 1},
      {value: 1},
      {value: 1},
      {value: 1},
      {value: 1},
      {value: 1}
    ];
  };

  var numberOfVisibleElementsInList = function (): number {
    return domElement.querySelectorAll('li').length - domElement.querySelectorAll('.hidden').length;
  };

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
        ItemsListMobileComponent, [])
      .createAsync(ItemsListMobileComponent)
      .then((componentFixture: any) => {
        this.componentFixture = componentFixture;
        component = componentFixture.componentInstance;
        domElement = componentFixture.nativeElement;
      });
  })));

  it('should initially be empty', () => {
    // given
    component.items = givenEmptyList();

    // then
    expect(component.itemsCounter).toBe(0);
    expect(numberOfVisibleElementsInList()).toBe(0);
  });

  it('should display only initial items', () => {
    // given
    component.items = givenListWithSevenItems();

    // when
    this.componentFixture.detectChanges();

    // then
    expect(component.itemsCounter).toBe(7);
    expect(numberOfVisibleElementsInList()).toBe(6);
  });

  it('should display more items when requested', () => {
    // given
    component.items = givenListWithSevenItems();

    // when
    component.toggleMore({});
    this.componentFixture.detectChanges();

    // then
    expect(component.itemsCounter).toBe(7);
    expect(numberOfVisibleElementsInList()).toBe(7);
  });

});
