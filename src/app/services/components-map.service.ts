import { Injectable, Type } from '@angular/core';
import { GoodbyeWorldComponent } from '../common-components/goodbye-world/goodbye-world.component';
import { HelloWorldComponent } from '../common-components/hello-world/hello-world.component';
import { ButtonComponent } from '../common-components/button/button.component';
import { DynamicInputComponent } from '../common-components/dynamic-input/dynamic-input.component';
import { DynamicCheckboxComponent } from '../common-components/dynamic-checkbox/dynamic-checkbox.component';
import { InputComponent } from '../common-components/input/input.component';
import { MessageComponent } from '../common-components/message/message.component';
import { SectionComponent } from '../common-components/section/section.component';
import { ColumnComponent } from '../common-components/column/column.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentsMapService {
  private componentMap: { [key: string]: Type<any> } = {
    'HelloWorld': HelloWorldComponent,
    'GoodbyeWorld': GoodbyeWorldComponent,
    'Button': ButtonComponent,
    'DynamicInput': DynamicInputComponent,
    'DynamicCheckbox': DynamicCheckboxComponent,
    'input': InputComponent,
    'message': MessageComponent,
    'button': ButtonComponent,
    'section': SectionComponent,
    'column': ColumnComponent
  };

  getComponentByName(name: string) {
    return this.componentMap[name];
  }

  getAvailableComponents(): { type: string; label: string }[] {
    const availableTypes = [
      'section',
      'column',
      'message',
      'input',
      'button',
    ];
    return availableTypes
      .filter(type => this.componentMap[type])
      .map(type => ({ type, label: this.toLabel(type) }));
  }

  private toLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
