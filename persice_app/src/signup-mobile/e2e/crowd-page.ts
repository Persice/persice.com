import { Utilities } from './lib/utilities';
import { PageInterface } from './lib/page-interface';
import { Header } from './header';
var until = protractor.ExpectedConditions;
var timeout = 10000;

export class CrowdPage implements PageInterface {

  private _path: string = undefined;
  private _title: string = undefined;
  private _peopleList =  element.all(by.className('user-card'));
  private _peopleListContainer = element(by.tagName('prs-mobile-user-card'));
  private _header: Header;

  constructor() {
    this._path = '/crowd';
    this._title = 'CROWD';
    this._header = new Header();
  }

  public get(): void {
    browser.get(this._path);
  }

  public isOpen(): webdriver.promise.Deferred<boolean> {
    return Utilities.currentUrlContains(this._path);
  }

  public get title() {
    return this._title;
  }

  public get people() {
    browser.wait(until.presenceOf(this._peopleListContainer), timeout, 'People list is not present');

    return this._peopleList;
  }

  public waitForHeaderToLoad(): void {
    browser.wait(this._header.currentTitle(), timeout, 'Header is not present');
  }
}
