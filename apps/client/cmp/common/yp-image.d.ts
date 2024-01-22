/**
@license
Copyright (c) 2016 The Polymer Community Authors. All rights reserved.
Copyright (c) 2020 Citizens Foundation Iceland / Citizens Foundation USA LitElement Port. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer community is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { LitElement } from "lit";
/**
`yp-image` is an element for displaying an image that provides useful sizing and
preloading options not found on the standard `<img>` tag.

The `sizing` option allows the image to be either cropped (`cover`) or
letterboxed (`contain`) to fill a fixed user-size placed on the element.

The `preload` option prevents the browser from rendering the image until the
image is fully loaded.  In the interim, either the element's CSS `background-color`
can be be used as the placeholder, or the `placeholder` property can be
set to a URL (preferably a data-URI, for instant rendering) for an
placeholder image.

The `fade` option (only valid when `preload` is set) will cause the placeholder
image/color to be faded out once the image is rendered.

Examples:

  Basically identical to `<img src="...">` tag:

    <yp-image src="http://lorempixel.com/400/400"></yp-image>

  Will letterbox the image to fit:

    <yp-image style="width:400px; height:400px;" sizing="contain"
      src="http://lorempixel.com/600/400"></yp-image>

  Will crop the image to fit:

    <yp-image style="width:400px; height:400px;" sizing="cover"
      src="http://lorempixel.com/600/400"></yp-image>

  Will show light-gray background until the image loads:

    <yp-image style="width:400px; height:400px; background-color: lightgray;"
      sizing="cover" preload src="http://lorempixel.com/600/400"></yp-image>

  Will show a base-64 encoded placeholder image until the image loads:

    <yp-image style="width:400px; height:400px;" placeholder="data:image/gif;base64,..."
      sizing="cover" preload src="http://lorempixel.com/600/400"></yp-image>

  Will fade the light-gray background out once the image is loaded:

    <yp-image style="width:400px; height:400px; background-color: lightgray;"
      sizing="cover" preload fade src="http://lorempixel.com/600/400"></yp-image>

Custom property | Description | Default
----------------|-------------|----------
`--yp-image-placeholder` | Mixin applied to #placeholder | `{}`
`--yp-image-width` | Sets the width of the wrapped image | `auto`
`--yp-image-height` | Sets the height of the wrapped image | `auto`
*/
export declare class YpImage extends LitElement {
    /**
     * The URL of an image.
     */
    src: string | undefined;
    /**
     * A short text alternative for the image.
     */
    alt: string | undefined;
    /**
     * CORS enabled images support:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
     */
    crossorigin: string | undefined;
    /**
     * When true, the image is prevented from loading and any placeholder is
     * shown.  This may be useful when a binding to the src property is known to
     * be invalid, to prevent 404 requests.
     */
    preventLoad: boolean;
    /**
     * Sets a sizing option for the image.  Valid values are `contain` (full
     * aspect ratio of the image is contained within the element and
     * letterboxed) or `cover` (image is cropped in order to fully cover the
     * bounds of the element), or `null` (default: image takes natural size).
     */
    sizing: string | undefined;
    /**
     * When a sizing option is used (`cover` or `contain`), this determines
     * how the image is aligned within the element bounds.
     */
    position: string;
    /**
     * When `true`, any change to the `src` property will cause the
     * `placeholder` image to be shown until the new image has loaded.
     */
    preload: boolean;
    /**
     * This image will be used as a background/placeholder until the src image
     * has loaded.  Use of a data-URI for placeholder is encouraged for instant
     * rendering.
     */
    placeholder: string | undefined;
    /**
     * When `preload` is true, setting `fade` to true will cause the image to
     * fade into place.
     */
    fade: boolean;
    /**
     * Read-only value that is true when the image is loaded.
     */
    loaded: boolean;
    /**
     * Read-only value that tracks the loading state of the image when the
     * `preload` option is used.
     */
    loading: boolean;
    /**
     * Read-only value that indicates that the last set `src` failed to load.
     */
    error: boolean;
    /**
     * Can be used to set the width of image (e.g. via binding); size may also
     * be set via CSS.
     */
    width: string | undefined;
    /**
     * Can be used to set the height of image (e.g. via binding); size may also
     * be set via CSS.
     * @type number
     * @default null
     */
    height: string | undefined;
    _resolvedSrc: string | undefined;
    ABS_URL: RegExp;
    workingURL: boolean | undefined;
    resolveDoc: HTMLDocument | undefined;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
    $$(id: string): HTMLElement | null;
    connectedCallback(): void;
    getThemeColorsFromImage(img: HTMLImageElement | undefined): Promise<string | undefined>;
    _imgOnLoad(): void;
    _imgOnError(): void;
    get computePlaceholderHidden(): boolean;
    _computePlaceholderClassName(): "" | "faded-out";
    get _computeImgDivHidden(): boolean;
    get _computeImgDivARIAHidden(): boolean;
    get _computeImgDivARIALabel(): string | undefined;
    get _computeImgHidden(): boolean;
    _widthChanged(): void;
    _heightChanged(): void;
    _loadStateObserver(): void;
    _placeholderChanged(): void;
    _transformChanged(): void;
    _resolveSrc(testSrc: string): string | undefined;
    resolveUrl(url: string, baseURI: string): string | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
}
//# sourceMappingURL=yp-image.d.ts.map