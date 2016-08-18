var until = protractor.ExpectedConditions;

export class Header {

  protected title: string;

  private header = element(by.className('mob-header__title-value'));

  public currentTitle(): webdriver.promise.Promise<string> {
    browser.wait(until.presenceOf(this.header), 10000, 'Header not present');

    return this.header.getText();
  }
}
