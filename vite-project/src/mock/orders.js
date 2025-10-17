export const orders = [
  {
    id: 1,
    userId: 2,
    userName: 'Juan Pérez',
    userEmail: 'juan.perez@email.com',
    orderDate: '2025-10-15T14:30:00',
    status: 'delivered',
    total: 15500,
    items: [
      {
        productId: 1,
        productName: 'Botella Reutilizable',
        quantity: 2,
        price: 7500
      },
      {
        productId: 3,
        productName: 'Bolsa de Tela',
        quantity: 1,
        price: 500
      }
    ],
    shippingAddress: {
      address: 'Calle Falsa 123',
      city: 'Buenos Aires',
      zipCode: '1428'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'approved'
  },
  {
    id: 2,
    userId: 3,
    userName: 'María García',
    userEmail: 'maria.garcia@email.com',
    orderDate: '2025-10-14T10:15:00',
    status: 'shipped',
    total: 8900,
    items: [
      {
        productId: 2,
        productName: 'Taza Térmica',
        quantity: 1,
        price: 8900
      }
    ],
    shippingAddress: {
      address: 'Av. Santa Fe 5678',
      city: 'Buenos Aires',
      zipCode: '1425'
    },
    paymentMethod: 'mercadopago',
    paymentStatus: 'approved'
  },
  {
    id: 3,
    userId: 4,
    userName: 'Carlos López',
    userEmail: 'carlos.lopez@email.com',
    orderDate: '2025-10-13T16:45:00',
    status: 'processing',
    total: 24500,
    items: [
      {
        productId: 4,
        productName: 'Kit de Utensilios',
        quantity: 1,
        price: 12000
      },
      {
        productId: 1,
        productName: 'Botella Reutilizable',
        quantity: 1,
        price: 7500
      },
      {
        productId: 5,
        productName: 'Cepillo de Bambú',
        quantity: 1,
        price: 5000
      }
    ],
    shippingAddress: {
      address: 'Av. Rivadavia 9876',
      city: 'Buenos Aires',
      zipCode: '1406'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'approved'
  },
  {
    id: 4,
    userId: 5,
    userName: 'Ana Martínez',
    userEmail: 'ana.martinez@email.com',
    orderDate: '2025-10-12T11:20:00',
    status: 'delivered',
    total: 18000,
    items: [
      {
        productId: 6,
        productName: 'Jabón Natural',
        quantity: 3,
        price: 6000
      }
    ],
    shippingAddress: {
      address: 'Calle Libertad 456',
      city: 'Buenos Aires',
      zipCode: '1012'
    },
    paymentMethod: 'mercadopago',
    paymentStatus: 'approved'
  },
  {
    id: 5,
    userId: 2,
    userName: 'Juan Pérez',
    userEmail: 'juan.perez@email.com',
    orderDate: '2025-10-10T09:00:00',
    status: 'cancelled',
    total: 7500,
    items: [
      {
        productId: 1,
        productName: 'Botella Reutilizable',
        quantity: 1,
        price: 7500
      }
    ],
    shippingAddress: {
      address: 'Calle Falsa 123',
      city: 'Buenos Aires',
      zipCode: '1428'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'rejected'
  },
  {
    id: 6,
    userId: 3,
    userName: 'María García',
    userEmail: 'maria.garcia@email.com',
    orderDate: '2025-10-09T15:30:00',
    status: 'pending',
    total: 13000,
    items: [
      {
        productId: 7,
        productName: 'Compostador Doméstico',
        quantity: 1,
        price: 13000
      }
    ],
    shippingAddress: {
      address: 'Av. Santa Fe 5678',
      city: 'Buenos Aires',
      zipCode: '1425'
    },
    paymentMethod: 'cash',
    paymentStatus: 'pending'
  }
];