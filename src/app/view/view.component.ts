
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DynamicRendererComponent } from '../dynamic-renderer/dynamic-renderer.component'; // 👈 IMPORTA QUI


@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, DynamicRendererComponent, HttpClientModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  selectedConfigKey = 'default';
  showLoader = true;

  set selectedConfigKeySafe(key: string) {
    this.showLoader = false;
    setTimeout(() => {
      this.selectedConfigKey = key;
      this.showLoader = true;
    });
  }

  get configKeys(): string[] {
    return Object.keys(this.pageConfigurations);
  }

  pageConfigurations: Record<string, { title: string; config: string }> = {
    default: {
      title: 'Form Base',
      config: JSON.stringify([
        {
          "type": "input",
          "id": "nameInput",
          "label": "Nome:",
          "placeholder": "Inserisci il nome"
        },
        {
          "type": "input",
          "id": "ageInput",
          "label": "Età:",
          "placeholder": "Inserisci l'età"
        },
        {
          "type": "message",
          "id": "output",
          "message": "Pronto..."
        },
        {
          "type": "button",
          "id": "submitBtn",
          "label": "Invia",
          "expression": "if (parseInt(ageInput.getValue()) > 18) { output.setValue('Welcome ' + nameInput.getValue()); utils.sendToServer({ name: nameInput.getValue(), age: nameInput.getValue() }); } else { output.setValue('Access denied'); utils.log('Denied access for ' + nameInput.getValue()); }"
        }
      ])
    },
    welcomeMsg: {
      title: 'Messaggio di Benvenuto',
      config: JSON.stringify([
        {
          "type": "input",
          "id": "username",
          "label": "Utente",
          "placeholder": "Nome utente"
        },
        {
          "type": "message",
          "id": "welcome",
          "message": "Ciao!"
        },
        {
          "type": "button",
          "id": "btnWelcome",
          "label": "Saluta",
          "expression": "welcome.setValue('Benvenuto, ' + username.getValue())"
        }
      ])
    }
  };

  get selectedConfigJSON(): string {
    return this.pageConfigurations[this.selectedConfigKey].config;
  }
}
