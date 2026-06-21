import { treesNeeded } from "./emissions";

const TIP_RULES = [
  {
    key: "public_transit",
    icon: "🚇", color: "var(--color-mint)",
    title: "Take public transit",
    desc: "Switching to bus/metro 3×/week saves ~60 kg CO₂/month",
    impact: "High",
    condition: (v) => v.transport > 150,
  },
  {
    key: "plant_based_days",
    icon: "🥗", color: "var(--color-leaf)",
    title: "Try plant-based days",
    desc: "2 meat-free days/week cuts diet emissions by ~25%",
    impact: "High",
    condition: (v) => v.diet > 60,
  },
  {
    key: "led_switch",
    icon: "💡", color: "var(--color-gold)",
    title: "Switch to LEDs",
    desc: "Full home LED upgrade saves ~15 kg CO₂ monthly",
    impact: "Medium",
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
    condition: (v) => v.shopping > 40,
  },
  {
    key: "tree_offset",
    icon: "🌱", color: "var(--color-mint)",
    title: "Offset with trees",
    desc: (v) => `Plant ~${treesNeeded(v.total)} trees/year to go carbon neutral`,
    impact: "Action",
    condition: () => true,
  },
];

export function getPersonalizedTips(values) {
  return TIP_RULES
    .filter(rule => rule.condition(values))
    .map(rule => ({
      ...rule,
      desc: typeof rule.desc === "function" ? rule.desc(values) : rule.desc,
    }));
}
