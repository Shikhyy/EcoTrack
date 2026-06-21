import {
  totalScore,
  getTier,
  tierColor,
  barColor,
  treesNeeded,
  flightEquivalent,
  vsGlobalAverage,
  CATEGORY_MAX,
} from '../src/lib/emissions.js';

// --- totalScore ---
describe('totalScore()', () => {
  it('sums all values correctly', () => {
    expect(totalScore({ transport: 100, energy: 50, diet: 75, shopping: 25 })).toBe(250);
  });
  it('returns 0 for all zeros', () => {
    expect(totalScore({ transport: 0, energy: 0, diet: 0, shopping: 0 })).toBe(0);
  });
  it('handles single-key object', () => {
    expect(totalScore({ transport: 42 })).toBe(42);
  });
});

// --- getTier ---
describe('getTier()', () => {
  it('returns low for scores below 200', () => {
    expect(getTier(0)).toBe('low');
    expect(getTier(150)).toBe('low');
    expect(getTier(199)).toBe('low');
  });
  it('returns mid for scores 200 to 499', () => {
    expect(getTier(200)).toBe('mid');
    expect(getTier(300)).toBe('mid');
    expect(getTier(499)).toBe('mid');
  });
  it('returns high for scores 500 and above', () => {
    expect(getTier(500)).toBe('high');
    expect(getTier(600)).toBe('high');
    expect(getTier(9999)).toBe('high');
  });
});

// --- tierColor ---
describe('tierColor()', () => {
  it('returns mint for low tier', () => {
    expect(tierColor('low')).toBe('var(--color-mint)');
  });
  it('returns gold for mid tier', () => {
    expect(tierColor('mid')).toBe('var(--color-gold)');
  });
  it('returns danger for high tier', () => {
    expect(tierColor('high')).toBe('var(--color-danger)');
  });
  it('returns undefined for unknown tier', () => {
    expect(tierColor('unknown')).toBeUndefined();
  });
});

// --- barColor ---
describe('barColor()', () => {
  it('returns mint for low percentages (<40)', () => {
    expect(barColor(0)).toBe('var(--color-mint)');
    expect(barColor(39)).toBe('var(--color-mint)');
  });
  it('returns gold for medium percentages (40-69)', () => {
    expect(barColor(40)).toBe('var(--color-gold)');
    expect(barColor(69)).toBe('var(--color-gold)');
  });
  it('returns danger for high percentages (>=70)', () => {
    expect(barColor(70)).toBe('var(--color-danger)');
    expect(barColor(100)).toBe('var(--color-danger)');
  });
});

// --- treesNeeded ---
describe('treesNeeded()', () => {
  it('returns 1 tree for exactly 22kg', () => {
    expect(treesNeeded(22)).toBe(1);
  });
  it('rounds up correctly', () => {
    expect(treesNeeded(23)).toBe(2);
    expect(treesNeeded(45)).toBe(3);
  });
  it('returns 0 for 0kg', () => {
    expect(treesNeeded(0)).toBe(0);
  });
  it('handles large values', () => {
    expect(treesNeeded(440)).toBe(20);
  });
});

// --- flightEquivalent ---
describe('flightEquivalent()', () => {
  it('returns correct string for 90kg (one flight)', () => {
    expect(flightEquivalent(90)).toBe('1.0');
  });
  it('returns 0.0 for 0kg', () => {
    expect(flightEquivalent(0)).toBe('0.0');
  });
  it('returns correctly formatted decimal', () => {
    expect(flightEquivalent(45)).toBe('0.5');
  });
  it('returns a string, not a number', () => {
    expect(typeof flightEquivalent(180)).toBe('string');
  });
});

// --- vsGlobalAverage ---
describe('vsGlobalAverage()', () => {
  it('returns Below for scores under default 450', () => {
    expect(vsGlobalAverage(400)).toBe('Below');
    expect(vsGlobalAverage(0)).toBe('Below');
  });
  it('returns Above for scores at or above default 450', () => {
    expect(vsGlobalAverage(450)).toBe('Above');
    expect(vsGlobalAverage(900)).toBe('Above');
  });
  it('respects custom globalAvg parameter', () => {
    expect(vsGlobalAverage(300, 500)).toBe('Below');
    expect(vsGlobalAverage(600, 500)).toBe('Above');
  });
});

// --- CATEGORY_MAX ---
describe('CATEGORY_MAX', () => {
  it('has all expected keys', () => {
    expect(CATEGORY_MAX).toHaveProperty('transport');
    expect(CATEGORY_MAX).toHaveProperty('energy');
    expect(CATEGORY_MAX).toHaveProperty('diet');
    expect(CATEGORY_MAX).toHaveProperty('shopping');
  });
  it('has numeric values for all keys', () => {
    Object.values(CATEGORY_MAX).forEach(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThan(0);
    });
  });
});
