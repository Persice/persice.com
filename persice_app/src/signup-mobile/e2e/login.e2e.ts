import { AccountHelper } from './account-helper';
import { LoginPage } from './login-page';
import { Header } from './header';

describe('Login', function() {
  var loginPage: LoginPage;
  var header: Header;

  beforeEach(function() {
    AccountHelper.logOut();
    header = new Header();
    loginPage = new LoginPage();
    loginPage.get();
    loginPage.navigateToFacebook();
  });

  it('should fail when email and password are incorrect', function() {
    loginPage.setEmail('test@example.com');
    loginPage.setPassword('wrongpassword');
    loginPage.submit();

    expect(loginPage.isErrorDisplayed()).toBe(true);
  });


  it('should redirect to Crowd when correct credentials entered', function() {
    loginPage.setEmail('plvndvh_dinglesky_1422048137@tfbnw.net');
    loginPage.setPassword('testing1234');
    loginPage.submit();

    expect(header.currentTitle()).toBe('CROWD');
  });
});
