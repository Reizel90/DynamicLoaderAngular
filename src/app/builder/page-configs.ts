export const pageConfigurations: Record<string, string> = {
  simpleForm: JSON.stringify([
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
};
