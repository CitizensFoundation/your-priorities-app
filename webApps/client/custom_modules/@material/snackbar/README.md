<!--docs:
title: "Snackbars"
layout: detail
section: components
excerpt: "Snackbars provide brief messages about app processes at the bottom of the screen."
iconId: toast
path: /catalog/snackbars/
-->

# Snackbars

Snackbars provide brief messages about app processes at the bottom of the screen.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-snackbar">Material Design guidelines: Snackbars</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/snackbar">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/snackbar
```

## Basic Usage

### HTML Structure

```html
<aside class="mdc-snackbar">
  <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
    <div class="mdc-snackbar__label" aria-atomic="false">
      Can't send photo. Retry in 5 seconds.
    </div>
    <div class="mdc-snackbar__actions" aria-atomic="true">
      <button type="button" class="mdc-button mdc-snackbar__action">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Retry</span>
      </button>
    </div>
  </div>
</aside>
```

### Styles

```scss
@use "@material/snackbar/mdc-snackbar";
```

### JavaScript Instantiation

```js
import {MDCSnackbar} from '@material/snackbar';
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Stacked

Action buttons with long text should be positioned _below_ the label instead of alongside it. This can be accomplished by adding the `mdc-snackbar--stacked` modifier class to the root element:

```html
<aside class="mdc-snackbar mdc-snackbar--stacked">
  ...
</aside>
```

Alternatively, you can call the `layout-stacked` mixin from Sass:

```scss
@use "@material/snackbar";

@media (max-width: snackbar.$mobile-breakpoint) {
  .my-snackbar {
    @include snackbar.layout-stacked;
  }
}
```

### Leading (tablet and desktop only)

By default, snackbars are centered horizontally within the viewport.

On larger screens, they can optionally be displayed on the _leading_ edge of the screen (the left side in LTR, or the right side in RTL) by adding the `mdc-snackbar--leading` modifier class to the root element:

```html
<aside class="mdc-snackbar mdc-snackbar--leading">
  ...
</aside>
```

Alternatively, you can call the `position-leading` mixin from Sass:

```scss
@media (min-width: snackbar.$mobile-breakpoint) {
  .my-snackbar {
    @include snackbar.position-leading;
  }
}
```

### Wide (tablet and desktop only)

To increase the margins between the snackbar and the viewport on larger screens, call the `viewport-margin` mixin inside a media query:

```scss
@media (min-width: snackbar.$mobile-breakpoint) {
  .my-snackbar {
    @include snackbar.viewport-margin(snackbar.$viewport-margin-wide);
  }
}
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-snackbar` | Mandatory. Container for the snackbar elements.
`mdc-snackbar__label` | Mandatory. Message text.
`mdc-snackbar__actions` | Optional. Wraps the action button/icon elements, if present.
`mdc-snackbar__action` | Optional. The action button.
`mdc-snackbar__dismiss` | Optional. The dismiss ("X") icon.
`mdc-snackbar--opening` | Optional. Applied automatically when the snackbar is in the process of animating open.
`mdc-snackbar--open` | Optional. Indicates that the snackbar is open and visible.
`mdc-snackbar--closing` | Optional. Applied automatically when the snackbar is in the process of animating closed.
`mdc-snackbar--leading` | Optional. Positions the snackbar on the leading edge of the screen (left in LTR, right in RTL) instead of centered.
`mdc-snackbar--stacked` | Optional. Positions the action button/icon below the label instead of alongside it.

### Sass Mixins

