
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DynamicRendererComponent, SimpleNodeConfig } from '../dynamic-renderer/dynamic-renderer.component';
import { LayoutBuilder, PredefinedLayouts } from '../services/layout-builder.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterModule, DynamicRendererComponent, HttpClientModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  selectedConfigKey = 'contactForm';
  showLoader = true;
  nodes: SimpleNodeConfig[] = [];

  loadConfig(rawJson: string) {
    try {
      const parsed = JSON.parse(rawJson);
      this.nodes = parsed;
    } catch (e) {
      console.error('Config JSON non valida', e);
      this.nodes = [];
    }
  }

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

  get selectedConfigJSON(): string {
    this.loadConfig(this.pageConfigurations[this.selectedConfigKey].config);
    return this.pageConfigurations[this.selectedConfigKey].config;
  }

  pageConfigurations: Record<string, { title: string; config: string }> = {
    // ============ LAYOUT PREDEFINITI ============
    contactForm: {
      title: '📧 Modulo Contatti',
      config: LayoutBuilder.toJSON(PredefinedLayouts.contactForm())
    },
    registrationForm: {
      title: '✍️ Registrazione Utente',
      config: LayoutBuilder.toJSON(PredefinedLayouts.registrationForm())
    },
    dashboard: {
      title: '📊 Dashboard',
      config: LayoutBuilder.toJSON(PredefinedLayouts.dashboard())
    },
    multiSectionForm: {
      title: '📋 Modulo Multi-Sezione',
      config: LayoutBuilder.toJSON(PredefinedLayouts.multiSectionForm())
    },
    productGrid: {
      title: '🛍️ Griglia Prodotti',
      config: LayoutBuilder.toJSON(PredefinedLayouts.productGrid())
    },

    // ============ LAYOUT LEGACY ============
    default: {
      title: 'Form Base (Legacy)',
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
    },
    simpleLayout: {
      title: 'Layout Semplice (Sezione + Riga + Colonna)',
      config: LayoutBuilder.toJSON([
        LayoutBuilder.section('section1', 'Informazioni Personali', [
          LayoutBuilder.row('row1', [
            LayoutBuilder.column('col1', 1, [
              LayoutBuilder.input('firstname', 'Nome', 'Es. Giovanni')
            ]),
            LayoutBuilder.column('col2', 1, [
              LayoutBuilder.input('lastname', 'Cognome', 'Es. Rossi')
            ])
          ])
        ])
      ])
    },
    complexLayout: {
      title: 'Layout Complesso (Multi-Livello)',
      config: LayoutBuilder.toJSON([
        LayoutBuilder.section('mainSection', 'Modulo Completo', [
          LayoutBuilder.row('headerRow', [
            LayoutBuilder.column('titleCol', 1, [
              LayoutBuilder.message('title', 'Benvenuto nel modulo di registrazione')
            ])
          ]),
          LayoutBuilder.row('personDataRow', [
            LayoutBuilder.column('col3', 1, [
              LayoutBuilder.input('name', 'Nome Completo', 'Inserisci nome e cognome')
            ]),
            LayoutBuilder.column('col4', 1, [
              LayoutBuilder.input('email', 'Email', 'esempio@email.com')
            ])
          ]),
          LayoutBuilder.row('detailsRow', [
            LayoutBuilder.column('col5', 2, [
              LayoutBuilder.input('address', 'Indirizzo', 'Via, numero civico')
            ]),
            LayoutBuilder.column('col6', 1, [
              LayoutBuilder.input('city', 'Città', 'Città')
            ])
          ]),
          LayoutBuilder.row('actionRow', [
            LayoutBuilder.column('buttonCol', 1, [
              LayoutBuilder.button('submitBtn', 'Registrati',
                `utils.log('Registrazione inviata: ' + name.getValue() + ' - ' + email.getValue()); utils.sendToServer({ name: name.getValue(), email: email.getValue(), address: address.getValue(), city: city.getValue() })`)
            ])
          ])
        ])
      ])
    },
    twoColumnLayout: {
      title: 'Layout Due Colonne',
      config: LayoutBuilder.toJSON([
        LayoutBuilder.section('twoColSection', 'Informazioni in Due Colonne', [
          LayoutBuilder.row('mainRow', [
            LayoutBuilder.columnFixed('leftColumn', '40%', [
              LayoutBuilder.message('leftTitle', 'Colonna Sinistra'),
              LayoutBuilder.input('leftInput1', 'Campo 1', 'Inserisci valore'),
              LayoutBuilder.input('leftInput2', 'Campo 2', 'Inserisci valore')
            ]),
            LayoutBuilder.column('rightColumn', 1, [
              LayoutBuilder.message('rightTitle', 'Colonna Destra'),
              LayoutBuilder.input('rightInput1', 'Campo 3', 'Inserisci valore'),
              LayoutBuilder.input('rightInput2', 'Campo 4', 'Inserisci valore')
            ])
          ])
        ])
      ])
    }
  };
}
