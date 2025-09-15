import { describe, it, expect } from 'vitest'
import { calculateIsaFromAltitude } from './logic'

describe('ISA Calculator Logic', () => {
  it('should calculate sea level properties correctly', () => {
    const result = calculateIsaFromAltitude(0)
    
    expect(result.altitude).toBe(0)
    expect(result.temperature).toBeCloseTo(288.15, 2)
    expect(result.pressure).toBeCloseTo(101325, 0)
    expect(result.density).toBeCloseTo(1.225, 3)
  })

  it('should calculate troposphere properties correctly', () => {
    const result = calculateIsaFromAltitude(1000)
    
    expect(result.altitude).toBe(1000)
    expect(result.temperature).toBeCloseTo(281.65, 2)
    expect(result.pressure).toBeCloseTo(89874, 0)
    expect(result.density).toBeCloseTo(1.112, 3)
  })

  it('should throw error for negative altitude', () => {
    expect(() => calculateIsaFromAltitude(-100)).toThrow('Altitude cannot be negative')
  })

  it('should throw error for altitude above 86km', () => {
    expect(() => calculateIsaFromAltitude(87000)).toThrow('Calculations are valid up to 86,000 meters')
  })
})
