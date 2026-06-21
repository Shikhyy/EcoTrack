import { CATEGORY_MAX } from '../lib/emissions';

export const SLIDERS = [
  {
    key: "transport",
    icon: "🚗",
    label: "Transport",
    max: CATEGORY_MAX.transport,
    lowLabel: "Walking/Bike",
    highLabel: "Daily Driving"
  },
  {
    key: "energy",
    icon: "⚡",
    label: "Home Energy",
    max: CATEGORY_MAX.energy,
    lowLabel: "Solar/Efficient",
    highLabel: "High Usage"
  },
  {
    key: "diet",
    icon: "🥩",
    label: "Diet",
    max: CATEGORY_MAX.diet,
    lowLabel: "Plant-based",
    highLabel: "Meat-heavy"
  },
  {
    key: "shopping",
    icon: "🛍",
    label: "Shopping",
    max: CATEGORY_MAX.shopping,
    lowLabel: "Minimalist",
    highLabel: "Frequent"
  }
];

export const DEFAULT_VALUES = {
  transport: 120,
  energy: 90,
  diet: 80,
  shopping: 50
};
