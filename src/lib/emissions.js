export const CATEGORY_MAX = {
  transport: 300,
  energy: 250,
  diet: 200,
  shopping: 150,
};

export function totalScore(values) {
  return Object.values(values).reduce((sum, v) => sum + v, 0);
}

export function getTier(score) {
  if (score < 200) return "low";
  if (score < 500) return "mid";
  return "high";
}

export function tierColor(tier) {
  return { 
    low: "var(--color-mint)", 
    mid: "var(--color-gold)", 
    high: "var(--color-danger)" 
  }[tier];
}

export function barColor(percentOfCategoryMax) {
  if (percentOfCategoryMax < 40) return "var(--color-mint)";
  if (percentOfCategoryMax < 70) return "var(--color-gold)";
  return "var(--color-danger)";
}

export function treesNeeded(score) {
  return Math.ceil(score / 22); // 1 tree ≈ 22kg CO2 absorbed/year
}

export function flightEquivalent(score) {
  return (score / 90).toFixed(1); // ~90kg CO2 per short-haul flight, simplified constant
}

export function vsGlobalAverage(score, globalAvg = 450) {
  return score < globalAvg ? "Below" : "Above";
}
