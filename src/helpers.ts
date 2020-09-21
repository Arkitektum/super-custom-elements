export const getElement = <T extends HTMLElement>(selector: string): T => {
  return document.querySelector(selector);
};

export const getShadowRootElement = <T extends HTMLElement>(customElement: HTMLElement, selector: string): T => {
  return customElement.shadowRoot.querySelector(selector);
};