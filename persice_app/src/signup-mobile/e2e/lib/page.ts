import { Utilities } from './utilities';
/**
 * Base class for all pages.
 */
export class Page {
  protected path: string = undefined;

  constructor(path: string) {
    this.path = path;
  }

  public get(): void {
    browser.get(this.path);
  }

  public isOpen(): webdriver.promise.Deferred<boolean> {
    return Utilities.currentUrlContains(this.path);
  }
}
