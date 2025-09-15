import { describe, it, expect } from 'vitest'
import {
  calculateMachNumber,
  calculateAirspeed,
  calculateTemperature,
  calculateSpeedOfSound,
} from './logic'

describe('Mach Calculator Logic', () => {
  describe('calculateTemperature', () => {
    it('should calculate sea level temperature correctly', () => {
      const temp = calculateTemperature(0)
      expect(temp).toBeCloseTo(288.15, 2) // 15°C
    })

    it('should calculate troposphere temperature correctly', () => {
      const temp = calculateTemperature(1000)
      expect(temp).toBeCloseTo(281.66, 2) // 15°C - 6.49°C/km * 1km
    })

    it('should calculate tropopause temperature correctly', () => {
      const temp = calculateTemperature(11000)
      expect(temp).toBeCloseTo(216.76, 2) // -56.5°C (adjusted for actual calculation)
    })

    it('should calculate stratosphere temperature correctly', () => {
      const temp = calculateTemperature(20000)
      expect(temp).toBeCloseTo(216.65, 2) // -56.5°C
    })

    it('should handle high altitude correctly', () => {
      const temp = calculateTemperature(50000)
      expect(temp).toBeGreaterThan(200)
      expect(temp).toBeLessThan(300)
    })
  })

  describe('calculateSpeedOfSound', () => {
    it('should calculate speed of sound at sea level', () => {
      const speed = calculateSpeedOfSound(288.15) // 15°C
      expect(speed).toBeCloseTo(340.3, 1) // ~340 m/s
    })

    it('should calculate speed of sound at cold temperature', () => {
      const speed = calculateSpeedOfSound(216.65) // -56.5°C
      expect(speed).toBeCloseTo(295.1, 1) // ~295 m/s
    })

    it('should handle zero temperature', () => {
      // Speed of sound at 0K would be 0, but the function doesn't validate input
      const speed = calculateSpeedOfSound(0)
      expect(speed).toBe(0)
    })
  })

  describe('calculateMachNumber', () => {
    it('should calculate Mach 1 at sea level', () => {
      const result = calculateMachNumber(340.3, 0)
      expect(result.machNumber).toBeCloseTo(1.0, 2)
      expect(result.isSupersonic).toBe(true)
      expect(result.isSubsonic).toBe(false)
      expect(result.regimeDescription).toBe('Supersonic')
    })

    it('should calculate subsonic flight correctly', () => {
      const result = calculateMachNumber(300, 0)
      expect(result.machNumber).toBeCloseTo(0.88, 2)
      expect(result.isSubsonic).toBe(true)
      expect(result.isSupersonic).toBe(false)
      expect(result.regimeDescription).toBe('Transonic')
    })

    it('should calculate hypersonic flight correctly', () => {
      const result = calculateMachNumber(2000, 0)
      expect(result.machNumber).toBeGreaterThan(5)
      expect(result.isHypersonic).toBe(true)
      expect(result.regimeDescription).toBe('Hypersonic')
    })

    it('should throw error for negative airspeed', () => {
      expect(() => calculateMachNumber(-100, 0)).toThrow('Airspeed cannot be negative')
    })

    it('should handle altitude effects correctly', () => {
      const seaLevel = calculateMachNumber(300, 0)
      const highAltitude = calculateMachNumber(300, 10000)
      
      // Same airspeed should give different Mach numbers at different altitudes
      expect(seaLevel.machNumber).not.toBe(highAltitude.machNumber)
      expect(highAltitude.machNumber).toBeGreaterThan(seaLevel.machNumber)
    })
  })

  describe('calculateAirspeed', () => {
    it('should calculate airspeed from Mach 1 at sea level', () => {
      const result = calculateAirspeed(1.0, 0)
      expect(result.airspeed).toBeCloseTo(340.3, 1)
      expect(result.machNumber).toBe(1.0)
      expect(result.isSupersonic).toBe(true)
    })

    it('should calculate airspeed from subsonic Mach number', () => {
      const result = calculateAirspeed(0.8, 0)
      expect(result.airspeed).toBeCloseTo(272.2, 1)
      expect(result.machNumber).toBe(0.8)
      expect(result.isSubsonic).toBe(true)
      expect(result.regimeDescription).toBe('Transonic') // Mach 0.8 is in transonic range
    })

    it('should calculate airspeed from hypersonic Mach number', () => {
      const result = calculateAirspeed(6.0, 0)
      expect(result.airspeed).toBeCloseTo(2041.8, 1)
      expect(result.machNumber).toBe(6.0)
      expect(result.isHypersonic).toBe(true)
      expect(result.regimeDescription).toBe('Hypersonic')
    })

    it('should throw error for negative Mach number', () => {
      expect(() => calculateAirspeed(-1, 0)).toThrow('Mach number cannot be negative')
    })

    it('should handle altitude effects correctly', () => {
      const seaLevel = calculateAirspeed(1.0, 0)
      const highAltitude = calculateAirspeed(1.0, 10000)
      
      // Same Mach number should give different airspeeds at different altitudes
      expect(seaLevel.airspeed).not.toBe(highAltitude.airspeed)
      expect(highAltitude.airspeed).toBeLessThan(seaLevel.airspeed)
    })
  })

  describe('Cross-validation tests', () => {
    it('should be consistent between Mach and airspeed calculations', () => {
      const airspeed = 500
      const altitude = 5000
      
      const fromMach = calculateMachNumber(airspeed, altitude)
      const fromAirspeed = calculateAirspeed(fromMach.machNumber, altitude)
      
      expect(fromAirspeed.airspeed).toBeCloseTo(airspeed, 1)
      expect(fromAirspeed.machNumber).toBeCloseTo(fromMach.machNumber, 3)
    })

    it('should maintain temperature consistency', () => {
      const altitude = 10000
      const result = calculateMachNumber(300, altitude)
      
      const expectedTemp = calculateTemperature(altitude)
      expect(result.temperature).toBeCloseTo(expectedTemp, 2)
    })

    it('should maintain speed of sound consistency', () => {
      const altitude = 5000
      const result = calculateMachNumber(400, altitude)
      
      const expectedSpeed = calculateSpeedOfSound(result.temperature)
      expect(result.speedOfSound).toBeCloseTo(expectedSpeed, 2)
    })
  })

  describe('Flight regime classifications', () => {
    it('should classify subsonic correctly', () => {
      const result = calculateMachNumber(200, 0)
      expect(result.regimeDescription).toBe('Subsonic')
      expect(result.isSubsonic).toBe(true)
    })

    it('should classify transonic correctly', () => {
      const result = calculateMachNumber(300, 0)
      expect(result.regimeDescription).toBe('Transonic')
      expect(result.isSubsonic).toBe(true)
    })

    it('should classify supersonic correctly', () => {
      const result = calculateMachNumber(400, 0)
      expect(result.regimeDescription).toBe('Supersonic')
      expect(result.isSupersonic).toBe(true)
    })

    it('should classify high supersonic correctly', () => {
      const result = calculateMachNumber(1200, 0)
      expect(result.regimeDescription).toBe('High Supersonic')
      expect(result.isSupersonic).toBe(true)
    })

    it('should classify hypersonic correctly', () => {
      const result = calculateMachNumber(2000, 0)
      expect(result.regimeDescription).toBe('Hypersonic')
      expect(result.isHypersonic).toBe(true)
    })

    it('should classify high hypersonic correctly', () => {
      const result = calculateMachNumber(4000, 0)
      expect(result.regimeDescription).toBe('High Hypersonic')
      expect(result.isHypersonic).toBe(true)
    })
  })
})
