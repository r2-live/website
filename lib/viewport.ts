export function isViewportZoomed() {
  return (
    typeof window !== "undefined" &&
    window.visualViewport !== null &&
    Math.abs(window.visualViewport.scale - 1) > 0.01
  );
}
