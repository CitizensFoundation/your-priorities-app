import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpApp } from '../yp-app.js';
import '../yp-app.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpApp /user/login route', () => {
  let element: YpApp;
  let originalAppUser: any;
  let openUserloginCalls: number;

  // restoredUser stands in for the session the server returns once the
  // asynchronous login check completes.
  const stubAppUser = (
    user: YpUserData | null | undefined,
    restoredUser: YpUserData | null | undefined = user
  ) => {
    const appUser: any = {
      ...originalAppUser,
      user,
      loggedIn: () => appUser.user != null,
      ensureLoginChecked: async () => {
        await aTimeout(10);
        appUser.user = restoredUser;
        return appUser.loggedIn();
      },
      openUserlogin: () => {
        openUserloginCalls += 1;
      },
    };
    window.appUser = appUser;
  };

  const visitLoginRoute = async () => {
    element.route = '/user/login';
    element.routeData = { page: 'user' };
    element._routePageChanged({});
    await aTimeout(50);
  };

  before(async () => {
    YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-app></yp-app>
    `);
    await aTimeout(100);
    originalAppUser = window.appUser;
    openUserloginCalls = 0;
  });

  afterEach(() => {
    window.appUser = originalAppUser;
  });

  it('opens the login dialog when nobody is logged in', async () => {
    stubAppUser(null);

    await visitLoginRoute();

    expect(openUserloginCalls).to.equal(1);
  });

  it('opens the login dialog during an anonymous session', async () => {
    stubAppUser({
      id: 1,
      name: 'Anonymous',
      profile_data: { isAnonymousUser: true },
    } as YpUserData);

    await visitLoginRoute();

    expect(openUserloginCalls).to.equal(1);
  });

  it('does not open the login dialog when a user is already logged in', async () => {
    stubAppUser({ id: 2, name: 'Admin' } as YpUserData);

    await visitLoginRoute();

    expect(openUserloginCalls).to.equal(0);
  });

  it('does not open the login dialog once a session is restored on a cold load', async () => {
    stubAppUser(null, { id: 2, name: 'Admin' } as YpUserData);

    await visitLoginRoute();

    expect(openUserloginCalls).to.equal(0);
  });

  it('moves the browser back to the domain home', async () => {
    stubAppUser(null);
    const testRunnerUrl = window.location.href;
    window.history.pushState({}, '', '/user/login');

    await visitLoginRoute();

    const pathname = window.location.pathname;
    window.history.replaceState({}, '', testRunnerUrl);
    expect(pathname).to.equal('/');
  });
});
