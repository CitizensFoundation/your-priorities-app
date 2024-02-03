import { YpGenerateAiImage } from "../../common/yp-generate-ai-image.js";
export declare class AoiGenerateAiLogos extends YpGenerateAiImage {
    imageType: YpAiGenerateImageTypes;
    hexColor: string;
    promptFromUser: string | undefined;
    constructor(hexColor: string);
    hexToRgb(hex: string): {
        r: number;
        g: number;
        b: number;
    };
    rgbToHsl(r: number, g: number, b: number): {
        h: number;
        s: number;
        l: number;
    };
    hslToHex(h: number, s: number, l: number): string;
    getComplementaryColor(hex: string): string;
    hexToColorDescription(hex: string): string;
    get promptDraft(): string;
    generateImage(): Promise<object>;
    get finalPrompt(): string;
    generateIcon(answer: string, promptFromUser: string): Promise<object>;
}
//# sourceMappingURL=aoiGenerateAiLogos.d.ts.map