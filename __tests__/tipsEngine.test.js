import { getPersonalizedTips } from '../src/lib/tipsEngine.js';

const DEFAULT_VALUES = {
  transport: 120,
  diet: 80,
  energy: 90,
  shopping: 50,
};

describe('getPersonalizedTips()', () => {
  it('returns an array', () => {
    const tips = getPersonalizedTips(DEFAULT_VALUES);
    expect(Array.isArray(tips)).toBe(true);
  });

  it('always includes the thermostat tip (universal condition)', () => {
    const tipsHigh = getPersonalizedTips({ transport: 0, diet: 0, energy: 0, shopping: 0 });
    const hasThermostat = tipsHigh.some(t => t.key === 'thermostat');
    expect(hasThermostat).toBe(true);
  });

  it('always includes the tree_offset tip (universal condition)', () => {
    const tips = getPersonalizedTips({ transport: 0, diet: 0, energy: 0, shopping: 0 });
    const hasTree = tips.some(t => t.key === 'tree_offset');
    expect(hasTree).toBe(true);
  });

  it('includes public_transit tip for high transport (>150)', () => {
    const highTransport = { ...DEFAULT_VALUES, transport: 200 };
    const tips = getPersonalizedTips(highTransport);
    expect(tips.some(t => t.key === 'public_transit')).toBe(true);
  });

  it('does NOT include public_transit for low transport (<=150)', () => {
    const lowTransport = { ...DEFAULT_VALUES, transport: 100 };
    const tips = getPersonalizedTips(lowTransport);
    expect(tips.some(t => t.key === 'public_transit')).toBe(false);
  });

  it('includes plant_based_days for high diet (>60)', () => {
    const highDiet = { ...DEFAULT_VALUES, diet: 80 };
    const tips = getPersonalizedTips(highDiet);
    expect(tips.some(t => t.key === 'plant_based_days')).toBe(true);
  });

  it('does NOT include plant_based_days for low diet (<=60)', () => {
    const lowDiet = { ...DEFAULT_VALUES, diet: 30 };
    const tips = getPersonalizedTips(lowDiet);
    expect(tips.some(t => t.key === 'plant_based_days')).toBe(false);
  });

  it('includes led_switch for high energy (>70)', () => {
    const highEnergy = { ...DEFAULT_VALUES, energy: 100 };
    const tips = getPersonalizedTips(highEnergy);
    expect(tips.some(t => t.key === 'led_switch')).toBe(true);
  });

  it('does NOT include led_switch for low energy (<=70)', () => {
    const lowEnergy = { ...DEFAULT_VALUES, energy: 50 };
    const tips = getPersonalizedTips(lowEnergy);
    expect(tips.some(t => t.key === 'led_switch')).toBe(false);
  });

  it('includes secondhand for high shopping (>40)', () => {
    const highShopping = { ...DEFAULT_VALUES, shopping: 80 };
    const tips = getPersonalizedTips(highShopping);
    expect(tips.some(t => t.key === 'secondhand')).toBe(true);
  });

  it('does NOT include secondhand for low shopping (<=40)', () => {
    const lowShopping = { ...DEFAULT_VALUES, shopping: 20 };
    const tips = getPersonalizedTips(lowShopping);
    expect(tips.some(t => t.key === 'secondhand')).toBe(false);
  });

  it('each tip has required properties', () => {
    const tips = getPersonalizedTips(DEFAULT_VALUES);
    tips.forEach(tip => {
      expect(tip).toHaveProperty('key');
      expect(tip).toHaveProperty('title');
      expect(tip).toHaveProperty('desc');
      expect(tip).toHaveProperty('impact');
      expect(tip).toHaveProperty('icon');
      expect(tip).toHaveProperty('color');
    });
  });

  it('resolves function-type descs to strings', () => {
    const tips = getPersonalizedTips(DEFAULT_VALUES);
    tips.forEach(tip => {
      expect(typeof tip.desc).toBe('string');
    });
  });

  it('returns at minimum 2 tips (thermostat + tree_offset always apply)', () => {
    const minValues = { transport: 0, diet: 0, energy: 0, shopping: 0 };
    const tips = getPersonalizedTips(minValues);
    expect(tips.length).toBeGreaterThanOrEqual(2);
  });
});
