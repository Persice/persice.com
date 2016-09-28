export class Utilities {

  /**
   * Check if currently opened URL contains provided text and is not served by the backend.
   *
   * @param {string} urlText String to compare.
   *
   * @returns {webdriver.promise.Deferred.<boolean>}
   */
  public static currentUrlContains(urlText: string): webdriver.promise.Deferred<boolean> {
    var deferred = protractor.promise.defer();

    browser.getCurrentUrl().then(function (url) {
      deferred.fulfill((url.indexOf(urlText) > -1) && (url.indexOf('?next') === -1));
    });

    return deferred;
  }
}
