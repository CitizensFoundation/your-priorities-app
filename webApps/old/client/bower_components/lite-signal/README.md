
<!-- [![Build status](https://travis-ci.org/PolymerElements/lite-signal.svg?branch=master)](https://travis-ci.org/PolymerElements/lite-signal) -->

<!-- _[Demo and API docs](https://elements.polymer-project.org/elements/lite-signal)_ -->


## lite-signal

`lite-signal` provides basic publish-subscribe functionality for Polymer 2.

It is a descendant of the unmaintained https://github.com/PolymerElements/iron-signals component.

Note: avoid using `lite-signal` whenever you can use
a controller (parent element) to mediate communication
instead.

To send a signal, fire a custom event of type `lite-signal`, with
a detail object containing `name` and `data` fields.

```javascript
this.dispatchEvent(
  new CustomEvent("lite-signal", {
    bubbles: true,
    compose: true, // to cross Shadow DOM boundaries
    detail: {
      name: "hello",
      data: { foo: true }
    }
  })
)
```

To receive a signal, listen for `lite-signal-<name>` event on a
`lite-signal` element within your Polymer element:

```javascript
<lite-signal on-lite-signal-hello="helloSignalHandler"></lite-signal>

...


helloSignalHandler(e) {
  // do something with event
}
```

You can fire a signal event from anywhere, and all
`lite-signal` elements will receive the event, regardless
of where they are in DOM.
