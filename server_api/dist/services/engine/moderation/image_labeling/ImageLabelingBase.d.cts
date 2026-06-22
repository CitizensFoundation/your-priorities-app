export = ImageLabelingBase;
declare class ImageLabelingBase {
    constructor(workPackage: any);
    workPackage: any;
    collection: any;
    reportContent: boolean;
    reportContentWithNotification: boolean;
    visionClient: vision.v1.ImageAnnotatorClient;
    visionRequesBase: {
        features: {
            type: string;
        }[];
        image: {
            source: {
                imageUri: undefined;
            };
        };
    };
    reviewAndLabelUrl(imageUrl: any, mediaType: any, mediaId: any): Promise<{
        imageLabels: {
            mediaType: any;
            mediaId: any;
            length?: number | undefined;
            toString?: (() => string) | undefined;
            toLocaleString?: {
                (): string;
                (locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
            } | undefined;
            pop?: (() => vision.protos.google.cloud.vision.v1.IEntityAnnotation | undefined) | undefined;
            push?: ((...items: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => number) | undefined;
            concat?: {
                (...items: ConcatArray<vision.protos.google.cloud.vision.v1.IEntityAnnotation>[]): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
                (...items: (vision.protos.google.cloud.vision.v1.IEntityAnnotation | ConcatArray<vision.protos.google.cloud.vision.v1.IEntityAnnotation>)[]): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
            } | undefined;
            join?: ((separator?: string) => string) | undefined;
            reverse?: (() => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            shift?: (() => vision.protos.google.cloud.vision.v1.IEntityAnnotation | undefined) | undefined;
            slice?: ((start?: number, end?: number) => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            sort?: ((compareFn?: ((a: vision.protos.google.cloud.vision.v1.IEntityAnnotation, b: vision.protos.google.cloud.vision.v1.IEntityAnnotation) => number) | undefined) => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            splice?: {
                (start: number, deleteCount?: number): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
                (start: number, deleteCount: number, ...items: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
            } | undefined;
            unshift?: ((...items: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => number) | undefined;
            indexOf?: ((searchElement: vision.protos.google.cloud.vision.v1.IEntityAnnotation, fromIndex?: number) => number) | undefined;
            lastIndexOf?: ((searchElement: vision.protos.google.cloud.vision.v1.IEntityAnnotation, fromIndex?: number) => number) | undefined;
            every?: {
                <S extends vision.protos.google.cloud.vision.v1.IEntityAnnotation>(predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => value is S, thisArg?: any): this is S[];
                (predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any): boolean;
            } | undefined;
            some?: ((predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any) => boolean) | undefined;
            forEach?: ((callbackfn: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => void, thisArg?: any) => void) | undefined;
            map?: (<U>(callbackfn: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => U, thisArg?: any) => U[]) | undefined;
            filter?: {
                <S extends vision.protos.google.cloud.vision.v1.IEntityAnnotation>(predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => value is S, thisArg?: any): S[];
                (predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
            } | undefined;
            reduce?: {
                (callbackfn: (previousValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentIndex: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => vision.protos.google.cloud.vision.v1.IEntityAnnotation): vision.protos.google.cloud.vision.v1.IEntityAnnotation;
                (callbackfn: (previousValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentIndex: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => vision.protos.google.cloud.vision.v1.IEntityAnnotation, initialValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation): vision.protos.google.cloud.vision.v1.IEntityAnnotation;
                <U>(callbackfn: (previousValue: U, currentValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentIndex: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => U, initialValue: U): U;
            } | undefined;
            reduceRight?: {
                (callbackfn: (previousValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentIndex: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => vision.protos.google.cloud.vision.v1.IEntityAnnotation): vision.protos.google.cloud.vision.v1.IEntityAnnotation;
                (callbackfn: (previousValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentIndex: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => vision.protos.google.cloud.vision.v1.IEntityAnnotation, initialValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation): vision.protos.google.cloud.vision.v1.IEntityAnnotation;
                <U>(callbackfn: (previousValue: U, currentValue: vision.protos.google.cloud.vision.v1.IEntityAnnotation, currentIndex: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => U, initialValue: U): U;
            } | undefined;
            find?: {
                <S extends vision.protos.google.cloud.vision.v1.IEntityAnnotation>(predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, obj: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => value is S, thisArg?: any): S | undefined;
                (predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, obj: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any): vision.protos.google.cloud.vision.v1.IEntityAnnotation | undefined;
            } | undefined;
            findIndex?: ((predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, obj: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any) => number) | undefined;
            fill?: ((value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, start?: number, end?: number) => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            copyWithin?: ((target: number, start: number, end?: number) => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            entries?: (() => ArrayIterator<[number, vision.protos.google.cloud.vision.v1.IEntityAnnotation]>) | undefined;
            keys?: (() => ArrayIterator<number>) | undefined;
            values?: (() => ArrayIterator<vision.protos.google.cloud.vision.v1.IEntityAnnotation>) | undefined;
            includes?: ((searchElement: vision.protos.google.cloud.vision.v1.IEntityAnnotation, fromIndex?: number) => boolean) | undefined;
            flatMap?: (<U, This = undefined>(callback: (this: This, value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => U | readonly U[], thisArg?: This | undefined) => U[]) | undefined;
            flat?: (<A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[]) | undefined;
            at?: ((index: number) => vision.protos.google.cloud.vision.v1.IEntityAnnotation | undefined) | undefined;
            findLast?: {
                <S extends vision.protos.google.cloud.vision.v1.IEntityAnnotation>(predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => value is S, thisArg?: any): S | undefined;
                (predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any): vision.protos.google.cloud.vision.v1.IEntityAnnotation | undefined;
            } | undefined;
            findLastIndex?: ((predicate: (value: vision.protos.google.cloud.vision.v1.IEntityAnnotation, index: number, array: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) => unknown, thisArg?: any) => number) | undefined;
            toReversed?: (() => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            toSorted?: ((compareFn?: ((a: vision.protos.google.cloud.vision.v1.IEntityAnnotation, b: vision.protos.google.cloud.vision.v1.IEntityAnnotation) => number) | undefined) => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            toSpliced?: {
                (start: number, deleteCount: number, ...items: vision.protos.google.cloud.vision.v1.IEntityAnnotation[]): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
                (start: number, deleteCount?: number): vision.protos.google.cloud.vision.v1.IEntityAnnotation[];
            } | undefined;
            with?: ((index: number, value: vision.protos.google.cloud.vision.v1.IEntityAnnotation) => vision.protos.google.cloud.vision.v1.IEntityAnnotation[]) | undefined;
            [Symbol.iterator]?: (() => ArrayIterator<vision.protos.google.cloud.vision.v1.IEntityAnnotation>) | undefined;
            [Symbol.unscopables]?: {
                [x: number]: boolean | undefined;
                length?: boolean | undefined;
                toString?: boolean | undefined;
                toLocaleString?: boolean | undefined;
                pop?: boolean | undefined;
                push?: boolean | undefined;
                concat?: boolean | undefined;
                join?: boolean | undefined;
                reverse?: boolean | undefined;
                shift?: boolean | undefined;
                slice?: boolean | undefined;
                sort?: boolean | undefined;
                splice?: boolean | undefined;
                unshift?: boolean | undefined;
                indexOf?: boolean | undefined;
                lastIndexOf?: boolean | undefined;
                every?: boolean | undefined;
                some?: boolean | undefined;
                forEach?: boolean | undefined;
                map?: boolean | undefined;
                filter?: boolean | undefined;
                reduce?: boolean | undefined;
                reduceRight?: boolean | undefined;
                find?: boolean | undefined;
                findIndex?: boolean | undefined;
                fill?: boolean | undefined;
                copyWithin?: boolean | undefined;
                entries?: boolean | undefined;
                keys?: boolean | undefined;
                values?: boolean | undefined;
                includes?: boolean | undefined;
                flatMap?: boolean | undefined;
                flat?: boolean | undefined;
                at?: boolean | undefined;
                findLast?: boolean | undefined;
                findLastIndex?: boolean | undefined;
                toReversed?: boolean | undefined;
                toSorted?: boolean | undefined;
                toSpliced?: boolean | undefined;
                with?: boolean | undefined;
                [Symbol.iterator]?: boolean | undefined;
                readonly [Symbol.unscopables]?: boolean | undefined;
            } | undefined;
        };
        imageReviews: {
            mediaType: any;
            mediaId: any;
            adult?: (vision.protos.google.cloud.vision.v1.Likelihood | keyof typeof vision.protos.google.cloud.vision.v1.Likelihood | null);
            spoof?: (vision.protos.google.cloud.vision.v1.Likelihood | keyof typeof vision.protos.google.cloud.vision.v1.Likelihood | null);
            medical?: (vision.protos.google.cloud.vision.v1.Likelihood | keyof typeof vision.protos.google.cloud.vision.v1.Likelihood | null);
            violence?: (vision.protos.google.cloud.vision.v1.Likelihood | keyof typeof vision.protos.google.cloud.vision.v1.Likelihood | null);
            racy?: (vision.protos.google.cloud.vision.v1.Likelihood | keyof typeof vision.protos.google.cloud.vision.v1.Likelihood | null);
        };
    } | null>;
    reportImageToModerators(options: any): Promise<any>;
    hasImageIdBeenReviewed(imageId: any): boolean;
    reviewAndLabelImages(images: any): Promise<any>;
    reviewAndLabelVideos(collectionModel: any, collectionId: any, collectionAssociation: any): Promise<any>;
    evaluteImageReviews(imageReviews: any): Promise<any>;
    reportContentIfNeeded(): Promise<any>;
    getCollection(): Promise<void>;
    reviewImagesFromCollection(): Promise<void>;
    reviewAndLabelVisualMedia(): Promise<any>;
}
import vision = require("@google-cloud/vision");
