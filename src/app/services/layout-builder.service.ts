/**
 * Utility per creare configurazioni dinamiche di pagine con elementi innestati.
 * Semplifica la creazione di strutture complesse JSON.
 */

export interface LayoutElement {
  type: string;
  id: string;
  [key: string]: any;
}

export interface LayoutContainer extends LayoutElement {
  children?: LayoutElement[];
}

/**
 * Builder per creare configurazioni in modo fluent
 */
export class LayoutBuilder {
  /**
   * Crea una sezione con titolo
   */
  static section(id: string, title: string, children: LayoutElement[] = []): LayoutContainer {
    return {
      type: 'section',
      id,
      title,
      children
    };
  }

  /**
   * Crea una riga
   */
  static row(id: string, children: LayoutElement[] = []): LayoutContainer {
    return {
      type: 'row',
      id,
      children
    };
  }

  /**
   * Crea una colonna con flex dinamico
   */
  static column(id: string, flex: number = 1, children: LayoutElement[] = []): LayoutContainer {
    return {
      type: 'column',
      id,
      flex,
      children
    };
  }

  /**
   * Crea una colonna con larghezza fissa
   */
  static columnFixed(id: string, width: string, children: LayoutElement[] = []): LayoutContainer {
    return {
      type: 'column',
      id,
      width,
      children
    };
  }

  /**
   * Crea un input
   */
  static input(id: string, label: string, placeholder: string = ''): LayoutElement {
    return {
      type: 'input',
      id,
      label,
      placeholder
    };
  }

  /**
   * Crea un messaggio
   */
  static message(id: string, message: string): LayoutElement {
    return {
      type: 'message',
      id,
      message
    };
  }

  /**
   * Crea un pulsante con azione opzionale
   */
  static button(id: string, label: string, expression?: string): LayoutElement {
    return {
      type: 'button',
      id,
      label,
      ...(expression && { expression })
    };
  }

  /**
   * Crea un checkbox
   */
  static checkbox(id: string, label: string, checked: boolean = false): LayoutElement {
    return {
      type: 'dynamic-checkbox',
      id,
      label,
      checked
    };
  }

  /**
   * Converte un array di elementi in JSON stringificato
   */
  static toJSON(elements: LayoutElement[]): string {
    return JSON.stringify(elements);
  }
}

/**
 * Collezione di layout predefiniti complessi
 */
export class PredefinedLayouts {
  /**
   * Form di contatto con sezione dati personali e messaggio
   */
  static contactForm(): LayoutContainer[] {
    return [
      LayoutBuilder.section('contactSection', 'Modulo Contatti', [
        LayoutBuilder.row('nameRow', [
          LayoutBuilder.column('firstNameCol', 1, [
            LayoutBuilder.input('firstName', 'Nome', 'Es. Mario'),
            LayoutBuilder.input('lastName', 'Cognome', 'Es. Rossi')
          ]),
          LayoutBuilder.column('emailCol', 1, [
            LayoutBuilder.input('email', 'Email', 'tuo@email.com'),
            LayoutBuilder.input('phone', 'Telefono', '+39 123 456 7890')
          ])
        ]),
        LayoutBuilder.row('messageRow', [
          LayoutBuilder.column('messageCol', 1, [
            LayoutBuilder.input('message', 'Messaggio', 'Scrivi il tuo messaggio...')
          ])
        ]),
        LayoutBuilder.row('actionRow', [
          LayoutBuilder.column('buttonCol', 1, [
            LayoutBuilder.button(
              'sendBtn',
              'Invia',
              `utils.log('Form: ' + firstName.getValue() + ' ' + lastName.getValue() + ' - ' + email.getValue()); utils.sendToServer({ name: firstName.getValue() + ' ' + lastName.getValue(), email: email.getValue(), phone: phone.getValue(), message: message.getValue() })`
            )
          ])
        ])
      ])
    ];
  }

  /**
   * Form di registrazione avanzato
   */
  static registrationForm(): LayoutContainer[] {
    return [
      LayoutBuilder.section('registrationSection', 'Registrazione Utente', [
        LayoutBuilder.row('headerRow', [
          LayoutBuilder.column('headerCol', 1, [
            LayoutBuilder.message('header', 'Compila il modulo per registrarti')
          ])
        ]),
        LayoutBuilder.row('credentialsRow', [
          LayoutBuilder.column('usernameCol', 1, [
            LayoutBuilder.input('username', 'Nome Utente', 'Scegli uno username')
          ]),
          LayoutBuilder.column('emailCol', 1, [
            LayoutBuilder.input('regEmail', 'Email', 'tuo@email.com')
          ])
        ]),
        LayoutBuilder.row('passwordRow', [
          LayoutBuilder.column('passwordCol', 1, [
            LayoutBuilder.input('password', 'Password', 'Inserisci password')
          ]),
          LayoutBuilder.column('confirmCol', 1, [
            LayoutBuilder.input('confirmPassword', 'Conferma Password', 'Ripeti password')
          ])
        ]),
        LayoutBuilder.row('termsRow', [
          LayoutBuilder.column('termsCol', 1, [
            LayoutBuilder.checkbox('terms', 'Accetto i termini di servizio')
          ])
        ]),
        LayoutBuilder.row('submitRow', [
          LayoutBuilder.column('submitCol', 1, [
            LayoutBuilder.button('registerBtn', 'Registrati', 
              `utils.log('Registrazione: ' + username.getValue()); utils.sendToServer({ username: username.getValue(), email: regEmail.getValue() })`)
          ])
        ])
      ])
    ];
  }

