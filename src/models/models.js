

export default function models(name) {
  const models = {
    users: {
      name: { type: 'input', required: true },
      gender: { type: 'select', enum: ['Male', 'Female'] },
      email: { type: 'input', required: true, validator: 'email' },
      phone: { type: 'input', mask: 'PhoneMask' },
      specialties: { type: 'input' },
      practice: { type: 'multiSelect', enum: 'fromDB', db: {table: 'practices', key: 'name'} }
    },
    practices: {
      name: { type: 'input', required: true },
      address: { type: 'input' },
      email: { type: 'input', required: true },
      phone: { type: 'input' },
      type: { type: 'input' }
    }
  }

  return models[name];
}