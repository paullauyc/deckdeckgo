import {EventEmitter} from '@stencil/core';

import type {OverlayEventDetail} from '@ionic/core';

import busyStore from '../../stores/busy.store';
import authStore from '../../stores/auth.store';

import {ImageAction} from '../../types/editor/image-action';
import {EditAction} from '../../types/editor/edit-action';
import {SlotUtils} from '../../utils/editor/slot.utils';
import {SlotType} from '../../types/editor/slot-type';
import {DeckgoImgAction, ImageActionUtils} from '../../utils/editor/image-action.utils';
import {modalController} from '../../utils/ionic/ionic.overlay';

export class ImageHelper {
  constructor(
    private didChange: EventEmitter<HTMLElement>,
    private blockSlide: EventEmitter<boolean>,
    private signIn: EventEmitter<void>
  ) {}

  async imageAction(selectedElement: HTMLElement, slide: boolean, deck: boolean, imageAction: ImageAction) {
    if (imageAction.action === EditAction.OPEN_PHOTOS) {
      await this.openModal(selectedElement, slide, deck, 'app-photo');
    } else if (imageAction.action === EditAction.DELETE_BACKGROUND) {
      await this.deleteBackground(selectedElement, slide, deck);
    } else if (imageAction.action === EditAction.ADD_IMAGE && imageAction.image) {
      await this.appendImage(selectedElement, slide, deck, imageAction.image);
    } else if (imageAction.action === EditAction.OPEN_GIFS) {
      await this.openModal(selectedElement, slide, deck, 'app-gif');
    } else if (imageAction.action === EditAction.OPEN_CUSTOM) {
      await this.openModal(selectedElement, slide, deck, 'app-custom-images', EditAction.OPEN_CUSTOM);
    } else if (imageAction.action === EditAction.OPEN_SVG_WAVES) {
      await this.openModal(selectedElement, slide, deck, 'app-waves');
    }
  }

  async openModal(selectedElement: HTMLElement, slide: boolean, deck: boolean, componentTag: string, action?: EditAction) {
    const modal: HTMLIonModalElement = await modalController.create({
      component: componentTag
    });

    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data && selectedElement) {
        if (action === EditAction.OPEN_CUSTOM_LOGO) {
          await this.updateSlideAttribute(selectedElement, detail.data, 'img-src');
        } else if (action === EditAction.OPEN_DATA) {
          await this.updateSlideAttribute(selectedElement, detail.data, 'src');
        } else {
          await this.appendImage(selectedElement, slide, deck, detail.data);
        }
      }

