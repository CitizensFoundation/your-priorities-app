<!--docs:
title: "Drawers"
layout: detail
section: components
excerpt: "Permanent, dismissible, and modal drawers."
iconId: side_navigation
path: /catalog/drawers/
-->

# Navigation drawers

[Navigation drawers](https://material.io/components/navigation-drawer) provide access to destinations in your app.

![Hero navigation drawer image](images/drawer-hero.png)

**Contents**

* [Using navigation drawers](#using-navigation-drawers)
* [Types](#types)
* [Other variants](#other-variants)
* [API](#api)
* [Usage within web frameworks](#usage-within-web-frameworks)

## Using navigation drawers

A navigation drawer provides access to destinations and app functionality, such as switching accounts. It can either be permanently on-screen or controlled by a navigation menu icon.

A navigation drawer is recommended for:

* Apps with five or more top-level destinations
* Apps with two or more levels of navigation hierarchy
* Quick navigation between unrelated destinations

### Important Changes

Drawer is currently being updated to use the new List implementation. For now,
please continue to use the old implementation (`mdc-deprecated-list` and
associated DOM/classes) instead of the new one (`mdc-list`).

See the [List documentation](../mdc-list/README.md) for more information.

### Installation

```
npm install @material/drawer
```

### Styles

```scss
@use "@material/drawer";
@use "@material/list";

@include drawer.core-styles;
@include drawer.dismissible-core-styles;
@include drawer.modal-core-styles;
@include list.deprecated-core-styles;
```

### JavaScript instantiation

For permanently visible drawer, the list must be instantiated for appropriate keyboard interaction:

```js
import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-deprecated-list'));
list.wrapFocus = true;
```

Other variants use the `MDCDrawer` component, which will instantiate `MDCList` automatically:

```js
import {MDCDrawer} from "@material/drawer";
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
```

### Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### Making navigation drawers accessible

### Focus management

It is recommended to shift focus to the first focusable element in the main content when drawer is closed or one of the destination items is activated. (By default, MDC Drawer restores focus to the menu button which opened it.)

#### Dismissible drawer

Restore focus to the first focusable element when a list item is activated or after the drawer closes. Do not close the drawer upon item activation, since it should be up to the user when to show/hide the dismissible drawer.

```js
const listEl = document.querySelector('.mdc-drawer .mdc-deprecated-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  mainContentEl.querySelector('input, button').focus();
});

document.body.addEventListener('MDCDrawer:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

#### Modal drawer

Close the drawer when an item is activated in order to dismiss the modal as soon as the user performs an action. Only restore focus to the first focusable element in the main content after the drawer is closed, since it's being closed automatically.

```js
const listEl = document.querySelector('.mdc-drawer .mdc-deprecated-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  drawer.open = false;
});

document.body.addEventListener('MDCDrawer:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

## Types

There are three types of navigation drawers: [standard (1)](#standard-navigation-drawers), [modal (2)](#modal-navigation-drawers), and [bottom (3)](#bottom-navigation-drawers).

![Standard, modal, and bottom navigation drawers](images/drawer-composite.png)

### Standard navigation drawers

[Standard navigation drawers](https://material.io/components/navigation-drawer#standard-drawer) allow interaction with both screen content and the drawer at the same time. They can be used on tablet and desktop, but they aren’t suitable for mobile due to limited screen size.

```html
<aside class="mdc-drawer">
  <div class="mdc-drawer__content">
    <nav class="mdc-deprecated-list">
      <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-deprecated-list-item__text">Inbox</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-deprecated-list-item__text">Outgoing</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-deprecated-list-item__text">Drafts</span>
      </a>
    </nav>
  </div>
</aside>
```

### Modal navigation drawers

[Modal navigation drawers](https://material.io/components/navigation-drawer#modal-drawer) block interaction with the rest of an app’s content with a scrim. They are elevated above most of the app’s UI and don’t affect the screen’s layout grid.


```html
<body>
  <aside class="mdc-drawer mdc-drawer--modal">
    <div class="mdc-drawer__content">
      <nav class="mdc-deprecated-list">
        <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page" tabindex="0">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-deprecated-list-item__text">Inbox</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-deprecated-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-deprecated-list-item__text">Drafts</span>
        </a>
      </nav>
    </div>
  </aside>

  <div class="mdc-drawer-scrim"></div>
  <div>Main Content</div>
</body>
```

**Note: The `mdc-drawer-scrim` next sibling element is required, to protect the app's UI from interactions while the modal drawer is open.**

### Bottom navigation drawers

[Bottom navigation drawers](https://material.io/components/navigation-drawer#bottom-drawer) are modal drawers that are anchored to the bottom of the screen instead of the left or right edge. They are only used with bottom app bars.

MDC Web does not currently support bottom navigation drawers.

## Other variants

### Drawer with separate list groups

```html
<aside class="mdc-drawer">
  <div class="mdc-drawer__content">
    <nav class="mdc-deprecated-list">
      <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-deprecated-list-item__text">Inbox</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">star</i>
        <span class="mdc-deprecated-list-item__text">Star</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-deprecated-list-item__text">Sent Mail</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-deprecated-list-item__text">Drafts</span>
      </a>

      <hr class="mdc-deprecated-list-divider">
      <h6 class="mdc-deprecated-list-group__subheader">Labels</h6>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-deprecated-list-item__text">Family</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-deprecated-list-item__text">Friends</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-deprecated-list-item__text">Work</span>
      </a>
    </nav>
  </div>
</aside>
```

### Drawer with header

Drawers can contain a header element which will not scroll with the rest of the drawer content. Things like account switchers and titles should live in the header element.

```html
<aside class="mdc-drawer">
  <div class="mdc-drawer__header">
    <h3 class="mdc-drawer__title">Mail</h3>
    <h6 class="mdc-drawer__subtitle">email@material.io</h6>
  </div>
  <div class="mdc-drawer__content">
    <nav class="mdc-deprecated-list">
      <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-deprecated-list-item__text">Inbox</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-deprecated-list-item__text">Outgoing</span>
      </a>
      <a class="mdc-deprecated-list-item" href="#">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-deprecated-list-item__text">Drafts</span>
      </a>
    </nav>
  </div>
</aside>
```

### Dismissible drawer

Dismissible drawers are by default hidden off screen, and can slide into view. Dismissible drawers should be used when navigation is not common, and the main app content is prioritized.

```html
<body>
  <aside class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <nav class="mdc-deprecated-list">
        <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-deprecated-list-item__text">Inbox</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-deprecated-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-deprecated-list-item__text">Drafts</span>
        </a>
      </nav>
    </div>
  </aside>

  <div class="mdc-drawer-app-content">
    App Content
  </div>
</body>
```

**Note: Apply the `mdc-drawer-app-content` class to the sibling element after the drawer for the open/close animations to work.**

#### Usage with top app bar

##### Dismissible drawer: full height drawer

In cases where the drawer occupies the full viewport height, some styles must be applied to get the dismissible drawer and the content below the top app bar to independently scroll and work in all browsers.

In the following example, the `mdc-drawer__content` and `main-content` elements should scroll independently of each other. The `mdc-drawer--dismissible` and `mdc-drawer-app-content` elements should then sit side-by-side. The markup looks something like this:

```html
<body>
  <aside class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <div class="mdc-deprecated-list">
        <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-deprecated-list-item__text">Inbox</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-deprecated-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-deprecated-list-item__text">Drafts</span>
        </a>
      </div>
    </div>
  </aside>

  <div class="mdc-drawer-app-content">
    <header class="mdc-top-app-bar app-bar" id="app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
          <span class="mdc-top-app-bar__title">Dismissible Drawer</span>
        </section>
      </div>
    </header>

    <main class="main-content" id="main-content">
      <div class="mdc-top-app-bar--fixed-adjust">
        App Content
      </div>
    </main>
  </div>
</body>
```

##### Dismissible drawer: below top app bar

In cases where the drawer appears below the top app bar you will want to follow the markup shown below. The `mdc-drawer__content` and `main-content` elements will also scroll independently of each other. The `mdc-top-app-bar`, `mdc-drawer` and `mdc-drawer-app-content` will be sibling to each other. The `mdc-top-app-bar--fixed-adjust` helper class will be applied to `mdc-drawer` and `mdc-drawer-app-content` elements to adjust the position with top app bar.

```html
<body>
  <header class="mdc-top-app-bar app-bar" id="app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
        <span class="mdc-top-app-bar__title">Dismissible Drawer</span>
      </section>
    </div>
  </header>
  <aside class="mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust">
    <div class="mdc-drawer__content">
      <div class="mdc-deprecated-list">
        <a class="mdc-deprecated-list-item mdc-deprecated-list-item--activated" href="#" aria-current="page">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-deprecated-list-item__text">Inbox</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-deprecated-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-deprecated-list-item" href="#">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-deprecated-list-item__text">Drafts</span>
        </a>
      </div>
    </div>
  </aside>

  <div class="mdc-drawer-app-content mdc-top-app-bar--fixed-adjust">
    <main class="main-content" id="main-content">
      App Content
    </main>
  </div>
</body>
```

The CSS to match either case looks like this:

```scss
// Note: These styles do not account for any paddings/margins that you may need.

body {
  display: flex;
  height: 100vh;
}

.mdc-drawer-app-content {
  flex: auto;
  overflow: auto;
  position: relative;
}

.main-content {
  overflow: auto;
  height: 100%;
}

.app-bar {
  position: absolute;
}

// Only apply this style if below top app bar.
.mdc-top-app-bar {
  z-index: 7;
}
```

The JavaScript to toggle the drawer when the navigation button is clicked looks like this:

```js
import {MDCTopAppBar} from "@material/top-app-bar";
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});
```

## API

### CSS classes

Class | Description
--- | ---
`mdc-drawer` |  Mandatory.
`mdc-drawer__header` | Non-scrollable element that exists at the top of the drawer.
`mdc-drawer__content` | Scrollable content area of the drawer.
`mdc-drawer__title` | Title text element of the drawer.
`mdc-drawer__subtitle` | Subtitle text element of the drawer.
`mdc-drawer--dismissible` | Dismissible drawer variant class.
`mdc-drawer--modal` | Modal drawer variant class.
`mdc-drawer--open` | If present, indicates that the dismissible drawer is in the open position.
`mdc-drawer--opening` | Applied while the drawer is animating from the closed to the open position.
`mdc-drawer--closing` | Applied while the drawer is animating from the open to the closed position.
`mdc-drawer-app-content` | Mandatory for dismissible variant only. Sibling element that is resized when the drawer opens/closes.
`mdc-drawer-scrim` | Mandatory for modal variant only. Used for the overlay on the app content.

### Sass mixins

Mixin | Description
--- | ---
`border-color($color)` | Sets border color of `mdc-drawer` surface.
`divider-color($color)` | Sets divider color found between list groups.
`fill-color-accessible($color)` | Sets the fill color to `$color`, and list item and icon ink colors to an accessible color relative to `$color`.
`surface-fill-color($color)` | Sets the background color of `mdc-drawer`.
`title-ink-color($color)` | Sets the ink color of `mdc-drawer__title`.
`subtitle-ink-color` | Sets drawer subtitle and list subheader ink color.
`item-icon-ink-color($color)` | Sets drawer list item graphic icon ink color.
`item-text-ink-color($color)` | Sets drawer list item text ink color.
`item-activated-icon-ink-color($color)` | Sets activated drawer list item icon ink color.
`item-activated-text-ink-color($color)` | Sets activated drawer list item text ink color.
`shape-radius($radius)` | Sets the rounded shape to drawer with given radius size. `$radius` can be single radius or list of 2 radius values for trailing-top and trailing-bottom. Automatically flips the radius values in RTL context.
`item-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to drawer navigation item with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to true.
`activated-overlay-color($color)` | Sets the overlay color of the activated drawer list item.
`scrim-fill-color($color)` | Sets the fill color of `mdc-drawer-scrim`.
`z-index($value)` | Sets the z index of drawer. Drawer stays on top of top app bar except for clipped variant of drawer.
`width($width)` | Sets the width of the drawer. In the case of the dismissible variant, also sets margin required for `mdc-drawer-app-content`.

### `MDCDrawer`

#### Methods

Signature | Description
--- | ---
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions \| boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions \| boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
open | `boolean` | Toggles the drawer open and closed.

#### Events

- `MDCDrawer:closed {}` Emits when the navigation drawer has closed.
- `MDCDrawer:opened {}` Emits when the navigation drawer has opened.

## Usage within web frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCDrawerAdapter`

#### Methods

Signature | Description
--- | ---
`notifyOpen() => void` | Emits a custom event "MDCDrawer:opened" denoting the drawer has opened.
`addClass(className: string) => void` | Adds a class to the root Element.
`focusActiveNavigationItem() => void` | Focuses the active / selected navigation item.
`hasClass(className: string) => boolean` | Returns true if the root Element contains the given class.
`notifyClose() => void` | Emits a custom event "MDCDrawer:closed" denoting the drawer has closed.
`elementHasClass(element: Element, className: string) => boolean` | Returns true if the element contains the given class.
`releaseFocus() => void` | Releases focus trap from root element which was set by `trapFocus` and restores focus to where it was prior to calling `trapFocus`.
`removeClass(className: string) => void` | Removes a class from the root Element.
`restoreFocus() => void` | Restores focus to element previously saved with 'saveFocus'.
`saveFocus() => void` | Saves the focus of currently active element.
`trapFocus() => void` | Traps focus on root element and focuses the active navigation element.

### `MDCDismissibleDrawerFoundation`

#### Methods

Signature | Description
--- | ---
`close() => void` | Closes the drawer from the open state.
`handleKeydown(evt: KeyboardEvent) => void` | Keydown handler to close drawer when key is escape.
`handleTransitionEnd(evt: TransitionEvent) => void` | Handles the `transitionend` event when the drawer finishes opening/closing.
`closed_() => void` | Extension point for when drawer finishes close animation.
`isClosing() => boolean` | Returns true if the drawer is animating closed.
`isOpen() => boolean` | Returns true if the drawer is in the open position.
`isOpening() => boolean` | Returns true if the drawer is animating open.
`open() => void` | Opens the drawer from the closed state.
`opened_() => void` | Extension point for when drawer finishes open animation.

### `MDCModalDrawerFoundation`

#### Methods

Signature | Description
--- | ---
`close() => void` | Closes the drawer from the open state.
`handleKeydown(evt: KeyboardEvent) => void` | Keydown handler to close drawer when key is escape.
`handleScrimClick() => void` | Handles click event on scrim.
`handleTransitionEnd(evt: TransitionEvent) => void` | Handles the `transitionend` event when the drawer finishes opening/closing.
`closed_() => void` | Called when drawer finishes close animation.
`isClosing() => boolean` | Returns true if the drawer is animating closed.
`isOpen() => boolean` | Returns true if the drawer is in the open position.
`isOpening() => boolean` | Returns true if the drawer is animating open.
`open() => void` | Opens the drawer from the closed state.
`opened_() => void` | Called when drawer finishes open animation.
