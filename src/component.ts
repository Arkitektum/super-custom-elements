import { addEventListeners, ListenerMetadata } from './listen';
import { initializeProps } from './prop';
import { ComponentMetadata, KeyValue } from './types';
import { toKebabCase, toCamelCase } from './util';

export const Component = (args: ComponentMetadata) => {
  return (target: any) => {
    const tag: string = args.tag || toKebabCase(target.prototype.constructor.name);
    const customElement: any = class extends (target as { new(): any }) {
      protected static __connected: boolean = false;
      protected static propsInit: KeyValue;
      protected static watchAttributes: KeyValue;
      protected static listeners: ListenerMetadata[];
      protected static ready: Promise<boolean> = new Promise((resolve, _) => resolve(true));
      public props: KeyValue = {};
      private showShadowRoot: boolean;

      public static get observedAttributes(): string[] {
        return Object.keys(this.propsInit || {}).map(x => toKebabCase(x));
      }

      constructor() {
        super();

        this.showShadowRoot = args.shadow == null ? true : args.shadow;

        if (!this.shadowRoot && this.showShadowRoot) {
          this.attachShadow({ mode: 'open' });
        }
      }

      public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        this.onAttributeChange(name, oldValue, newValue);
      }

      public onAttributeChange(name: string, oldValue: string, newValue: string, set: boolean = true): void {
        if (oldValue != newValue) {
          if (set) { this[toCamelCase(name)] = newValue; }
          const watchAttributes: KeyValue = (this.constructor as any).watchAttributes;
          if (watchAttributes && watchAttributes[name]) {
            const methodToCall: string = watchAttributes[name];
            if (this.__connected) {
              if (typeof this[methodToCall] == 'function') {
                this[methodToCall]({ old: oldValue, new: newValue });
              }
            }
          }
        }
      }

      public async connectedCallback(): Promise<void> {
        await this.render();
        super.connectedCallback && super.connectedCallback();
        this.__connected = true;

        addEventListeners(this);
        initializeProps(this);
      }

      private async render(): Promise<void> {
        if (this.__connected) {
          return;
        }

        const template = document.createElement('template');
        template.innerHTML = await this.getStyle();

        if (args.template instanceof Promise) {
          template.content.appendChild(await this.getExternalTemplate());
        } else if (typeof args.template === 'string') {
          template.innerHTML += args.template;
        }

        (this.showShadowRoot ? this.shadowRoot : this).appendChild(template.content.cloneNode(true));
      }

      private async getExternalTemplate(): Promise<DocumentFragment> {
        const templateModule = await (args.template as Promise<typeof import('*.html')>);
        const markup = templateModule.default.toString();
        const fragment = document.createRange().createContextualFragment(markup);

        if (fragment.children.length === 1 && fragment.children[0].nodeName === 'TEMPLATE') {
          return (fragment.firstChild as HTMLTemplateElement).content;
        }
        return fragment;
      }

      private async getStyle(): Promise<string> {
        let css: string;

        if (args.style instanceof Promise) {
          const styleModule = await args.style;
          css = styleModule.default.toString();
        } else if (typeof args.style === 'string') {
          css = args.style;
        }

        return `${css ? `<style>${css}</style>` : ''}`
      }
    };

    if (!customElements.get(tag)) {
      customElements.define(tag, customElement);
    }

    return customElement;
  };
};


