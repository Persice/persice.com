import { AccountHelper } from './account-helper';
import { CrowdPage } from './crowd-page';
import { Header } from './header';

describe('crowd', function() {
  var crowdPage: CrowdPage;
  var header: Header;

  beforeEach(function() {
    crowdPage = new CrowdPage();
    header = new Header();
    AccountHelper.ensureCrowdOpenForTestUser();
  });

  it('should contain a list of people', function() {
    expect(crowdPage.people.count()).toBeGreaterThan(0);
  });
});
