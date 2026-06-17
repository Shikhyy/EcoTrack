import { getTier, treesNeeded, vsGlobalAverage } from '../src/lib/emissions.js';

test('getTier categorizes footprint correctly', () => {
  expect(getTier(150)).toBe('low');
  expect(getTier(300)).toBe('mid');
  expect(getTier(600)).toBe('high');
});

test('treesNeeded calculates correct number of trees', () => {
  expect(treesNeeded(22)).toBe(1);
  expect(treesNeeded(45)).toBe(3); // Math.ceil(45/22) = 3
  expect(treesNeeded(0)).toBe(0);
});

test('vsGlobalAverage compares correctly', () => {
  expect(vsGlobalAverage(400)).toBe('Below');
  expect(vsGlobalAverage(500)).toBe('Above');
  expect(vsGlobalAverage(450)).toBe('Above'); // 450 < 450 is false, so Above
});