      this.blockSlide.emit(false);
    });

    this.blockSlide.emit(true);

    await modal.present();
  }

  async openCustomModalRestricted(selectedElement: HTMLElement, slide: boolean, deck: boolean, componentTag: string, action: EditAction) {
    if (!authStore.state.authUser) {
      this.signIn.emit();
      return;
    }

    await this.openModal(selectedElement, slide, deck, componentTag, action);
  }

  private appendImage(
    selectedElement: HTMLElement,
    slide: boolean,
    deck: boolean,
    image: UnsplashPhoto | TenorGif | StorageFile | Waves
  ): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (!selectedElement || !image || !document) {
        resolve();
        return;
      }

      busyStore.state.deckBusy = true;

      if (slide || deck) {
        await this.appendBackgroundImg(selectedElement, image as UnsplashPhoto | TenorGif | StorageFile, deck);
      } else {
        await this.appendContentImg(selectedElement, image as UnsplashPhoto | TenorGif | StorageFile);
      }

      resolve();
    });
  }

  private deleteBackground(selectedElement: HTMLElement, slide: boolean, deck: boolean): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (!selectedElement || !document) {
        resolve();
        return;
      }

      if (!slide && !deck) {
        resolve();
        return;
      }

      const currentSlotElement: HTMLElement = selectedElement.querySelector(":scope > [slot='background']");

      if (currentSlotElement) {
        busyStore.state.deckBusy = true;

        if (deck) {
          selectedElement.removeChild(currentSlotElement);

          this.didChange.emit(selectedElement);

          await (selectedElement as any).loadBackground();
        } else if (selectedElement.hasAttribute('custom-background')) {
          selectedElement.removeChild(currentSlotElement);

          selectedElement.removeAttribute('custom-background');

          this.didChange.emit(selectedElement);

          // Refresh background, deck might have one defined which need to be replicated on the slide which
          if (selectedElement.parentElement) {
            await (selectedElement.parentElement as any).loadBackground();
          }
        }
      }

      resolve();
    });
  }

  private updateDeckgoLazyImgAttributes(
    img: HTMLElement,
    image: UnsplashPhoto | TenorGif | StorageFile,
    background: boolean = false
  ): HTMLElement {
    const deckgImg: DeckgoImgAction | undefined = ImageActionUtils.extractAttributes(image);

    if (deckgImg !== undefined) {
      (img as any).imgSrc = deckgImg.src;
      (img as any).imgAlt = deckgImg.label;
    }

    if (image && image !== undefined && image.hasOwnProperty('downloadUrl')) {
      (img as any).customLoader = true;

      // We have to add the information as attributes because slots are going to be cloned to the slides background
      if (background) {
        img.setAttribute('custom-loader', 'true');
      }
    }

    img.setAttribute('contentEditable', 'false');

    return img;
  }

  private appendContentImg(selectedElement: HTMLElement, image: UnsplashPhoto | TenorGif | StorageFile): Promise<void> {
    return new Promise<void>((resolve) => {
      let element: HTMLElement = SlotUtils.isNodeReveal(selectedElement)
        ? (selectedElement.firstElementChild as HTMLElement)
        : selectedElement;

      if (element.nodeName?.toLowerCase() === SlotType.IMG) {
        element = this.updateDeckgoLazyImgAttributes(element, image);
      } else {
        const deckgoImg: HTMLElement = document.createElement(SlotType.IMG);

        const img: HTMLElement = this.updateDeckgoLazyImgAttributes(deckgoImg, image);

        element.appendChild(img);
      }

      let parent: HTMLElement = element.parentElement;

      if (SlotUtils.isNodeReveal(parent)) {
        parent = parent.parentElement;
      }

      this.didChange.emit(parent);

      resolve();
    });
  }

  private async appendBackgroundImg(
    selectedElement: HTMLElement,
    image: UnsplashPhoto | TenorGif | StorageFile | Waves,
    deck: boolean
  ): Promise<void> {
    const currentSlotElement: HTMLElement = selectedElement.querySelector(":scope > [slot='background']");

    if (currentSlotElement) {
      selectedElement.removeChild(currentSlotElement);
    }

    const div: HTMLElement = document.createElement('div');
    div.setAttribute('slot', 'background');

    if (image.hasOwnProperty('viewBox')) {
      await this.appendChildSvg(selectedElement, div, image as Waves, deck);
      return;
    }

    await this.appendChildImg(selectedElement, div, image as UnsplashPhoto | TenorGif | StorageFile, deck);
  }

  private async appendChildSvg(selectedElement: HTMLElement, div: HTMLElement, waves: Waves, deck: boolean) {
    const svgns = 'http://www.w3.org/2000/svg';

    const svg: SVGSVGElement = document.createElementNS(svgns, 'svg');
    const {path: _path, ...svgAttrs} = waves;

    Object.keys(svgAttrs).forEach((attr) => {
      svg.setAttribute(attr, svgAttrs[attr]);
    });

    const path: SVGPathElement = document.createElementNS(svgns, 'path');
    path.setAttribute('d', waves.path.d);

    svg.appendChild(path);

    div.appendChild(svg);

    selectedElement.appendChild(div);

    if (deck) {
      await (selectedElement as any).loadBackground();
    } else {
      selectedElement.setAttribute('custom-background', '');
    }

    this.didChange.emit(selectedElement);
  }

  private async appendChildImg(
    selectedElement: HTMLElement,
    div: HTMLElement,
    image: UnsplashPhoto | TenorGif | StorageFile,
    deck: boolean
  ) {
    const deckgoImg: HTMLElement = document.createElement(SlotType.IMG);

    const img: HTMLElement = this.updateDeckgoLazyImgAttributes(deckgoImg, image, true);
    div.appendChild(img);

    selectedElement.appendChild(div);

    if (deck) {
      // prettier-ignore
      img.addEventListener("lazyImgDidLoad", async () => {
        await (selectedElement as any).loadBackground();
        this.didChange.emit(selectedElement);
      }, { once: true });
    } else {
      selectedElement.setAttribute('custom-background', '');

      // prettier-ignore
      img.addEventListener("lazyImgDidLoad", async () => {
        this.didChange.emit(selectedElement);
      }, { once: true });
    }
  }

  deleteSlideAttributeImgSrc(selectedElement: HTMLElement): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!selectedElement) {
        resolve();
        return;
      }

      busyStore.state.deckBusy = true;

      selectedElement.removeAttribute('img-src');

      this.didChange.emit(selectedElement);

      resolve();
    });
  }

  private updateSlideAttribute(selectedElement: HTMLElement, image: StorageFile, attribute: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (!selectedElement || !image || !attribute) {
        resolve();
        return;
      }

      busyStore.state.deckBusy = true;

      selectedElement.setAttribute(attribute, image.downloadUrl);

      this.didChange.emit(selectedElement);

      resolve();
    });
  }
}
