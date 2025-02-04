import {AuthClient} from '@dfinity/auth-client';
import {Identity} from '@dfinity/agent';

import {del} from 'idb-keyval';

import navStore, {NavDirection} from '../../stores/nav.store';
import errorStore from '../../stores/error.store';
import authStore from '../../stores/auth.store';
import userStore from '../../stores/user.store';

import {AuthUser} from '../../models/auth/auth.user';
import {User} from '../../models/data/user';

import {InternetIdentityAuth} from '../../types/core/ic.identity';

import {internetIdentityAuth} from '../../utils/core/ic.identity.utils';

import {AuthProvider} from './auth.provider';

import {initUserWorker} from '../../workers/user.ic.worker';

export class AuthIcProvider extends AuthProvider {
  private authClient: AuthClient | undefined;

  // @Override
  async init() {
    this.authClient = await AuthClient.create();
    const isAuthenticated: boolean = (await this.authClient?.isAuthenticated()) || false;

    if (!isAuthenticated) {
      return;
    }

    const internetIdentity: InternetIdentityAuth = await internetIdentityAuth();

    const user: User = await initUserWorker({internetIdentity, host: `${window.location}`});

    this.populateUser({user});
  }

  // @Override
  async signIn() {
    const authClient: AuthClient = this.authClient || (await AuthClient.create());

    await authClient.login({
      onSuccess: () => {
        navStore.state.nav = {
          url: '/',
          direction: NavDirection.RELOAD
        };
      },
      onError: (err?: string) => {
        console.error(err);

        errorStore.state.error = 'There was an issue sign in with the internet identity.';
      },
      ...(process.env.LOCAL_IDENTITY && {
        identityProvider: `http://localhost:8000?canisterId=${process.env.LOCAL_IDENTITY_CANISTER_ID}#authorize`
      })
    });
  }

  // @Override
  async signOut() {
    await this.authClient?.logout();

    await del('deckdeckgo_redirect');
    await del('deckdeckgo_redirect_info');
  }

  getIdentity(): Identity | undefined {
    return this.authClient?.getIdentity();
  }

  private populateUser({user}: {user: User}) {
    const {id, data} = user;

    const {name, email, photo_url} = data;

    authStore.state.authUser = {
      uid: id,
      anonymous: false,
      gitHub: false,
      name,
      email,
      photo_url
    } as AuthUser;

    userStore.state.user = {
      ...user
    };
  }
}
