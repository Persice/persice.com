import { LoginPage } from './login-page';
import { CrowdPage } from './crowd-page';
export class AccountHelper {

  /**
   * Log in the user with given credentials.
   */
  public static login(email: string, password: string): void {
    let loginPage = new LoginPage();
    loginPage.get();
    loginPage.navigateToFacebook();
    loginPage.setEmail(email);
    loginPage.setPassword(password);
    loginPage.submit();
  }

  /**
   * Log the user out.
   */
  public static logOut(): void {
    browser.get('/logout');
  };

  public static loginAndViewCrowd(email: string, password: string): void {
    let crowdPage = new CrowdPage();
    AccountHelper.login(email, password);
    crowdPage.waitForHeaderToLoad();

    crowdPage.isOpen().then((open) => {
      if (!open) {
        crowdPage.get();
      }
    });
  }

  public static isLoggedIn(): webdriver.promise.Deferred<boolean> {
    let deferred = protractor.promise.defer();
    let crowdPage = new CrowdPage();
    crowdPage.get();

    crowdPage.isOpen().then(function(open) {
      deferred.fulfill(open);
    });

    return deferred;
  }

  public static ensureCrowdOpen(email: string, password: string): void {
    let crowdPage = new CrowdPage();

    AccountHelper.isLoggedIn().then(function(loggedIn) {
      if (loggedIn) {
        crowdPage.get();
      } else {
        AccountHelper.loginAndViewCrowd(email, password);
      }
    })
  }

  public static ensureCrowdOpenForTestUser(): void {
    AccountHelper.ensureCrowdOpen('plvndvh_dinglesky_1422048137@tfbnw.net', 'testing1234');
  }
}
