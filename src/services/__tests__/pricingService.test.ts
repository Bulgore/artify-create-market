import { describe, it, expect } from 'vitest';
import { calculateRawPrice, calculateFinalPrice } from '../pricingService';

describe('pricingService utils', () => {
  it('calculates raw price correctly', () => {
    expect(calculateRawPrice(10, 5)).toBe(15);
  });

  it('calculates final price correctly', () => {
    const price = calculateFinalPrice(10, 5, 20);
    expect(price).toBeCloseTo(18);
  });
});