Mixin | Description
--- | ---
`fill-color($color)` | Sets the fill color of the snackbar.
`label-ink-color($color)` | Sets the color of the snackbar's label text.
`shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to snackbar surface with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`min-width($min-width, $mobile-breakpoint)` | Sets the `min-width` of the surface on tablet/desktop devices. On mobile, the width is automatically set to 100%.
`max-width($max-width)` | Sets the `max-width` of the snackbar.
`elevation($z-index)` | Sets the elevation of the snackbar.
`viewport-margin($margin)` | Sets the distance between the snackbar and the viewport.
`z-index($z-index)` | Sets the `z-index` of the snackbar.
`position-leading()` | Positions the snackbar on the leading edge of the screen (left in LTR, right in RTL) instead of centered.
`layout-stacked()` | Positions the action button/icon below the label instead of alongside it.

> **NOTE**: The `mdc-snackbar__action` and `mdc-snackbar__dismiss` elements can be further customized with [`mdc-button`](../mdc-button) and [`mdc-icon-button`](../mdc-icon-button) mixins.

## JavaScript API

### `MDCSnackbar` Properties

Property | Value Type | Description
--- | --- | ---
`isOpen` | `boolean` (read-only) | Gets whether the snackbar is currently open.
`timeoutMs` | `number` | Gets/sets the automatic dismiss timeout in milliseconds. Value must be between `4000` and `10000` (or `-1` to disable the timeout completely) or an error will be thrown. Defaults to `5000` (5 seconds).
`closeOnEscape` | `boolean` | Gets/sets whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key. Defaults to `true`.
`labelText` | `string` | Gets/sets the `textContent` of the label element.
`actionButtonText` | `string` | Gets/sets the `textContent` of the action button element.

> **NOTE**: Setting `labelText` while the snackbar is open will cause screen readers to announce the new label. See [Screen Readers](#screen-readers) below for more information.

### `MDCSnackbar` Methods

Method Signature | Description
--- | ---
`open() => void` | Opens the snackbar.
`close(reason: string=) => void` | Closes the snackbar, optionally with the specified reason indicating why it was closed.

### Events

Event Name | `event.detail` | Description
--- | --- | ---
`MDCSnackbar:opening` | `{}` | Indicates when the snackbar begins its opening animation.
`MDCSnackbar:opened` | `{}` | Indicates when the snackbar finishes its opening animation.
`MDCSnackbar:closing` | `{reason?: string}` | Indicates when the snackbar begins its closing animation. `reason` contains the reason why the snackbar closed (`'dismiss'`, `'action'`, or `undefined`).
`MDCSnackbar:closed` | `{reason?: string}` | Indicates when the snackbar finishes its closing animation. `reason` contains the reason why the snackbar closed (`'dismiss'`, `'action'`, or `undefined`).

### Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Snackbar for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

#### `MDCSnackbarAdapter` Methods

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`announce() => void` | Announces the snackbar's label text to screen reader users.
`notifyOpening() => void` | Broadcasts an event denoting that the snackbar has just started opening.
`notifyOpened() => void` | Broadcasts an event denoting that the snackbar has finished opening.
`notifyClosing(reason: string) => void` | Broadcasts an event denoting that the snackbar has just started closing. If a non-empty `reason` is passed, the event's `detail` object should include its value in the `reason` property.
`notifyClosed(reason: string) => void` | Broadcasts an event denoting that the snackbar has finished closing. If a non-empty `reason` is passed, the event's `detail` object should include its value in the `reason` property.

#### `MDCSnackbarFoundation` Methods

Method Signature | Description
--- | ---
`open()` | Opens the snackbar.
`close(action: string)` | Closes the snackbar, optionally with the specified action indicating why it was closed.
`isOpen() => boolean` | Returns whether the snackbar is open.
`getTimeoutMs() => number` | Returns the automatic dismiss timeout in milliseconds.
`setTimeoutMs(timeoutMs: number)` | Sets the automatic dismiss timeout in milliseconds. Value must be between `4000` and `10000` or an error will be thrown.
`getCloseOnEscape() => boolean` | Returns whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key.
`setCloseOnEscape(closeOnEscape: boolean) => void` | Sets whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key.
`handleKeyDown(event: KeyEvent)` | Handles `keydown` events on or within the snackbar's root element.
`handleActionButtonClick(event: MouseEvent)` | Handles `click` events on or within the action button.
`handleActionIconClick(event: MouseEvent)` | Handles `click` events on or within the dismiss icon.

#### Event Handlers

When wrapping the Snackbar foundation, the following events must be bound to the indicated foundation methods:

Event | Target | Foundation Handler | Register | Deregister
--- | --- | --- | --- | ---
`keydown` | `.mdc-snackbar` | `handleKeyDown` | During initialization | During destruction
`click` | `.mdc-snackbar__action` | `handleActionButtonClick` | During initialization | During destruction
`click` | `.mdc-snackbar__dismiss` | `handleActionIconClick` | During initialization | During destruction

#### The Util API

External frameworks and libraries can use the following utility methods from the `util` module when implementing their own component.

Method Signature | Description
--- | ---
`announce(ariaEl: Element, labelEl?: Element) => void` | Announces the label text to screen reader users.

> Alternatively, frameworks can use [Closure Library's `goog.a11y.aria.Announcer#say()` method](https://github.com/google/closure-library/blob/bee9ced776b4700e8076a3466bd9d3f9ade2fb54/closure/goog/a11y/aria/announcer.js#L80).

## Accessibility

### Screen Readers

Snackbars automatically announce their label text to screen reader users with a ["polite" notification](https://www.w3.org/TR/wai-aria-1.1/#aria-live) when `open()` is called.

However, screen readers only announce [ARIA Live Regions](https://mdn.io/ARIA_Live_Regions) when the element's `textContent` _changes_, so MDC Snackbar provides a `util.announce()` method to temporarily clear and then restore the label element's `textContent`.

> **NOTE**: Setting `labelText` while the snackbar is open will cause screen readers to announce the new label.

`util.announce()` supports the latest versions of the following screen readers and browsers:

* [ChromeVox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn)
* [NVDA](https://www.nvaccess.org/):
    - Chrome
    - Firefox
    - IE 11
* [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS):
    - Chrome
    - Firefox
    - IE 11

macOS VoiceOver is _not_ supported at this time.

### Dismiss Icon

Snackbars are intended to dismiss on their own after a few seconds, but a dedicated dismiss icon may be optionally included as well for accessibility purposes.

### Dismiss Key

Pressing the <kbd>ESC</kbd> key while one of the snackbar's child elements has focus (e.g., the action button) will dismiss the snackbar.

To disable this behavior, set `closeOnEscape` to `false`.

### No JS Ripples

The `mdc-snackbar__action` and `mdc-snackbar__dismiss` elements should _**not**_ have JavaScript-enabled [`MDCRipple`](../mdc-ripple) behavior.

When combined with the snackbar's exit animation, ripples cause too much motion, which can be distracting or disorienting for users.