  /**
   * Dashboard con layout sidebar
   */
  static dashboard(): LayoutContainer[] {
    return [
      LayoutBuilder.section('dashboardSection', 'Dashboard', [
        LayoutBuilder.row('mainRow', [
          LayoutBuilder.columnFixed('sidebar', '250px', [
            LayoutBuilder.message('sidebarTitle', '📋 Menu'),
            LayoutBuilder.button('menuStats', 'Statistiche'),
            LayoutBuilder.button('menuUsers', 'Utenti'),
            LayoutBuilder.button('menuSettings', 'Impostazioni')
          ]),
          LayoutBuilder.column('content', 1, [
            LayoutBuilder.message('contentTitle', '📊 Statistiche'),
            LayoutBuilder.row('statsRow', [
              LayoutBuilder.column('statCol1', 1, [
                LayoutBuilder.message('stat1', 'Visitatori: 1,234')
              ]),
              LayoutBuilder.column('statCol2', 1, [
                LayoutBuilder.message('stat2', 'Conversioni: 45.2%')
              ]),
              LayoutBuilder.column('statCol3', 1, [
                LayoutBuilder.message('stat3', 'Entrate: €15,200')
              ])
            ]),
            LayoutBuilder.row('searchRow', [
              LayoutBuilder.column('searchCol', 1, [
                LayoutBuilder.input('searchInput', 'Cerca', 'Digita per cercare...')
              ])
            ])
          ])
        ])
      ])
    ];
  }

  /**
   * Form multi-sezione
   */
  static multiSectionForm(): LayoutContainer[] {
    return [
      LayoutBuilder.section('section1', '1️⃣ Dati Personali', [
        LayoutBuilder.row('s1row1', [
          LayoutBuilder.column('s1col1', 1, [
            LayoutBuilder.input('s1firstName', 'Nome', 'Mario')
          ]),
          LayoutBuilder.column('s1col2', 1, [
            LayoutBuilder.input('s1lastName', 'Cognome', 'Rossi')
          ])
        ]),
        LayoutBuilder.row('s1row2', [
          LayoutBuilder.column('s1col3', 1, [
            LayoutBuilder.input('s1birthDate', 'Data di Nascita', 'GG/MM/AAAA')
          ])
        ])
      ]),
      LayoutBuilder.section('section2', '2️⃣ Contatti', [
        LayoutBuilder.row('s2row1', [
          LayoutBuilder.column('s2col1', 1, [
            LayoutBuilder.input('s2email', 'Email', 'mario@example.com')
          ]),
          LayoutBuilder.column('s2col2', 1, [
            LayoutBuilder.input('s2phone', 'Telefono', '+39 123 456 7890')
          ])
        ])
      ]),
      LayoutBuilder.section('section3', '3️⃣ Indirizzo', [
        LayoutBuilder.row('s3row1', [
          LayoutBuilder.column('s3col1', 2, [
            LayoutBuilder.input('s3address', 'Indirizzo', 'Via Roma, 123')
          ]),
          LayoutBuilder.column('s3col2', 1, [
            LayoutBuilder.input('s3zipcode', 'CAP', '00100')
          ])
        ]),
        LayoutBuilder.row('s3row2', [
          LayoutBuilder.column('s3col3', 1, [
            LayoutBuilder.input('s3city', 'Città', 'Roma')
          ]),
          LayoutBuilder.column('s3col4', 1, [
            LayoutBuilder.input('s3country', 'Paese', 'Italia')
          ])
        ])
      ]),
      LayoutBuilder.section('submitSection', '✅ Conferma', [
        LayoutBuilder.row('submitRow', [
          LayoutBuilder.column('submitCol', 1, [
            LayoutBuilder.message('confirmMsg', 'Controlla i dati e conferma'),
            LayoutBuilder.button('submitBtn', 'Invia Modulo',
              `utils.log('Modulo completo inviato'); utils.sendToServer({ nome: s1firstName.getValue(), cognome: s1lastName.getValue(), email: s2email.getValue() })`)
          ])
        ])
      ])
    ];
  }

  /**
   * Griglia di prodotti
   */
  static productGrid(): LayoutContainer[] {
    return [
      LayoutBuilder.section('productsSection', '🛍️ Prodotti', [
        LayoutBuilder.row('filterRow', [
          LayoutBuilder.column('filterCol', 1, [
            LayoutBuilder.input('searchProduct', 'Cerca prodotto', 'Nome prodotto...')
          ])
        ]),
        LayoutBuilder.row('row1', [
          LayoutBuilder.column('product1Col', 1, [
            LayoutBuilder.message('product1Name', 'Prodotto A'),
            LayoutBuilder.message('product1Price', 'Prezzo: €29,99'),
            LayoutBuilder.button('buyBtn1', 'Aggiungi al Carrello')
          ]),
          LayoutBuilder.column('product2Col', 1, [
            LayoutBuilder.message('product2Name', 'Prodotto B'),
            LayoutBuilder.message('product2Price', 'Prezzo: €39,99'),
            LayoutBuilder.button('buyBtn2', 'Aggiungi al Carrello')
          ]),
          LayoutBuilder.column('product3Col', 1, [
            LayoutBuilder.message('product3Name', 'Prodotto C'),
            LayoutBuilder.message('product3Price', 'Prezzo: €49,99'),
            LayoutBuilder.button('buyBtn3', 'Aggiungi al Carrello')
          ])
        ])
      ])
    ];
  }
}
