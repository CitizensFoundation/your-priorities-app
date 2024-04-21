# &lt;vaadin-text-field&gt;

> ⚠️ Starting from Vaadin 20, the source code and issues for this component are migrated to the [`vaadin/web-components`](https://github.com/vaadin/web-components/tree/master/packages/vaadin-text-field) monorepository.
> This repository contains the source code and releases of `<vaadin-text-field>` for the Vaadin versions 10 to 19.

[&lt;vaadin-text-field&gt;](https://vaadin.com/components/vaadin-text-field) is a themable Web Component providing input controls in forms, part of the [Vaadin components](https://vaadin.com/components).

[Live Demo ↗](https://vaadin.com/components/vaadin-text-field/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-text-field/html-api)

[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-text-field.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-text-field)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-text-field)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-text-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-text-field.html">
    <link rel="import" href="vaadin-password-field.html">
    <link rel="import" href="vaadin-text-area.html">
    <link rel="import" href="vaadin-email-field.html">
    <link rel="import" href="vaadin-number-field.html">
    <link rel="import" href="vaadin-integer-field.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-text-field label="Username"></vaadin-text-field>
<vaadin-password-field label="Password"></vaadin-password-field>
<vaadin-text-area label="Description"></vaadin-text-area>
<vaadin-email-field label="Email"></vaadin-email-field>
<vaadin-number-field label="Price"></vaadin-number-field>
<vaadin-integer-field label="Count" has-controls></vaadin-integer-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-text-field/master/screenshot.png" width="710" alt="Screenshot of vaadin-text-field">](https://vaadin.com/components/vaadin-text-field)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-text-field`:

```sh
bower i vaadin/vaadin-text-field --save
```

Once installed, import the components you need in your application:

```html
<link rel="import" href="bower_components/vaadin-text-field/vaadin-text-field.html">
<link rel="import" href="bower_components/vaadin-text-field/vaadin-text-area.html">
<link rel="import" href="bower_components/vaadin-text-field/vaadin-password-field.html">
<link rel="import" href="bower_components/vaadin-text-field/vaadin-email-field.html">
<link rel="import" href="bower_components/vaadin-text-field/vaadin-number-field.html">
<link rel="import" href="bower_components/vaadin-text-field/vaadin-integer-field.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-text-field`:

```sh
npm i @vaadin/vaadin-text-field --save
```

Once installed, import the components you need in your application:

```js
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/vaadin-text-area.js';
import '@vaadin/vaadin-text-field/vaadin-password-field.js';
import '@vaadin/vaadin-text-field/vaadin-email-field.js';
import '@vaadin/vaadin-text-field/vaadin-number-field.js';
import '@vaadin/vaadin-text-field/vaadin-integer-field.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-text-field.html`
  `theme/lumo/vaadin-text-area.html`
  `theme/lumo/vaadin-password-field.html`
  `theme/lumo/vaadin-email-field.html`
  `theme/lumo/vaadin-number-field.html`
  `theme/lumo/vaadin-integer-field.html`

- The components with the Material theme:

  `theme/material/vaadin-text-field.html`
  `theme/material/vaadin-text-area.html`
  `theme/material/vaadin-password-field.html`
  `theme/material/vaadin-email-field.html`
  `theme/material/vaadin-number-field.html`
  `theme/material/vaadin-integer-field.html`

- Aliases for `theme/lumo/vaadin-text-field.html`
  `theme/lumo/vaadin-text-area.html`
  `theme/lumo/vaadin-password-field.html`
  `theme/lumo/vaadin-email-field.html`
  `theme/lumo/vaadin-number-field.html`
  `theme/lumo/vaadin-integer-field.html`:

  `vaadin-text-field.html`
  `vaadin-text-area.html`
  `vaadin-password-field.html`
  `vaadin-email-field.html`
  `vaadin-number-field`
  `vaadin-integer-field`


## Running demos and tests in a browser

1. Fork the `vaadin-text-field` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) and [Bower](https://bower.io) installed.

1. When in the `vaadin-text-field` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:3000/components/vaadin-text-field/demo
  - http://127.0.0.1:3000/components/vaadin-text-field/test


## Running tests from the command line

1. When in the `vaadin-text-field` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
