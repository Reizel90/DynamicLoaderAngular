import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  standalone: true,
  imports: [],
  templateUrl: './hello-world.component.html',
  styleUrl: './hello-world.component.scss'
})
export class HelloWorldComponent {
  id!: string;

  @Input() message: string = '';

  setValue(val: string) {
    this.message = val;
  }

  getValue() {
    return this.message;
  }
}
