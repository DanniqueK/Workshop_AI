import type { Point } from '../game/grid.ts';

export interface PointerInput {
  /** Last pointer position in canvas pixels, or null before the pointer has moved. */
  position: () => Point | null;
}

/** The canvas can be scaled by CSS, so map client coordinates back to canvas pixels. */
const toCanvasPoint = (canvas: HTMLCanvasElement, event: PointerEvent): Point => {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
  };
};

export const trackPointer = (canvas: HTMLCanvasElement, onPress: () => void): PointerInput => {
  let latest: Point | null = null;
  canvas.addEventListener('pointermove', (event) => {
    latest = toCanvasPoint(canvas, event);
  });
  canvas.addEventListener('pointerdown', (event) => {
    latest = toCanvasPoint(canvas, event);
    onPress();
  });
  return { position: () => latest };
};
