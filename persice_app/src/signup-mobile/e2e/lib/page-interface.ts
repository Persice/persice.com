export interface PageInterface {
  get(): void;
  isOpen(): webdriver.promise.Deferred<boolean>;
}
