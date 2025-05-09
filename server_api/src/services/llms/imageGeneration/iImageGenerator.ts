export type YpAiGenerateImageTypes = "logo" | "icon" | "other";

export interface IImageGenerator {
  /**
   * Generates an image URL given a prompt and a type (logo, icon, etc.)
   */
  generateImageUrl(prompt: string, type: YpAiGenerateImageTypes): Promise<string | undefined>;
}
