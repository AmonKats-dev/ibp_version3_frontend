// Chart.js setup - must be imported before react-chartjs-2
import Chart from "chart.js";

// Ensure Chart.js is available globally
if (typeof window !== "undefined") {
  window.Chart = Chart;
}

// Ensure Chart.defaults exists for react-chartjs-2
// This prevents ESLint errors about setting properties on undefined
if (Chart) {
  if (!Chart.defaults) {
    Chart.defaults = {};
  }
  if (!Chart.defaults.global) {
    Chart.defaults.global = {};
  }
  if (!Chart.defaults.global.defaultMeta) {
    Chart.defaults.global.defaultMeta = {};
  }
}

export default Chart;
