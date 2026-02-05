import { Component, ViewChild, ViewContainerRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { ComponentConfig } from '../component-config';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent {
  @Input() config?: ComponentConfig;

  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;
}
