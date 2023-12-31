import { YpBaseElement } from './yp-base-element.js';
export declare class YpMediaHelpers {
    static _checkVideoLongPlayTimeAndReset(playbackElement: YpElementWithPlayback, videoPlayer: HTMLElement): void;
    static _checkAudioLongPlayTimeAndReset(playbackElement: YpElementWithPlayback, audioPlayer: HTMLElement): void;
    static getImageFormatUrl(images: Array<YpImageData> | undefined, formatId?: number): any;
    static setupTopHeaderImage(element: YpBaseElement, images: Array<YpImageData> | null): void;
    static attachMediaListeners(targetElement: YpElementWithPlayback): void;
    static detachMediaListeners(targetElement: YpElementWithPlayback): void;
    static pauseMediaPlayback(targetElement: YpElementWithPlayback): void;
    static getVideoURL(videos: Array<YpVideoData> | undefined): string | null;
    static isPortraitVideo(videos: Array<YpVideoData> | undefined): boolean;
    static getAudioURL(audios: Array<YpAudioData> | undefined): string | null;
    static getVideoPosterURL(videos: Array<YpVideoData> | undefined, images: Array<YpImageData> | undefined, selectedImageIndex?: number): any;
}
//# sourceMappingURL=YpMediaHelpers.d.ts.map