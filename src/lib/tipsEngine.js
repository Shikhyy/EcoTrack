import { treesNeeded, totalScore } from "./emissions";

/**
 * Rules for generating personalized sustainability tips.
 * Each rule has a condition function that receives the current slider values.
 */
const TIP_RULES = [
  {
    key: "public_transit",
    icon: "🚇", color: "var(--color-mint)",
    title: "Take public transit",
    desc: "Switching to bus/metro 3×/week saves ~60 kg CO₂/month",
    impact: "High",
    /** @param {Record<string,number>} v */
    condition: (v) => v.transport > 150,
  },
  {
    key: "plant_based_days",
    icon: "🥗", color: "var(--color-leaf)",
    title: "Try plant-based days",
    desc: "2 meat-free days/week cuts diet emissions by ~25%",
    impact: "High",
    /** @param {Record<string,number>} v */
    condition: (v) => v.diet > 60,
  },
  {
    key: "led_switch",
    icon: "💡", color: "var(--color-gold)",
    title: "Switch to LEDs",
    desc: "Full home LED upgrade saves ~15 kg CO₂ monthly",
    impact: "Medium",
    /** @param {Record<string,number>} v */
    condition: (v) => v.energy > 70,
  },
  {
    key: "thermostat",
    icon: "🌡️", color: "var(--color-sky)",
    title: "Lower your thermostat",
    desc: "Reducing by 2°C saves ~5% of heating energy year-round",
    impact: "Medium",
    condition: () => true, // universally applicable baseline tip
  },
  {
    key: "secondhand",
    icon: "🛍", color: "#bb86fc",
    title: "Buy secondhand",
    desc: "Each secondhand purchase avoids ~5 kg CO₂ on average",
    impact: "Low",
    /** @param {Record<string,number>} v */
    condition: (v) => v.shopping > 40,
  },
  {
    key: "tree_offset",
    icon: "🌱", color: "var(--color-mint)",
    title: "Offset with trees",
    /** @param {Record<string,number>} v - Computes total from all values */
    desc: (v) => `Plant ~${treesNeeded(totalScore(v))} trees/year to go carbon neutral`,
    impact: "Action",
    condition: () => true,
  },
];

/**
 * Returns a filtered and resolved list of personalized tips based on current slider values.
 * @param {Record<string, number>} values - Current slider values from TrackTab
 * @returns {Array<{key: string, icon: string, title: string, desc: string, impact: string, color: string}>}
 */
export function getPersonalizedTips(values) {
  return TIP_RULES
    .filter(rule => rule.condition(values))
    .map(rule => ({
      ...rule,
      desc: typeof rule.desc === "function" ? rule.desc(values) : rule.desc,
    }));
}
