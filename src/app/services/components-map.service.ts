import { Injectable, Type } from '@angular/core';
import { UnknownComponent } from '../common-components/unknown/unknown.component';

import { RowComponent } from '../common-components/row/row.component';
import { ColumnComponent } from '../common-components/column/column.component';
import { SectionComponent } from '../common-components/section/section.component';
import { DynamicInputComponent } from '../common-components/dynamic-input/dynamic-input.component';
import { DynamicCheckboxComponent } from '../common-components/dynamic-checkbox/dynamic-checkbox.component';
import { ButtonComponent } from '../common-components/button/button.component';
import { MessageComponent } from '../common-components/message/message.component';

@Injectable({ providedIn: 'root' })
export class ComponentsMapService {
  private readonly map = new Map<string, Type<any>>([
    ['row', RowComponent],
    ['column', ColumnComponent],
    ['section', SectionComponent],

    // alias utili
    ['input', DynamicInputComponent],
    ['dynamic-input', DynamicInputComponent],

    ['checkbox', DynamicCheckboxComponent],
    ['dynamic-checkbox', DynamicCheckboxComponent],

    ['button', ButtonComponent],
    ['message', MessageComponent],
  ]);

  resolve(type: string): Type<any> {
    return this.map.get(type) ?? UnknownComponent;
  }
}
