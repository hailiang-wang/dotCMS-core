/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface DotDropdownSlotItem {
    'label': string;
    'value': string;
  }
  interface DotDropdownSlotItemAttributes extends StencilHTMLAttributes {
    'label'?: string;
    'onDotItemClicked'?: (event: CustomEvent) => void;
    'value'?: string;
  }

  interface DotDropdownSlot {
    'close': () => void;
    'open': () => void;
  }
  interface DotDropdownSlotAttributes extends StencilHTMLAttributes {
    'onOnClose'?: (event: CustomEvent) => void;
    'onOnOpen'?: (event: CustomEvent) => void;
  }

  interface DotDropdown {
    'label': string;
    'value': string;
  }
  interface DotDropdownAttributes extends StencilHTMLAttributes {
    'label'?: string;
    'value'?: string;
  }

  interface DotTextfield {
    'hint': string;
    'label': string;
    'placeholder': string;
    'readOnly': string;
    'regexcheck': string;
    'required': boolean;
    'value': string;
  }
  interface DotTextfieldAttributes extends StencilHTMLAttributes {
    'hint'?: string;
    'label'?: string;
    'onOnCallback'?: (event: CustomEvent) => void;
    'placeholder'?: string;
    'readOnly'?: string;
    'regexcheck'?: string;
    'required'?: boolean;
    'value'?: string;
  }

  interface MyComponent {
    /**
    * The first name
    */
    'first': string;
    /**
    * The last name
    */
    'last': string;
    /**
    * The middle name
    */
    'middle': string;
  }
  interface MyComponentAttributes extends StencilHTMLAttributes {
    /**
    * The first name
    */
    'first'?: string;
    /**
    * The last name
    */
    'last'?: string;
    /**
    * The middle name
    */
    'middle'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'DotDropdownSlotItem': Components.DotDropdownSlotItem;
    'DotDropdownSlot': Components.DotDropdownSlot;
    'DotDropdown': Components.DotDropdown;
    'DotTextfield': Components.DotTextfield;
    'MyComponent': Components.MyComponent;
  }

  interface StencilIntrinsicElements {
    'dot-dropdown-slot-item': Components.DotDropdownSlotItemAttributes;
    'dot-dropdown-slot': Components.DotDropdownSlotAttributes;
    'dot-dropdown': Components.DotDropdownAttributes;
    'dot-textfield': Components.DotTextfieldAttributes;
    'my-component': Components.MyComponentAttributes;
  }


  interface HTMLDotDropdownSlotItemElement extends Components.DotDropdownSlotItem, HTMLStencilElement {}
  var HTMLDotDropdownSlotItemElement: {
    prototype: HTMLDotDropdownSlotItemElement;
    new (): HTMLDotDropdownSlotItemElement;
  };

  interface HTMLDotDropdownSlotElement extends Components.DotDropdownSlot, HTMLStencilElement {}
  var HTMLDotDropdownSlotElement: {
    prototype: HTMLDotDropdownSlotElement;
    new (): HTMLDotDropdownSlotElement;
  };

  interface HTMLDotDropdownElement extends Components.DotDropdown, HTMLStencilElement {}
  var HTMLDotDropdownElement: {
    prototype: HTMLDotDropdownElement;
    new (): HTMLDotDropdownElement;
  };

  interface HTMLDotTextfieldElement extends Components.DotTextfield, HTMLStencilElement {}
  var HTMLDotTextfieldElement: {
    prototype: HTMLDotTextfieldElement;
    new (): HTMLDotTextfieldElement;
  };

  interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {}
  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };

  interface HTMLElementTagNameMap {
    'dot-dropdown-slot-item': HTMLDotDropdownSlotItemElement
    'dot-dropdown-slot': HTMLDotDropdownSlotElement
    'dot-dropdown': HTMLDotDropdownElement
    'dot-textfield': HTMLDotTextfieldElement
    'my-component': HTMLMyComponentElement
  }

  interface ElementTagNameMap {
    'dot-dropdown-slot-item': HTMLDotDropdownSlotItemElement;
    'dot-dropdown-slot': HTMLDotDropdownSlotElement;
    'dot-dropdown': HTMLDotDropdownElement;
    'dot-textfield': HTMLDotTextfieldElement;
    'my-component': HTMLMyComponentElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
