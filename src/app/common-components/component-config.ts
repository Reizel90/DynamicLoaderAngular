export type ComponentType = 'input' | 'message' | 'button';

export interface BaseComponentConfig {
  id: string;
  type: ComponentType;
  [key: string]: any; // Consente estensioni future
}

export interface InputComponentConfig extends BaseComponentConfig {
  type: 'input';
  label?: string;
  placeholder?: string;
}

export interface MessageComponentConfig extends BaseComponentConfig {
  type: 'message';
  message?: string;
}

export interface ButtonComponentConfig extends BaseComponentConfig {
  type: 'button';
  label?: string;
  expression?: string;
}

export type ComponentConfig =
  | InputComponentConfig
  | MessageComponentConfig
  | ButtonComponentConfig;