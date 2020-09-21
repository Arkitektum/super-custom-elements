export interface ComponentMetadata {
  tag?: string;
  template?: string | Promise<typeof import('*.html')>
  style?: string | Promise<typeof import('*.scss')>
  shadow?: boolean;
}

export interface CustomElementOptions {
  id?: string,
  container?: 'string'
}

export interface KeyValue {
  [key: string]: any;
}
