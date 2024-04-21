[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/MacTheZazou/paper-share-button)

##&lt;paper-share-button&gt;

Material design: URL sharing system

`<paper-share-button>` is a light Material Design URL sharing system.

### Social Media Supported:
+ Facebook
+ Google Plus
+ Twitter
+ Reddit
+ VK
+ Blogger
+ Tumblr
+ E-mail

### Popup
`<paper-share-button>` supports popup sharing. Just add the attribute 'popup' to the element.

Compatibility list:
+ Facebook
+ Google Plus
+ Twitter

non-compatible social media will open in a new tab.
`Note: Popup demo won't work in frame`

Example:

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="paper-share-button.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<paper-share-button facebook google twitter email url="https://example.org"></paper-share-button>
```
