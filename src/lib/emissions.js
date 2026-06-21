/**
 * Maximum emission values (kg CO₂/month) for each category.
 * Used to calculate percentage-of-max for UI color coding.
 */
export const CATEGORY_MAX = {
  transport: 300,
  energy: 250,
  diet: 200,
  shopping: 150,
};

/**
 * Sums all emission values across categories.
 * @param {Record<string, number>} values - Category emission values (kg CO₂)
 * @returns {number} Total monthly emissions in kg CO₂
 */
export function totalScore(values) {
  return Object.values(values).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

/**
 * Classifies a total emission score into a sustainability tier.
 * @param {number} score - Total monthly emissions in kg CO₂
 * @returns {'low' | 'mid' | 'high'} Tier label
 */
export function getTier(score) {
  if (score < 200) return "low";
  if (score < 500) return "mid";
  return "high";
}

/**
 * Returns the CSS color variable for a given tier.
 * @param {'low' | 'mid' | 'high'} tier
 * @returns {string} CSS custom property string
 */
export function tierColor(tier) {
  return { 
    low: "var(--color-mint)", 
    mid: "var(--color-gold)", 
    high: "var(--color-danger)" 
  }[tier];
}

/**
 * Returns a color based on a category's percentage of its maximum.
 * @param {number} percentOfCategoryMax - Value from 0 to 100
 * @returns {string} CSS custom property string
 */
export function barColor(percentOfCategoryMax) {
  if (percentOfCategoryMax < 40) return "var(--color-mint)";
  if (percentOfCategoryMax < 70) return "var(--color-gold)";
  return "var(--color-danger)";
}

/**
 * Calculates how many trees need to be planted per year to offset a given score.
 * Based on: 1 tree absorbs ~22kg CO₂/year.
 * @param {number} score - Monthly emissions in kg CO₂
 * @returns {number} Number of trees needed per year
 */
export function treesNeeded(score) {
  if (!score || score <= 0) return 0;
  return Math.ceil(score / 22);
}

/**
 * Expresses a monthly emission score as equivalent short-haul flights.
 * Based on: 1 short-haul flight ≈ 90kg CO₂.
 * @param {number} score - Monthly emissions in kg CO₂
 * @returns {string} Formatted decimal string (e.g. "1.5")
 */
export function flightEquivalent(score) {
  return (score / 90).toFixed(1);
}

/**
 * Compares a score to the global average monthly footprint.
 * @param {number} score - Monthly emissions in kg CO₂
 * @param {number} [globalAvg=450] - Baseline global average to compare against
 * @returns {'Below' | 'Above'} Comparison result
 */
export function vsGlobalAverage(score, globalAvg = 450) {
  return score < globalAvg ? "Below" : "Above";
}
