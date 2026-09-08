import type { Category, ModifierGroup, Product, SmartCollection } from '../../domain/catalog/catalog.types'

export const categorySeed: Category[] = [
  { id: 'pizza', name: 'Pizza', color: 'orange', sortOrder: 1 },
  { id: 'kulhad', name: 'Kulhad Pizza', color: 'yellow', sortOrder: 2 },
  { id: 'quick-bites', name: 'Quick Bites', color: 'green', sortOrder: 3 },
  { id: 'drinks', name: 'Drinks', color: 'sky', sortOrder: 4 },
  { id: 'desserts', name: 'Desserts', color: 'pink', sortOrder: 5 },
]

const pizzaModifiers: ModifierGroup[] = [
  { id: 'size', name: 'Size', required: true, minSelections: 1, maxSelections: 1, options: [{ id: 'regular', name: 'Regular', priceDelta: 0, available: true }, { id: 'medium', name: 'Medium', priceDelta: 80, available: true }, { id: 'large', name: 'Large', priceDelta: 150, available: true }] },
  { id: 'base', name: 'Base', required: true, minSelections: 1, maxSelections: 1, options: [{ id: 'normal', name: 'Normal', priceDelta: 0, available: true }, { id: 'whole-wheat', name: 'Whole Wheat', priceDelta: 30, available: true }, { id: 'multigrain', name: 'Multigrain', priceDelta: 40, available: true }] },
  { id: 'cheese', name: 'Cheese', required: true, minSelections: 1, maxSelections: 1, options: [{ id: 'regular-cheese', name: 'Regular', priceDelta: 0, available: true }, { id: 'extra-cheese', name: 'Extra', priceDelta: 45, available: true }] },
  { id: 'toppings', name: 'Toppings', required: false, minSelections: 0, multiple: true, options: ['Paneer', 'Mushroom', 'Corn', 'Olives', 'Jalapeño'].map((name) => ({ id: name.toLowerCase(), name, priceDelta: 30, available: true })) },
  { id: 'spice', name: 'Spice', required: true, minSelections: 1, maxSelections: 1, options: ['Mild', 'Medium', 'Spicy'].map((name) => ({ id: name.toLowerCase(), name, priceDelta: 0, available: true })) },
]

const product = (id: string, slug: string, name: string, shortDescription: string, categoryId: string, basePrice: number, veg: boolean, prepMinutes: number, complexity: number, station: Product['station'], imageKey: string, badges: Product['badges'], modifiers = false, recommendedPairings: string[] = []): Product => ({
  id, slug, name, shortDescription, categoryId, basePrice, veg, available: true, prepMinutes, complexity, station, imageKey, badges,
  modifierGroups: modifiers ? pizzaModifiers : undefined, recommendedPairings,
})

export const productSeed: Product[] = [
  product('PIZZA-VEG-001', 'classic-veg-pizza', 'Classic Veg Pizza', 'Onion, tomato, capsicum, corn and mozzarella on a golden crust.', 'pizza', 110, true, 14, 2, 'PIZZA', 'pizza/classic-veg-pizza.webp', ['Bestseller', 'Veg', 'Customizable'], true, ['COFFEE-001']),
  product('PIZZA-PANEER-001', 'paneer-cheese-pizza', 'Paneer Cheese Pizza', 'Paneer, capsicum and onion with a generous layer of mozzarella.', 'pizza', 229, true, 16, 2, 'PIZZA', 'pizza/paneer-cheese-pizza.webp', ['Veg', 'Customizable'], true),
  product('PIZZA-MUSH-001', 'mushroom-cheese-pizza', 'Mushroom Cheese Pizza', 'Sliced mushroom, browned mozzarella and herbs.', 'pizza', 199, true, 16, 2, 'PIZZA', 'pizza/mushroom-cheese-pizza.webp', ['Veg', 'Customizable'], true),
  product('PIZZA-CHK-001', 'chicken-tikka-pizza', 'Chicken Tikka Pizza', 'Roasted chicken tikka, onion, capsicum and mozzarella.', 'pizza', 249, false, 18, 3, 'PIZZA', 'pizza/chicken-tikka-pizza.webp', ['Spicy', 'Customizable'], true),
  product('KULHAD-001', 'signature-kulhad-pizza', 'Signature Kulhad Pizza', 'Molten cheese and pizza filling baked in a rustic clay kulhad.', 'kulhad', 199, true, 20, 3, 'ASSEMBLY', 'kulhad/signature-kulhad-pizza.webp', ['Wave Exclusive', 'Veg']),
  product('BURGER-001', 'paneer-crunch-burger', 'Paneer Crunch Burger', 'Crisp paneer patty, lettuce, onion and signature sauce.', 'quick-bites', 149, true, 10, 1, 'ASSEMBLY', 'burger/paneer-crunch-burger.webp', ['Veg']),
  product('WRAP-001', 'chicken-tikka-wrap', 'Chicken Tikka Wrap', 'Chicken tikka, fresh vegetables and sauce in a grilled wrap.', 'quick-bites', 179, false, 10, 1, 'ASSEMBLY', 'wrap/chicken-tikka-wrap.webp', ['Spicy']),
  product('FRIES-001', 'peri-peri-fries', 'Peri Peri Fries', 'Crisp fries tossed in lively peri-peri seasoning.', 'quick-bites', 99, true, 6, 1, 'FRY', 'sides/peri-peri-fries.webp', ['Veg']),
  product('GARLIC-001', 'cheesy-garlic-bread', 'Cheesy Garlic Bread', 'Toasted garlic bread with melted cheese and herbs.', 'quick-bites', 129, true, 8, 1, 'ASSEMBLY', 'sides/cheesy-garlic-bread.webp', ['Veg']),
  product('SHAKE-001', 'oreo-thick-shake', 'Oreo Thick Shake', 'Creamy cookie-crumb thick shake.', 'drinks', 149, true, 4, 1, 'BEVERAGE', 'drinks/oreo-thick-shake.webp', ['Bestseller', 'Veg']),
  product('COFFEE-001', 'cold-coffee', 'Cold Coffee', 'Chilled, creamy and frothy coffee.', 'drinks', 119, true, 4, 1, 'BEVERAGE', 'drinks/cold-coffee.webp', ['Veg']),
  product('BROWNIE-001', 'chocolate-brownie', 'Chocolate Brownie', 'Dense, moist brownie with a lightly cracked top.', 'desserts', 99, true, 2, 1, 'ASSEMBLY', 'desserts/chocolate-brownie.webp', ['Veg']),
]

export const smartCollectionSeed: SmartCollection[] = [
  { id: 'under-199', name: 'Under ₹199' }, { id: 'best-sellers', name: 'Best Sellers' },
  { id: 'veg-favourites', name: 'Veg Favourites' }, { id: 'cheese-lovers', name: 'Cheese Lovers' },
  { id: 'for-two', name: 'For Two' }, { id: 'family', name: 'Family' },
  { id: 'quick-bites', name: 'Quick Bites' }, { id: 'something-sweet', name: 'Something Sweet' },
]
