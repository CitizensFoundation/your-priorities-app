System.register(["./nomodule-0e20d20b.js"],(function(e,t){var n,r,o,i,l;function u(e){var t=r.get(e);return console.assert(null!=t,"'this' is expected an Event object, but got",e),t}function a(e){null==e.passiveListener?e.event.cancelable&&(e.canceled=!0,"function"==typeof e.event.preventDefault&&e.event.preventDefault()):"undefined"!=typeof console&&"function"==typeof console.error&&console.error("Unable to preventDefault inside passive event listener invocation.",e.passiveListener)}function s(e,t){r.set(this,{eventTarget:e,event:t,eventPhase:2,currentTarget:e,canceled:!1,stopped:!1,immediateStopped:!1,passiveListener:null,timeStamp:t.timeStamp||Date.now()}),Object.defineProperty(this,"isTrusted",{value:!1,enumerable:!0});for(var n=Object.keys(t),o=0;o<n.length;++o){var i=n[o];i in this||Object.defineProperty(this,i,c(i))}}function c(e){return{get:function(){return u(this).event[e]},set:function(t){u(this).event[e]=t},configurable:!0,enumerable:!0}}function p(e){return{value:function(){var t=u(this).event;return t[e].apply(t,arguments)},configurable:!0,enumerable:!0}}function f(e){if(null==e||e===Object.prototype)return s;var t=o.get(e);return null==t&&(t=function(e,t){var n=Object.keys(t);if(0===n.length)return e;function r(t,n){e.call(this,t,n)}r.prototype=Object.create(e.prototype,{constructor:{value:r,configurable:!0,writable:!0}});for(var o=0;o<n.length;++o){var i=n[o];if(!(i in e.prototype)){var l="function"==typeof Object.getOwnPropertyDescriptor(t,i).value;Object.defineProperty(r.prototype,i,l?p(i):c(i))}}return r}(f(Object.getPrototypeOf(e)),e),o.set(e,t)),t}function v(e){return u(e).immediateStopped}function y(e,t){u(e).passiveListener=t}function g(e){return null!==e&&"object"===n(e)}function d(e){var t=i.get(e);if(null==t)throw new TypeError("'this' is expected an EventTarget object, but got another value.");return t}function h(e,t){Object.defineProperty(e,"on".concat(t),function(e){return{get:function(){for(var t=d(this).get(e);null!=t;){if(t.listenerType===l)return t.listener;t=t.next}return null},set:function(t){"function"==typeof t||g(t)||(t=null);for(var n=d(this),r=null,o=n.get(e);null!=o;)o.listenerType===l?null!==r?r.next=o.next:null!==o.next?n.set(e,o.next):n.delete(e):r=o,o=o.next;if(null!==t){var i={listener:t,listenerType:l,passive:!1,once:!1,next:null};null===r?n.set(e,i):r.next=i}},configurable:!0,enumerable:!0}}(t))}function b(e){function t(){w.call(this)}t.prototype=Object.create(w.prototype,{constructor:{value:t,configurable:!0,writable:!0}});for(var n=0;n<e.length;++n)h(t.prototype,e[n]);return t}function w(){if(!(this instanceof w)){if(1===arguments.length&&Array.isArray(arguments[0]))return b(arguments[0]);if(arguments.length>0){for(var e=new Array(arguments.length),t=0;t<arguments.length;++t)e[t]=arguments[t];return b(e)}throw new TypeError("Cannot call a class as a function")}i.set(this,new Map)}return e({EventTarget:w,defineEventAttribute:h}),{setters:[function(e){n=e.typeof}],execute:function(){r=new WeakMap,o=new WeakMap,s.prototype={get type(){return u(this).event.type},get target(){return u(this).eventTarget},get currentTarget(){return u(this).currentTarget},composedPath:function(){var e=u(this).currentTarget;return null==e?[]:[e]},get NONE(){return 0},get CAPTURING_PHASE(){return 1},get AT_TARGET(){return 2},get BUBBLING_PHASE(){return 3},get eventPhase(){return u(this).eventPhase},stopPropagation:function(){var e=u(this);e.stopped=!0,"function"==typeof e.event.stopPropagation&&e.event.stopPropagation()},stopImmediatePropagation:function(){var e=u(this);e.stopped=!0,e.immediateStopped=!0,"function"==typeof e.event.stopImmediatePropagation&&e.event.stopImmediatePropagation()},get bubbles(){return Boolean(u(this).event.bubbles)},get cancelable(){return Boolean(u(this).event.cancelable)},preventDefault:function(){a(u(this))},get defaultPrevented(){return u(this).canceled},get composed(){return Boolean(u(this).event.composed)},get timeStamp(){return u(this).timeStamp},get srcElement(){return u(this).eventTarget},get cancelBubble(){return u(this).stopped},set cancelBubble(e){if(e){var t=u(this);t.stopped=!0,"boolean"==typeof t.event.cancelBubble&&(t.event.cancelBubble=!0)}},get returnValue(){return!u(this).canceled},set returnValue(e){e||a(u(this))},initEvent:function(){}},Object.defineProperty(s.prototype,"constructor",{value:s,configurable:!0,writable:!0}),"undefined"!=typeof window&&void 0!==window.Event&&(Object.setPrototypeOf(s.prototype,window.Event.prototype),o.set(window.Event.prototype,s)),i=new WeakMap,1,2,l=3,w.prototype={addEventListener:function(e,t,n){if(null!=t){if("function"!=typeof t&&!g(t))throw new TypeError("'listener' should be a function or an object.");var r=d(this),o=g(n),i=(o?Boolean(n.capture):Boolean(n))?1:2,l={listener:t,listenerType:i,passive:o&&Boolean(n.passive),once:o&&Boolean(n.once),next:null},u=r.get(e);if(void 0!==u){for(var a=null;null!=u;){if(u.listener===t&&u.listenerType===i)return;a=u,u=u.next}a.next=l}else r.set(e,l)}},removeEventListener:function(e,t,n){if(null!=t)for(var r=d(this),o=(g(n)?Boolean(n.capture):Boolean(n))?1:2,i=null,l=r.get(e);null!=l;){if(l.listener===t&&l.listenerType===o)return void(null!==i?i.next=l.next:null!==l.next?r.set(e,l.next):r.delete(e));i=l,l=l.next}},dispatchEvent:function(e){if(null==e||"string"!=typeof e.type)throw new TypeError('"event.type" should be a string.');var t=d(this),n=e.type,r=t.get(n);if(null==r)return!0;for(var o=function(e,t){return new(f(Object.getPrototypeOf(t)))(e,t)}(this,e),i=null;null!=r;){if(r.once?null!==i?i.next=r.next:null!==r.next?t.set(n,r.next):t.delete(n):i=r,y(o,r.passive?r.listener:null),"function"==typeof r.listener)try{r.listener.call(this,o)}catch(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e)}else r.listenerType!==l&&"function"==typeof r.listener.handleEvent&&r.listener.handleEvent(o);if(v(o))break;r=r.next}return y(o,null),function(e,t){u(e).eventPhase=t}(o,0),function(e,t){u(e).currentTarget=t}(o,null),!o.defaultPrevented}},Object.defineProperty(w.prototype,"constructor",{value:w,configurable:!0,writable:!0}),"undefined"!=typeof window&&void 0!==window.EventTarget&&Object.setPrototypeOf(w.prototype,window.EventTarget.prototype),e("default",w)}}}));