import {Component, Element, State, h, EventEmitter, Event, Host} from '@stencil/core';

import {IonicReorderEvent} from '../../../utils/ionic/ionic.reorder.event';

import {findSlidesTitle} from '@deckdeckgo/deck-utils';

import i18n from '../../../stores/i18n.store';

import {deckSelector, slideTo} from '../../../utils/editor/deck.utils';

@Component({
  tag: 'app-slide-navigate',
  styleUrl: 'app-slide-navigate.scss'
})
export class AppSlideNavigate {
  @Element() el: HTMLElement;

  @State()
  private slides: string[];

  @Event()
  private reorder: EventEmitter<IonicReorderEvent>;

  async componentDidLoad() {
    history.pushState({modal: true}, null);

    this.slides = await findSlidesTitle(deckSelector);
  }

  async jumpToSlide(index: number) {
    await (this.el.closest('ion-popover') as HTMLIonPopoverElement).dismiss(index);

    await slideTo(index);
  }

  private onReorder($event: CustomEvent<IonicReorderEvent>) {
    this.reorder.emit($event?.detail);
  }

  render() {
    return (
      <Host>
        <ion-reorder-group
          onIonItemReorder={($event: CustomEvent<IonicReorderEvent>) => this.onReorder($event)}
          disabled={!this.slides || this.slides.length <= 1}>
          {this.renderSlides()}
        </ion-reorder-group>
      </Host>
    );
  }

  private renderSlides() {
    if (this.slides && this.slides.length > 0) {
      return this.slides.map((slideTitle: string, i: number) => {
        const text = `${i18n.state.editor.slide}` + (i + 1) + (slideTitle ? ': ' + slideTitle : '');

        return (
          <ion-item ion-item button onClick={() => this.jumpToSlide(i)} detail={false}>
            <ion-label>{text}</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        );
      });
    } else {
      return undefined;
    }
  }
}
