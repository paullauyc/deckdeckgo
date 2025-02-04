import {Component, Element, Fragment, h} from '@stencil/core';

import authStore from '../../../stores/auth.store';
import i18n from '../../../stores/i18n.store';

import {AppIcon} from '../app-icon/app-icon';

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss',
  shadow: false
})
export class AppMenu {
  @Element() el: HTMLElement;

  render() {
    return (
      <ion-list>
        {this.renderUser()}

        {this.renderDashboard()}
        {this.renderSettings()}

        {this.renderInteract()}
      </ion-list>
    );
  }

  private renderUser() {
    if (authStore.state.loggedIn) {
      return (
        <ion-item class="user">
          <app-user-info displayAvatar={true}></app-user-info>
        </ion-item>
      );
    } else {
      return <ion-item class="user"></ion-item>;
    }
  }

  private renderDashboard() {
    return (
      <ion-item button class="home" href="/dashboard" routerDirection="forward">
        <AppIcon name="apps" ariaLabel="" ariaHidden={true} lazy={true} slot="start"></AppIcon>
        <ion-label>{i18n.state.menu.dashboard}</ion-label>
      </ion-item>
    );
  }

  private renderInteract() {
    return (
      <Fragment>
        <ion-item button class="home" href="/poll" routerDirection="forward">
          <AppIcon name="chatbubble-ellipses" ariaLabel="" ariaHidden={true} lazy={true} slot="start"></AppIcon>
          <ion-label>{i18n.state.menu.poll}</ion-label>
        </ion-item>

        <ion-item button class="home remote" href="https://deckdeckgo.app" target="_blank">
          <AppIcon name="phone-portrait" ariaLabel="" ariaHidden={true} lazy={true} slot="start"></AppIcon>
          <ion-label>{i18n.state.menu.remote_control}</ion-label>
        </ion-item>
      </Fragment>
    );
  }

  private renderSettings() {
    return (
      <app-expansion-panel expanded="close">
        <ion-label slot="title">Settings</ion-label>
        <AppIcon name="settings" ariaLabel="" ariaHidden={true} lazy={true} slot="icon"></AppIcon>

        <ion-list class="settings">
          <ion-item button class="home" href="/profile" routerDirection="forward">
            <ion-label>{i18n.state.nav.profile}</ion-label>
            <AppIcon name="person" ariaLabel="" ariaHidden={true} lazy={true} slot="start"></AppIcon>
          </ion-item>
          <ion-item button class="home" href="/customization" routerDirection="forward">
            <ion-label>{i18n.state.nav.customization}</ion-label>
            <AppIcon name="color-palette" ariaLabel="" ariaHidden={true} lazy={true} slot="start"></AppIcon>
          </ion-item>
          <ion-item button class="home" href="/templates" routerDirection="forward">
            <ion-label>{i18n.state.nav.templates}</ion-label>
            <AppIcon name="reader" ariaLabel="" ariaHidden={true} lazy={true} slot="start"></AppIcon>
          </ion-item>
        </ion-list>
      </app-expansion-panel>
    );
  }
}
