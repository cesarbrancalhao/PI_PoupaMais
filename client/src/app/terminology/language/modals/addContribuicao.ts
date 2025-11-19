export const addContribuicaoModal = {
  // Title
  title: {
    pt: 'Adicionar Contribuição',
    en: 'Add Contribution',
    es: 'Agregar Contribución',
  },

  // Form fields
  goalName: {
    pt: 'Meta',
    en: 'Goal',
    es: 'Meta',
  },
  value: {
    pt: 'Valor',
    en: 'Value',
    es: 'Valor',
  },
  valuePlaceholder: {
    pt: 'Digite o valor da contribuição',
    en: 'Enter the contribution value',
    es: 'Ingrese el valor de la contribución',
  },
  date: {
    pt: 'Data',
    en: 'Date',
    es: 'Fecha',
  },
  description: {
    pt: 'Descrição (opcional)',
    en: 'Description (optional)',
    es: 'Descripción (opcional)',
  },
  descriptionPlaceholder: {
    pt: 'Descreva esta contribuição',
    en: 'Describe this contribution',
    es: 'Describa esta contribución',
  },

  // Buttons
  add: {
    pt: 'Adicionar',
    en: 'Add',
    es: 'Agregar',
  },
  cancel: {
    pt: 'Cancelar',
    en: 'Cancel',
    es: 'Cancelar',
  },

  // Validation messages
  valueRequired: {
    pt: 'Valor é obrigatório',
    en: 'Value is required',
    es: 'El valor es obligatorio',
  },
  invalidValue: {
    pt: 'Valor inválido',
    en: 'Invalid value',
    es: 'Valor inválido',
  },

  // Success/Error messages
  contributionAdded: {
    pt: 'Contribuição adicionada com sucesso',
    en: 'Contribution added successfully',
    es: 'Contribución agregada exitosamente',
  },
  errorAdding: {
    pt: 'Erro ao adicionar contribuição',
    en: 'Error adding contribution',
    es: 'Error al agregar contribución',
  },
  goalCompleted: {
    pt: 'Parabéns! Você atingiu sua meta!',
    en: 'Congratulations! You reached your goal!',
    es: '¡Felicitaciones! ¡Alcanzó su meta!',
  },
} as const;
