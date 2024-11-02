export class WavRenderer {
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
    static drawBars(canvas, ctx, frequencies, color = '#0099ff', barWidth = 10, minHeight = 0, scale = 8) {
        if (!canvas || !ctx || !frequencies)
            return;
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;
        const bars = Math.min(Math.floor(width / barWidth), frequencies.length);
        const step = Math.floor(frequencies.length / bars);
        ctx.fillStyle = color;
        for (let i = 0; i < bars; i++) {
            // Get average of frequency range for this bar
            let sum = 0;
            for (let j = 0; j < step; j++) {
                sum += frequencies[i * step + j] || 0;
            }
            const average = sum / step;
            // Calculate bar height based on frequency average
            const barHeight = Math.max(minHeight, average * height * scale);
            // Draw mirrored bars
            const x = i * barWidth;
            // Upper bar
            ctx.fillRect(x, centerY - barHeight / 2, barWidth - 2, barHeight / 2);
            // Lower bar (mirrored)
            ctx.fillRect(x, centerY, barWidth - 2, barHeight / 2);
        }
    }
    /**
     * Creates a smooth gradient effect for the waveform
     * @param ctx - The canvas context
     * @param width - Width of the gradient
     * @param height - Height of the gradient
     * @param color - Base color for the gradient
     */
    static createGradient(ctx, width, height, color = '#0099ff') {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.adjustColor(color, 20)); // slightly lighter variant
        return gradient;
    }
    /**
     * Adjusts the brightness of a color
     * @param color - The base color in hex format
     * @param percent - Percentage to adjust brightness
     */
    static adjustColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = (num >> 16) + percent;
        const g = ((num >> 8) & 0x00FF) + percent;
        const b = (num & 0x0000FF) + percent;
        const adjustedColor = '#' + (0x1000000 +
            (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 +
            (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 +
            (b < 255 ? (b < 1 ? 0 : b) : 255)).toString(16).slice(1);
        return adjustedColor;
    }
}
//# sourceMappingURL=wave-renderer.js.map