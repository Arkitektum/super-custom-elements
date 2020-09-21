import { CustomElementOptions } from "./types";

export abstract class CustomElement extends HTMLElement {
  constructor() {
    super();
  }

  protected abstract setup(options?: CustomElementOptions): void;

  protected connect(selector: string): void {
    if (!this.isConnected) {
      document.querySelector(selector).appendChild(this);
    }
  }
}
