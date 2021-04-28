/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface DeckgoDrr {
        /**
          * Allow the component to be dragged in which direction
         */
        "drag": 'x-axis' | 'y-axis' | 'all' | 'none';
        /**
          * Allow or not the resize actions
         */
        "resize": boolean;
        /**
          * Allow or not the rotation of the element
         */
        "rotation": boolean;
        /**
          * To be used if your slotted element is to be defined as contentEditable. Useful for text edition. Note that if turns to true, the property resize is going to be set to false automatically
         */
        "text": boolean;
        /**
          * The component could be use with percentage, viewport (vw/vh) or pixels (px) units. All relative to the container
         */
        "unit": 'percentage' | 'viewport' | 'px';
    }
}
declare global {
    interface HTMLDeckgoDrrElement extends Components.DeckgoDrr, HTMLStencilElement {
    }
    var HTMLDeckgoDrrElement: {
        prototype: HTMLDeckgoDrrElement;
        new (): HTMLDeckgoDrrElement;
    };
    interface HTMLElementTagNameMap {
        "deckgo-drr": HTMLDeckgoDrrElement;
    }
}
declare namespace LocalJSX {
    interface DeckgoDrr {
        /**
          * Allow the component to be dragged in which direction
         */
        "drag"?: 'x-axis' | 'y-axis' | 'all' | 'none';
        /**
          * Emitted when the component is modified respectively when the user stop interacting. It propagates the host component itself
         */
        "onDrrDidChange"?: (event: CustomEvent<HTMLElement | undefined>) => void;
        /**
          * Emitted when the component is selected or unselected. It propagates the host component itself
         */
        "onDrrSelect"?: (event: CustomEvent<HTMLElement | undefined>) => void;
        /**
          * Allow or not the resize actions
         */
        "resize"?: boolean;
        /**
          * Allow or not the rotation of the element
         */
        "rotation"?: boolean;
        /**
          * To be used if your slotted element is to be defined as contentEditable. Useful for text edition. Note that if turns to true, the property resize is going to be set to false automatically
         */
        "text"?: boolean;
        /**
          * The component could be use with percentage, viewport (vw/vh) or pixels (px) units. All relative to the container
         */
        "unit"?: 'percentage' | 'viewport' | 'px';
    }
    interface IntrinsicElements {
        "deckgo-drr": DeckgoDrr;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "deckgo-drr": LocalJSX.DeckgoDrr & JSXBase.HTMLAttributes<HTMLDeckgoDrrElement>;
        }
    }
}
