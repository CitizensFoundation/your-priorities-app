export namespace GENERATION_CONTEXTS {
    let AOI_ICON_PUBLIC: string;
    let AOI_ICON_ADMIN: string;
    let REGULAR_AI_IMAGE: string;
}
export function validateImageGenerationStartRequest(req: any, { collectionType, collectionId }: {
    collectionType: any;
    collectionId: any;
}): Promise<{
    allowed: boolean;
    status: any;
    body: any;
} | {
    allowed: boolean;
    userId: any;
    generationContext: any;
    internalData: {
        userId: any;
        generationContext: any;
        imageType: any;
        collectionType: any;
        collectionId: number;
        createdAt: string;
        maxImagesPer24Hours: any;
        usedImagesInLast24Hours: number | undefined;
    };
}>;
export function canPollImageGenerationJob(req: any, job: any): boolean;
export function publicJobFields(job: any): {
    id: any;
    progress: any;
    error: any;
    data: any;
};
