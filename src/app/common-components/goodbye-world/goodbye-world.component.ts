import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-goodbye-world',
  standalone: true,
  imports: [],
  templateUrl: './goodbye-world.component.html',
  styleUrl: './goodbye-world.component.scss'
})
export class GoodbyeWorldComponent {

  @Input() title: string = "";

}
