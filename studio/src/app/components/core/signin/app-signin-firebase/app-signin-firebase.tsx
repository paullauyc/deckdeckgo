import {Component, Event, h, Fragment, EventEmitter} from '@stencil/core';

import firebase from '@firebase/app';
import '@firebase/auth';
import {UserCredential, OAuthCredential} from '@firebase/auth-types';

import navStore, {NavDirection} from '../../../../stores/nav.store';
import tokenStore from '../../../../stores/token.store';
import i18n from '../../../../stores/i18n.store';

import {Utils} from '../../../../utils/core/utils';
import {renderI18n} from '../../../../utils/core/i18n.utils';

import {EnvironmentDeckDeckGoConfig} from '../../../../types/core/environment-config';

import {EnvironmentConfigService} from '../../../../services/environment/environment-config.service';

import {AppIcon} from '../../app-icon/app-icon';

@Component({
  tag: 'app-signin-firebase',
  styleUrl: 'app-signin-firebase.scss'
})
export class AppSignInFirebase {
  @Event()
  inProgress: EventEmitter<boolean>;

  async componentDidLoad() {
    await this.setupFirebaseUI();
  }

  async disconnectedCallback() {
    const ui = firebaseui.auth.AuthUI.getInstance();
    if (ui) {
      await ui.delete();
    }
  }

  async setupFirebaseUI() {
    this.inProgress.emit(false);

    await Utils.injectJS({
      id: 'firebase-ui-script',
      src: 'https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js'
    });
    await Utils.injectCSS('firebase-ui-css', 'https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css');

    const deckDeckGoConfig: EnvironmentDeckDeckGoConfig | undefined = EnvironmentConfigService.getInstance().get('deckdeckgo');

    const appUrl: string = deckDeckGoConfig.appUrl;

    const signInOptions = [];

    // GitHub scope
    signInOptions.push({
      provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
      scopes: ['public_repo']
    });

    signInOptions.push(firebase.auth.GoogleAuthProvider.PROVIDER_ID);

    signInOptions.push(firebase.auth.EmailAuthProvider.PROVIDER_ID);

    const uiConfig = {
      signInFlow: 'redirect',
      signInSuccessUrl: appUrl,
      signInOptions: signInOptions,
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: 'https://deckdeckgo.com/terms',
      // Privacy policy url/callback.
      privacyPolicyUrl: 'https://deckdeckgo.com/privacy',
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      autoUpgradeAnonymousUsers: false,
      callbacks: {
        signInSuccessWithAuthResult: (authResult, _redirectUrl) => {
          this.inProgress.emit(true);

          this.saveGithubCredentials(authResult);

          this.navigateRedirect();

          return false;
        }
      }
    };

    // @ts-ignore
    window['firebase'] = firebase;

    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

    if (!ui.isPendingRedirect()) {
      ui.reset();
    }

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  private navigateRedirect(redirectStatus: 'success' | 'failure' = 'success') {
    const redirectUrl: string = localStorage.getItem('deckdeckgo_redirect');

    localStorage.removeItem('deckdeckgo_redirect');

    this.navigateRoot(redirectUrl, redirectStatus, NavDirection.RELOAD);
  }

  private navigateRoot(redirectUrl: string, redirectStatus: 'success' | 'failure', direction: NavDirection) {
    // TODO: That's ugly
    const url: string = !redirectUrl || redirectUrl.trim() === '' || redirectUrl.trim() === '/' ? '/' : '/' + redirectUrl + '/';

    // Do not push a new page but reload as we might later face a DOM with contains two firebaseui which would not work
    navStore.state.nav = {
      url: url + `?signin=${redirectStatus}`,
      direction
    };
  }

  private saveGithubCredentials(userCred: UserCredential) {
    if (!userCred || !userCred.user || !userCred.user.uid) {
      return;
    }

    if (!userCred.credential || userCred.credential.providerId !== 'github.com' || !(userCred.credential as OAuthCredential).accessToken) {
      return;
    }

    tokenStore.state.token = {
      id: userCred.user.uid,
      data: {
        github: {
          token: (userCred.credential as OAuthCredential).accessToken
        }
      }
    };
  }

  render() {
    return (
      <Fragment>
        {this.renderMsg()}

        {this.renderGitHub()}

        <div id="firebaseui-auth-container"></div>
      </Fragment>
    );
  }

  private renderMsg() {
    return [
      <h1 class="ion-text-center ion-padding-start ion-padding-end">{i18n.state.sign_in.hi}</h1>,
      <p class="ion-text-center ion-padding">{i18n.state.sign_in.why}</p>
    ];
  }

  private renderGitHub() {
    return (
      <p class="ion-text-center ion-padding-start ion-padding-end ion-padding-bottom">
        {renderI18n(i18n.state.sign_in.additionally, {
          placeholder: '{0}',
          value: <AppIcon name="github" ariaLabel="" ariaHidden={true}></AppIcon>
        })}
      </p>
    );
  }
}
