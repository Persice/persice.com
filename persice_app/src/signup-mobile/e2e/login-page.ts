import { Utilities } from './lib/utilities';
import { PageInterface } from './lib/page-interface';

export class LoginPage implements PageInterface {

  protected path: string = undefined;

  private emailInput =  element(by.name('email'));
  private passwordInput =  element(by.name('pass'));
  private navigateToFacebookButton = element(by.id('loginButton'));
  private facebookLoginButton =  element(by.name('login'));

  constructor() {
    this.path = '/accounts/login/';
  }

  public get(): void {
    browser.get(this.path);
  }

  public isOpen(): webdriver.promise.Deferred<boolean> {
    return Utilities.currentUrlContains(this.path);
  }

  public navigateToFacebook(): void {
    this.navigateToFacebookButton.click();
  }

  /**
   * Set the email field value to the specified email.
   *
   * @param {string} email Email to enter.
   */
  setEmail(email: string): void {
    this.emailInput.clear();
    this.emailInput.sendKeys(email);
  }

  /**
   * Set the password field value to the specified value.
   *
   * @param {string} password Password to enter.
   */
  setPassword(password: string): void {
    this.passwordInput.clear();
    this.passwordInput.sendKeys(password);
  }

  /**
   * Submit the form by clicking the button.
   */
  submit(): void {
    this.facebookLoginButton.click();
  };

  /**
   * Determine whether an error message is visible.
   */
  isErrorDisplayed(): webdriver.promise.Promise<boolean> {
    return element(by.xpath(`//*[contains(text(),'Forgot Password?')]`)).isDisplayed();
  }
}
