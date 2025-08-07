// Shared utility functions for consistent scoring across all tables

/**
 * Get performance level based on score thresholds
 * @param {number} score - Score value (0-100)
 * @returns {string} CSS class name for styling
 */
export const getPerformanceLevel = (score) => {
  if (score >= 90) return "excellent"; // Green
  if (score >= 75) return "good"; // Light green
  if (score >= 60) return "average"; // Orange/Yellow
  return "poor"; // Red
};

/**
 * Get comparison level relative to average (for dynamic comparisons)
 * @param {number} deviceValue - Device's value
 * @param {number} averageValue - Average value for comparison
 * @param {boolean} isInverted - Whether lower values are better (e.g., latency)
 * @returns {string} CSS class name for styling
 */
export const getComparisonLevel = (
  deviceValue,
  averageValue,
  isInverted = false
) => {
  const threshold = averageValue * 0.05; // 5% threshold for "equal"

  if (isInverted) {
    // For metrics like latency where lower is better
    if (deviceValue <= averageValue - threshold) return "excellent";
    if (deviceValue >= averageValue + threshold) return "poor";
    return "good";
  } else {
    // For metrics where higher is better
    if (deviceValue >= averageValue + threshold) return "excellent";
    if (deviceValue <= averageValue - threshold) return "poor";
    return "good";
  }
};

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Score thresholds for consistent coloring
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  POOR: 0,
};
