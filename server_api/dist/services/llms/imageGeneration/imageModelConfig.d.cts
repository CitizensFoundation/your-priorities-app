export const defaultOpenAiImageModel: "gpt-image-2";
export const defaultImagenImageModel: "imagen-4.0-generate-001";
export const defaultGptImage2LandscapeSize: "2048x1152";
export const defaultAoiIconProfileName: "aoiIcon";
export const defaultRegularAiImageProfileName: "regularAiImage";
export const imageProviders: string[];
export namespace imageGenerationProfiles {
    namespace aoiIcon {
        let imageProvider: string;
        let imageModel: string;
        let imageSize: string;
        let imageQuality: string;
        let imageType: string;
        let generationContexts: string[];
    }
    namespace regularAiImage {
        let imageProvider_1: string;
        export { imageProvider_1 as imageProvider };
        let imageModel_1: string;
        export { imageModel_1 as imageModel };
        export { defaultGptImage2LandscapeSize as imageSize };
        let imageQuality_1: string;
        export { imageQuality_1 as imageQuality };
        let imageType_1: string;
        export { imageType_1 as imageType };
        let generationContexts_1: string[];
        export { generationContexts_1 as generationContexts };
    }
}
export const openAiGptImageModels: string[];
export const openAiDalleImageModels: string[];
export const imagenImageModels: string[];
export const imagenAspectRatios: string[];
export const imagenResolutionAspectRatios: {
    "1024x1024": string;
    "2048x2048": string;
    "896x1280": string;
    "1792x2560": string;
    "1280x896": string;
    "2560x1792": string;
    "768x1408": string;
    "1536x2816": string;
    "1408x768": string;
    "2816x1536": string;
};
export const openAiGptImageQualities: string[];
export const openAiDalleImageQualities: string[];
export const openAiLegacyGptImageSizes: string[];
export const openAiDalleImageSizes: string[];
export function getAspectRatioForImageSize(imageSize: any): any;
export function getAllowedImageModels(imageProvider: any): any[];
export function getDefaultImageGenerationProfileName(generationContext: any): "aoiIcon" | "regularAiImage" | undefined;
export function getDefaultImageModelForProvider(imageProvider: any): string | undefined;
export function getDefaultImageSizeForOptions(imageProvider: any, imageModel: any, imageType: any): "2048x1152" | "1024x1024" | "1536x1024" | "1792x1024" | undefined;
export function getDefaultImageQualityForOptions(imageProvider: any, imageModel: any): "medium" | "standard" | undefined;
export function normalizeImageGenerationOptions(imageProvider: any, imageModel: any, imageSize: any, imageQuality: any): {
    error: string;
} | {
    imageQuality?: any;
    imageSize?: any;
    imageProvider: any;
    imageModel: any;
    error?: undefined;
};
export function normalizeImageGenerationProfileOptions(imageGenerationProfile: any, generationContext: any, imageType: any): {
    error: string;
} | {
    imageGenerationProfile: any;
    error: string;
} | {
    imageGenerationProfile: any;
    imageQuality?: any;
    imageSize?: any;
    imageProvider: any;
    imageModel: any;
    error?: undefined;
};
export declare function isOpenAiGptImageModel(imageModel: any): boolean;
export declare function isOpenAiDalleImageModel(imageModel: any): boolean;
