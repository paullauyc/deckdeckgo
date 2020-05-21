/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { DeckdeckgoHighlightCodeCarbonTheme, DeckdeckgoHighlightCodeTerminal, } from "@deckdeckgo/highlight-code";
export namespace Components {
    interface DeckgoSlideCode {
        "afterSwipe": () => Promise<void>;
        "anchor": string;
        "anchorZoom": string;
        "beforeSwipe": (_enter: boolean, _reveal: boolean) => Promise<boolean>;
        "customActions": boolean;
        "customBackground": boolean;
        "hideAnchor": boolean;
        "hideContent": () => Promise<void>;
        "language": string;
        "lazyLoadContent": () => Promise<void>;
        "revealContent": () => Promise<void>;
        "src": string;
        "terminal": DeckdeckgoHighlightCodeTerminal;
        "theme": DeckdeckgoHighlightCodeCarbonTheme;
    }
}
declare global {
    interface HTMLDeckgoSlideCodeElement extends Components.DeckgoSlideCode, HTMLStencilElement {
    }
    var HTMLDeckgoSlideCodeElement: {
        prototype: HTMLDeckgoSlideCodeElement;
        new (): HTMLDeckgoSlideCodeElement;
    };
    interface HTMLElementTagNameMap {
        "deckgo-slide-code": HTMLDeckgoSlideCodeElement;
    }
}
declare namespace LocalJSX {
    interface DeckgoSlideCode {
        "anchor"?: string;
        "anchorZoom"?: string;
        "customActions"?: boolean;
        "customBackground"?: boolean;
        "hideAnchor"?: boolean;
        "language"?: string;
        "onScrolling"?: (event: CustomEvent<boolean>) => void;
        "onSlideDidLoad"?: (event: CustomEvent<void>) => void;
        "src"?: string;
        "terminal"?: DeckdeckgoHighlightCodeTerminal;
        "theme"?: DeckdeckgoHighlightCodeCarbonTheme;
    }
    interface IntrinsicElements {
        "deckgo-slide-code": DeckgoSlideCode;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "deckgo-slide-code": LocalJSX.DeckgoSlideCode & JSXBase.HTMLAttributes<HTMLDeckgoSlideCodeElement>;
        }
    }
}
