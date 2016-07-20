export class AccountHelper {

  /**
   * Log the user out.
   */
  public static logOut(): void {
    browser.get('/logout');
  };
}
