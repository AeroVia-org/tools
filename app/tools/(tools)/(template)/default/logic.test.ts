import { describe, it, expect } from 'vitest'
import { calculateDefault } from './logic'

describe('Default Calculator', () => {
  it('should calculate correctly', () => {
    const result = calculateDefault(0)
    expect(result).toBe(1)
  })
})
