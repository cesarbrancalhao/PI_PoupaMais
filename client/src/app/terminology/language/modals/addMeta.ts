export const addMetaModal = {
  // Title
  title: {
    pt: 'Adicionar Meta',
    en: 'Add Goal',
    es: 'Agregar Meta',
  },

  // Form fields
  goalName: {
    pt: 'Nome da Meta',
    en: 'Goal Name',
    es: 'Nombre de la Meta',
  },
  goalNamePlaceholder: {
    pt: 'Ex: Viagem para Europa',
    en: 'e.g., Trip to Europe',
    es: 'Ej: Viaje a Europa',
  },
  targetValue: {
    pt: 'Valor Alvo',
    en: 'Target Value',
    es: 'Valor Objetivo',
  },
  targetValuePlaceholder: {
    pt: 'Digite o valor desejado',
    en: 'Enter the desired value',
    es: 'Ingrese el valor deseado',
  },
  initialValue: {
    pt: 'Valor Inicial (opcional)',
    en: 'Initial Value (optional)',
    es: 'Valor Inicial (opcional)',
  },
  initialValuePlaceholder: {
    pt: 'Valor já economizado',
    en: 'Value already saved',
    es: 'Valor ya ahorrado',
  },
  description: {
    pt: 'Descrição (opcional)',
    en: 'Description (optional)',
    es: 'Descripción (opcional)',
  },
  descriptionPlaceholder: {
    pt: 'Descreva sua meta',
    en: 'Describe your goal',
    es: 'Describa su meta',
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
  nameRequired: {
    pt: 'Nome é obrigatório',
    en: 'Name is required',
    es: 'El nombre es obligatorio',
  },
  targetValueRequired: {
    pt: 'Valor alvo é obrigatório',
    en: 'Target value is required',
    es: 'El valor objetivo es obligatorio',
  },
  invalidValue: {
    pt: 'Valor inválido',
    en: 'Invalid value',
    es: 'Valor inválido',
  },

  // Success/Error messages
  goalAdded: {
    pt: 'Meta adicionada com sucesso',
    en: 'Goal added successfully',
    es: 'Meta agregada exitosamente',
  },
  errorAdding: {
    pt: 'Erro ao adicionar meta',
    en: 'Error adding goal',
    es: 'Error al agregar meta',
  },
} as const;
