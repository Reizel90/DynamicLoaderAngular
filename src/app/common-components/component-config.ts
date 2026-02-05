export type ComponentType = string;

export interface ActionConfig {
  type: 'emit' | 'call' | 'navigate'; // estendibile
  name?: string;                      // es: "save", "reset"
  args?: any;                         // argomenti raw o binding
}

export interface ComponentConfig {
  /** id stabile (fondamentale per update/track/render diff) */
  id: string;

  /** type usato dal registry (es: "row", "dynamic-input") */
  type: ComponentType;

  /** props statiche */
  props?: Record<string, any>;

  /** binding dinamici: "label": "{{state.user.name}}" ecc. */
  bindings?: Record<string, string>;

  /** azioni/eventi: onClick, onChange, ... */
  actions?: Record<string, ActionConfig>;

  /** figli (layout tree) */
  children?: ComponentConfig[];

  /** slot opzionale per layout complessi (column left/right ecc.) */
  slot?: string;
}
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
