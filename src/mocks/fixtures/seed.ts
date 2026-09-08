import type { Category, DemoCustomer, ModifierGroup, Product, StoreCapabilities } from '../../shared/types/domain'

export const demoCustomer: DemoCustomer = {
  id: 'CUST001', firstName: 'Priyanshu', phone: '+919876543210', tier: 'GOLD',
  pointsAvailable: 182, pointsPending: 19, rolling120Orders: 8, rolling120Spend: 3620,
  lifetimeOrders: 14, lifetimeValue: 6891, averageOrderValue: 492, preferredCategory: 'Pizza',
  tags: ['Gold Wave', 'Pizza Lover', 'Weekend Buyer', 'Repeat Customer'],
}

export const demoCapabilities: StoreCapabilities = {
  store: { id: 'STORE-PURI-GRAND-ROAD', name: 'The Pizza Wave', city: 'Puri', open: true, acceptanceMode: 'HYBRID' },
  deliveryEnabled: true, pickupEnabled: true, storeOrderEnabled: true,
}

export const categories: Category[] = [
  { id: 'pizza', name: 'Pizza', color: 'orange', sortOrder: 1 },
  { id: 'kulhad', name: 'Kulhad Pizza', color: 'yellow', sortOrder: 2 },
  { id: 'quick-bites', name: 'Quick Bites', color: 'green', sortOrder: 3 },
  { id: 'drinks', name: 'Drinks', color: 'sky', sortOrder: 4 },
  { id: 'desserts', name: 'Desserts', color: 'pink', sortOrder: 5 },
]

const pizzaModifiers: ModifierGroup[] = [
  { id: 'size', name: 'Size', required: true, options: [{ id: 'regular', name: 'Regular', priceDelta: 0 }, { id: 'medium', name: 'Medium', priceDelta: 80 }, { id: 'large', name: 'Large', priceDelta: 150 }] },
  { id: 'base', name: 'Base', required: true, options: [{ id: 'normal', name: 'Normal', priceDelta: 0 }, { id: 'whole-wheat', name: 'Whole Wheat', priceDelta: 30 }, { id: 'multigrain', name: 'Multigrain', priceDelta: 40 }] },
  { id: 'cheese', name: 'Cheese', required: true, options: [{ id: 'regular-cheese', name: 'Regular', priceDelta: 0 }, { id: 'extra-cheese', name: 'Extra', priceDelta: 45 }] },
  { id: 'toppings', name: 'Toppings', required: false, multiple: true, options: ['Paneer', 'Mushroom', 'Corn', 'Olives', 'Jalapeño'].map((name) => ({ id: name.toLowerCase(), name, priceDelta: 30 })) },
  { id: 'spice', name: 'Spice', required: true, options: ['Mild', 'Medium', 'Spicy'].map((name) => ({ id: name.toLowerCase(), name, priceDelta: 0 })) },
]

const product = (id: string, name: string, description: string, category: string, price: number, veg: boolean, prepMinutes: number, complexity: number, station: Product['station'], image: string, badges: Product['badges'], modifiers = false): Product => ({
  id, name, description, category, price, veg, available: true, prepMinutes, complexity, station, image, badges, modifierGroups: modifiers ? pizzaModifiers : undefined,
})

export const products: Product[] = [
  product('PIZZA-VEG-001', 'Classic Veg Pizza', 'Onion, tomato, capsicum, corn and mozzarella on a golden crust.', 'pizza', 110, true, 14, 2, 'PIZZA', '/assets/products/pizza/classic-veg-pizza.webp', ['Bestseller', 'Veg', 'Customizable'], true),
  product('PIZZA-PANEER-001', 'Paneer Cheese Pizza', 'Paneer, capsicum and onion with a generous layer of mozzarella.', 'pizza', 229, true, 16, 2, 'PIZZA', '/assets/products/pizza/paneer-cheese-pizza.webp', ['Veg', 'Customizable'], true),
  product('PIZZA-MUSH-001', 'Mushroom Cheese Pizza', 'Sliced mushroom, browned mozzarella and herbs.', 'pizza', 199, true, 16, 2, 'PIZZA', '/assets/products/pizza/mushroom-cheese-pizza.webp', ['Veg', 'Customizable'], true),
  product('PIZZA-CHK-001', 'Chicken Tikka Pizza', 'Roasted chicken tikka, onion, capsicum and mozzarella.', 'pizza', 249, false, 18, 3, 'PIZZA', '/assets/products/pizza/chicken-tikka-pizza.webp', ['Spicy', 'Customizable'], true),
  product('KULHAD-001', 'Signature Kulhad Pizza', 'Molten cheese and pizza filling baked in a rustic clay kulhad.', 'kulhad', 199, true, 20, 3, 'ASSEMBLY', '/assets/products/kulhad/signature-kulhad-pizza.webp', ['Wave Exclusive', 'Veg']),
  product('BURGER-001', 'Paneer Crunch Burger', 'Crisp paneer patty, lettuce, onion and signature sauce.', 'quick-bites', 149, true, 10, 1, 'ASSEMBLY', '/assets/products/burger/paneer-crunch-burger.webp', ['Veg']),
  product('WRAP-001', 'Chicken Tikka Wrap', 'Chicken tikka, fresh vegetables and sauce in a grilled wrap.', 'quick-bites', 179, false, 10, 1, 'ASSEMBLY', '/assets/products/wrap/chicken-tikka-wrap.webp', ['Spicy']),
  product('FRIES-001', 'Peri Peri Fries', 'Crisp fries tossed in lively peri-peri seasoning.', 'quick-bites', 99, true, 6, 1, 'FRY', '/assets/products/sides/peri-peri-fries.webp', ['Veg']),
  product('GARLIC-001', 'Cheesy Garlic Bread', 'Toasted garlic bread with melted cheese and herbs.', 'quick-bites', 129, true, 8, 1, 'ASSEMBLY', '/assets/products/sides/cheesy-garlic-bread.webp', ['Veg']),
  product('SHAKE-001', 'Oreo Thick Shake', 'Creamy cookie-crumb thick shake.', 'drinks', 149, true, 4, 1, 'BEVERAGE', '/assets/products/drinks/oreo-thick-shake.webp', ['Bestseller', 'Veg']),
  product('COFFEE-001', 'Cold Coffee', 'Chilled, creamy and frothy coffee.', 'drinks', 119, true, 4, 1, 'BEVERAGE', '/assets/products/drinks/cold-coffee.webp', ['Veg']),
  product('BROWNIE-001', 'Chocolate Brownie', 'Dense, moist brownie with a lightly cracked top.', 'desserts', 99, true, 2, 1, 'ASSEMBLY', '/assets/products/desserts/chocolate-brownie.webp', ['Veg']),
]

export const smartCollections = [
  { id: 'under-199', name: 'Under ₹199' }, { id: 'best-sellers', name: 'Best Sellers' },
  { id: 'veg-favourites', name: 'Veg Favourites' }, { id: 'cheese-lovers', name: 'Cheese Lovers' },
  { id: 'for-two', name: 'For Two' }, { id: 'family', name: 'Family' },
  { id: 'quick-bites', name: 'Quick Bites' }, { id: 'something-sweet', name: 'Something Sweet' },
]
