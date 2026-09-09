import { describe, expect, it } from 'vitest'
import { pizzaModifiers } from '../../prototype/seed/catalog.seed'
import { availableOptions, configuredUnitPrice, defaultModifierSelections, validateModifierSelections } from './modifier.engine'

describe('modifier engine', () => {
  it('provides valid server defaults for compact fast-add', () => {
    const selections = defaultModifierSelections(pizzaModifiers)
    expect(validateModifierSelections(pizzaModifiers, selections)).toEqual([])
    expect(selections.map((selection) => selection.groupId)).toEqual(['size', 'base', 'sauce', 'cheese', 'spice'])
  })

  it('prices configured options from typed modifier data', () => {
    const selections = [
      { groupId: 'size', optionIds: ['medium'] }, { groupId: 'base', optionIds: ['whole-wheat'] },
      { groupId: 'sauce', optionIds: ['smoky-makhani'] }, { groupId: 'cheese', optionIds: ['extra-cheese'] },
      { groupId: 'toppings', optionIds: ['mushroom', 'corn'] }, { groupId: 'spice', optionIds: ['spice-spicy'] },
    ]
    expect(configuredUnitPrice(110, pizzaModifiers, selections)).toBe(345)
  })

  it('enforces variant dependencies and maximum selections', () => {
    const cheese = pizzaModifiers.find((group) => group.id === 'cheese')!
    expect(availableOptions(cheese, [{ groupId: 'size', optionIds: ['regular'] }]).some((option) => option.id === 'double-mozzarella')).toBe(false)
    expect(availableOptions(cheese, [{ groupId: 'size', optionIds: ['large'] }]).some((option) => option.id === 'double-mozzarella')).toBe(true)
    const toppings = pizzaModifiers.find((group) => group.id === 'toppings')!
    expect(validateModifierSelections([toppings], [{ groupId: 'toppings', optionIds: ['paneer', 'mushroom', 'corn', 'olives'] }])[0]?.message).toContain('up to 3')
  })
})
