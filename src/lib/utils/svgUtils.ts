/**
 * Utility functions for working with SVG icons in React
 */

/**
 * Checks if a string is a valid SVG
 */
export const isValidSvg = (svgString?: string): boolean => {
  if (!svgString) return false;
  const trimmed = svgString.trim();
  return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>');
};

/**
 * Normalizes SVG content for use in React
 * - Replaces class with className
 * - Ensures proper width/height if not present
 * - Makes sure SVG has proper namespace
 */
export const normalizeSvgForReact = (svgString?: string): string => {
  if (!isValidSvg(svgString)) return '';
  
  let normalized = svgString!;
  
  // Replace class with className for React compatibility
  normalized = normalized.replace(/class=/g, 'className=');
  
  // Ensure SVG has proper namespace if missing
  if (!normalized.includes('xmlns=')) {
    normalized = normalized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  
  // Strip width and height attributes to allow CSS to control size
  normalized = normalized.replace(/width="[^"]*"/g, '');
  normalized = normalized.replace(/height="[^"]*"/g, '');
  
  // Add viewBox if missing
  if (!normalized.includes('viewBox=')) {
    normalized = normalized.replace('<svg', '<svg viewBox="0 0 24 24"');
  }
  
  // Ensure the SVG fills its container with CSS
  normalized = normalized.replace('<svg', '<svg style="width: 100%; height: 100%;"');
  
  return normalized;
}; 