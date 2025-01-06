# WavRenderer

The `WavRenderer` class provides static methods to render audio visualizations on a canvas, such as frequency bars and gradients.

## Methods

| Name            | Parameters                                                                                                                                  | Return Type    | Description                                                                 |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------------------------------------------------------------------------|
| drawBars        | canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, frequencies: Float32Array, color: string = '#0099ff', barWidth: number = 10, minHeight: number = 0, scale: number = 8 | void           | Draws frequency bars on a canvas.                                           |
| createGradient  | ctx: CanvasRenderingContext2D, width: number, height: number, color: string = '#0099ff'                                                     | CanvasGradient | Creates a smooth gradient effect for the waveform.                          |
| adjustColor     | color: string, percent: number                                                                                                              | string         | Adjusts the brightness of a color.                                          |

## Examples

```typescript
// Example usage of the WavRenderer class

// Assuming you have a canvas element and its context
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Frequency data to visualize
const frequencies = new Float32Array([0.1, 0.5, 0.3, 0.7, 0.2]);

// Draw frequency bars
WavRenderer.drawBars(canvas, ctx, frequencies);

// Create a gradient
const gradient = WavRenderer.createGradient(ctx, canvas.width, canvas.height);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```
