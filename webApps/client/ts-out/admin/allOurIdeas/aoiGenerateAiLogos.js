var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { YpGenerateAiImage } from "../../common/yp-generate-ai-image.js";
let AoiGenerateAiLogos = class AoiGenerateAiLogos extends YpGenerateAiImage {
    constructor(hexColor) {
        super();
        this.imageType = "icon";
        this.hexColor = hexColor;
    }
    hexToRgb(hex) {
        if (hex.startsWith("#")) {
            hex = hex.slice(1);
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b };
    }
    rgbToHsl(r, g, b) {
        (r /= 255), (g /= 255), (b /= 255);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        }
        else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        }
        else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        }
        else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        }
        else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        }
        else if (h >= 300 && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
        if (r.length === 1)
            r = "0" + r;
        if (g.length === 1)
            g = "0" + g;
        if (b.length === 1)
            b = "0" + b;
        return `#${r}${g}${b}`;
    }
    getComplementaryColor(hex) {
        const { r, g, b } = this.hexToRgb(hex);
        const { h, s, l } = this.rgbToHsl(r, g, b);
        const complementaryHue = (h + 180) % 360;
        return this.hslToHex(complementaryHue, s, l);
    }
    hexToColorDescription(hex) {
        // Remove '#' if it's present
        if (hex.startsWith("#")) {
            hex = hex.slice(1);
        }
        // Parse the hex string into RGB
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        // Determine the dominant color(s)
        const maxVal = Math.max(r, g, b);
        const isRedDominant = r === maxVal;
        const isGreenDominant = g === maxVal;
        const isBlueDominant = b === maxVal;
        // Generate a description
        let description = "";
        if (isRedDominant && isGreenDominant && isBlueDominant) {
            description = "gray";
        }
        else if (isRedDominant && isGreenDominant) {
            description = "yello";
        }
        else if (isRedDominant && isBlueDominant) {
            description = "purple";
        }
        else if (isGreenDominant && isBlueDominant) {
            description = "cyan";
        }
        else if (isRedDominant) {
            description = "red";
        }
        else if (isGreenDominant) {
            description = "green";
        }
        else if (isBlueDominant) {
            description = "blue";
        }
        // Adjust for lightness/darkness
        if (maxVal > 200) {
            description = "light " + description;
        }
        else if (maxVal < 55) {
            description = "dark " + description;
        }
        return description;
    }
    get promptDraft() {
        const highlightColorHex = this.getComplementaryColor(this.hexColor);
        return `Very simple cartoon icon.

Use a simple color scheme based on ${this.hexToColorDescription(this.hexColor)} background and ${this.hexToColorDescription(highlightColorHex)} foreground. No text.
`;
    }
    async generateImage() {
        return new Promise((resolve, reject) => {
            const onGotImage = (details) => {
                this.removeEventListener("got-image", onGotImage);
                this.removeEventListener("image-generation-error", onImageGenerationError);
                console.error("Got image", details.detail);
                resolve(details.detail);
            };
            const onImageGenerationError = (details) => {
                this.removeEventListener("got-image", onGotImage);
                this.removeEventListener("image-generation-error", onImageGenerationError);
                reject(details.detail);
            };
            this.addEventListener("got-image", onGotImage);
            this.addEventListener("image-generation-error", onImageGenerationError);
            this.submit().catch((error) => {
                this.removeEventListener("got-image", onGotImage);
                this.removeEventListener("image-generation-error", onImageGenerationError);
                reject(error);
            });
        });
    }
    get finalPrompt() {
        return this.promptFromUser;
    }
    async generateIcon(answer, promptFromUser) {
        promptFromUser = `Text to create tiny icon from: ${answer}\nIcon style: ${promptFromUser}`;
        this.promptFromUser = promptFromUser;
        return await this.generateImage();
    }
};
AoiGenerateAiLogos = __decorate([
    customElement("aoi-generate-ai-logos")
], AoiGenerateAiLogos);
export { AoiGenerateAiLogos };
//# sourceMappingURL=aoiGenerateAiLogos.js.map