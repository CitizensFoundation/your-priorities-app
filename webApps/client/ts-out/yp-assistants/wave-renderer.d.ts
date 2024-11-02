export declare class WavRenderer {
    /**
     * Draws frequency bars on a canvas
     * @param canvas - The canvas element to draw on
     * @param ctx - The canvas context
     * @param frequencies - Frequency data to visualize
     * @param color - Color of the bars
     * @param barWidth - Width of each frequency bar
     * @param minHeight - Minimum height of bars
     * @param scale - Scale factor for bar heights
     */
    static drawBars(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, frequencies: Float32Array, color?: string, barWidth?: number, minHeight?: number, scale?: number): void;
    /**
     * Creates a smooth gradient effect for the waveform
     * @param ctx - The canvas context
     * @param width - Width of the gradient
     * @param height - Height of the gradient
     * @param color - Base color for the gradient
     */
    static createGradient(ctx: CanvasRenderingContext2D, width: number, height: number, color?: string): CanvasGradient;
    /**
     * Adjusts the brightness of a color
     * @param color - The base color in hex format
     * @param percent - Percentage to adjust brightness
     */
    private static adjustColor;
}
//# sourceMappingURL=wave-renderer.d.ts.map