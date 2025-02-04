import {Component, h, Prop, State} from '@stencil/core';

import {TenorProvider} from '../../../providers/tenor/tenor.provider';

@Component({
  tag: 'app-random-gif',
  styleUrl: 'app-random-gif.scss'
})
export class AppRandomGif {
  @Prop()
  keyword: string;

  @State()
  private gif: TenorGif;

  private tenorProvider: TenorProvider;

  constructor() {
    this.tenorProvider = TenorProvider.getInstance();
  }

  async componentDidLoad() {
    await this.initRandomGifUrl();
  }

  private initRandomGifUrl(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (!this.keyword || this.keyword === undefined || this.keyword === '') {
        resolve();
        return;
      }

      const gifResponse: TenorSearchResponse | undefined = await this.tenorProvider.getRandomGif(this.keyword);

      this.gif = gifResponse?.results?.[0] ?? null;

      resolve();
    });
  }

  render() {
    return <div class="gif-container ion-margin">{this.renderGif()}</div>;
  }

  private renderGif() {
    if (this.gif?.media?.[0]?.nanogif?.url) {
      return (
        <deckgo-lazy-img
          imgSrc={this.gif.media[0].nanogif.url}
          imgAlt={this.gif.title ? this.gif.title : this.gif.media[0].nanogif.url}></deckgo-lazy-img>
      );
    } else {
      return undefined;
    }
  }
}
