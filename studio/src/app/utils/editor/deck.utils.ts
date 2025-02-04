export const deckSelector: string = 'app-editor > ion-content div.deck > main > deckgo-deck';

export const slideTo = async (index: number) => {
  const deck: HTMLDeckgoDeckElement | undefined = document.querySelector(deckSelector);
  await deck?.slideTo(index);
};

export const selectSlide = ({deck, index}: {deck: HTMLDeckgoDeckElement | null; index: number}): HTMLElement | null =>
  deck?.querySelector(':scope > .deckgo-slide-container:nth-child(' + (index + 1) + ')');

export const selectDeckSlide = (index: number): HTMLElement | null => {
  const deck: HTMLDeckgoDeckElement | null = document.querySelector(deckSelector);
  return selectSlide({deck, index});
};
