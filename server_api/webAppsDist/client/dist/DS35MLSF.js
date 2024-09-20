import{am as t,i as e,n as r,s as i,t as n,x as o,T as a,H as s,h as l,an as c,a0 as d,E as p,d as h,G as u,B as g,p as m,D as f}from"./B9QsuJho.js";import"./97YzqM3E.js";import"./B7yhNaDu.js";import{C as y,r as v}from"./BVhB0fPt.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const b=1e6,w=1e9;function x(t){if(t>=1e3&&t<b){const e=t/1e3;return e===Math.floor(e)||t>=1e5?Math.floor(e)+"k":Math.floor(10*e)/10+"k"}if(t>=b&&t<w){const e=t/b;return e===Math.floor(e)||t>=1e8?Math.floor(e)+"M":Math.floor(10*e)/10+"M"}if(t>=w&&t<1e12){const e=t/w;return e===Math.floor(e)||t>=1e11?Math.floor(e)+"B":Math.floor(10*e)/10+"B"}return t}function k(t){const e=Math.floor(t/60/60),r=Math.floor(t/60)%60,i=Math.floor(t-60*r-60*e*60);return e>0?`${e}h ${r}m ${i}s`:r>0?`${r}m ${n=i,o=2,("000"+n).slice(-1*o)}s`:`${i}s`;var n,o}function $(t){return new Date(t.getTime()-6e4*t.getTimezoneOffset()).toISOString().split("T")[0]}function C(t,e){const r=new Date(t.getTime()),i=r.getDate();return r.setMonth(r.getMonth()+e),r.getDate()!==i&&r.setDate(0),r}function _(t,e){const r=new Date(t.getTime());return r.setDate(r.getDate()+e),r}const D=["January","February","March","April","May","June","July","August","September","October","November","December"],S=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function M(t){return`${D[t.getMonth()]} ${t.getFullYear()}`}function T(t){const e=S[t.getDay()];return t.getFullYear()!==(new Date).getFullYear()?`${e}, ${t.getDate()} ${q(t)} ${t.getFullYear()}`:`${e}, ${t.getDate()} ${q(t)}`}function E(t){return`${t.getDate()} ${q(t)}`}function A(t){let e;if("string"==typeof t&&t.includes(" ")){const r=t.split(/[^0-9]/).map((t=>parseInt(t,10)));r[1]-=1,e=new Date(...r)}else e=new Date(t);return new Date(e.getTime()+6e4*e.getTimezoneOffset())}function O(t){const e=60*(new Date).getTimezoneOffset();return new Date((new Date).getTime()+1e3*t.offset+1e3*e)}function I(t,e){return $(e)===$(O(t))}function P(t,e,r){return t.getFullYear()!==e.getFullYear()?t.getFullYear()<e.getFullYear():"year"!==r&&(t.getMonth()!==e.getMonth()?t.getMonth()<e.getMonth():"month"!==r&&t.getDate()<e.getDate())}function j(t,e,r){return t.getFullYear()!==e.getFullYear()?t.getFullYear()>e.getFullYear():"year"!==r&&(t.getMonth()!==e.getMonth()?t.getMonth()>e.getMonth():"month"!==r&&t.getDate()>e.getDate())}function q(t){return`${D[t.getMonth()].substring(0,3)}`}let N=new AbortController;class L extends Error{constructor(t){super(t),this.name="ApiError"}}function R(t,e=[]){const r={period:"realtime"};return t.period&&(r.period=t.period),t.date&&t.date instanceof Date?r.date=$(t.date):r.date=t.date,t.from&&(r.from=$(t.from)),t.to&&(r.to=$(t.to)),t.filters&&(r.filters=function(t){const e={};return Object.entries(t).forEach((([t,r])=>r?e[t]=r:null)),JSON.stringify(e)}(t.filters)),t.with_imported&&(r.with_imported=t.with_imported),Object.assign(r,...e),"?"+function(t){var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return e.join("&")}(r)}function U(t,e,r,...i){return t?function(t,e,r,...i){const n={Accept:"application/json","Content-Type":"application/json"};return e+=R(r,i),fetch(t,{method:"PUT",body:JSON.stringify({plausibleUrl:e}),signal:N.signal,headers:n}).then((t=>(t.ok,t.json())))}(t,e,r,...i):function(t,e,...r){const i={Accept:"application/json","Content-Type":"application/json"};return t+=R(e,r),fetch(t,{signal:N.signal,headers:i}).then((t=>t.ok?t.json():t.json().then((t=>{throw new L(t.error)}))))}(e,r,...i)}const F={};const z=function(){try{const t="test";return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch(t){return!1}}();function B(t,e){z?window.localStorage.setItem(t,e):F[t]=e}function H(t){return z?window.localStorage.getItem(t):F[t]??null}const Y=e`
  .bg-red-50 {
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }

  .bg-red-60 {
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }

  .modal {
    display: none;
  }
  .modal.is-open {
    display: block;
  }
  .modal[aria-hidden='false'] .modal__overlay {
    animation: mmfadeIn 0.2s ease-in;
  }
  .modal[aria-hidden='true'] .modal__overlay {
    animation: mmfadeOut 0.2s ease-in;
  }
  .modal-enter {
    opacity: 0;
  }
  .modal-enter-active {
    opacity: 1;
    transition: opacity 0.1s ease-in;
  }
  .modal__overlay {
    background: rgba(0, 0, 0, 0.6);
    bottom: 0;
    left: 0;
    overflow-x: auto;
    overflow-y: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 99;
  }
  .modal__container {
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 50px auto;
    min-height: 509px;
    padding: 1rem 2rem;
    transition: height 0.2s ease-in;
  }
  .modal__close {
    color: #b8c2cc;
    font-size: 48px;
    font-weight: 700;
    position: fixed;
    right: 24px;
    top: 12px;
  }

  .modal__content {
    margin-bottom: 2rem;
  }
  @keyframes mmfadeIn {
    0% {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes mmfadeOut {
    0% {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .loading {
    animation: loaderFadein 0.2s ease-in;
    height: 50px;
    width: 50px;
  }
  .loading.sm {
    height: 25px;
    width: 25px;
  }
  .loading div {
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
    border: 3px solid #dae1e7;
    border-radius: 50%;
    border-top-color: #606f7b;
    display: inline-block;
    height: 50px;
    width: 50px;
  }
  .dark .loading div {
    border: 3px solid #606f7b;
    border-top-color: #dae1e7;
  }
  .loading.sm div {
    height: 25px;
    width: 25px;
  }
  @keyframes loaderFadein {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  [tooltip] {
    display: inline-block;
    position: relative;
  }
  [tooltip]:before {
    border-color: #191e38 transparent transparent;
    border-style: solid;
    border-width: 4px 6px 0;
    content: '';
    transform: translateX(-50%);
  }
  [tooltip]:after,
  [tooltip]:before {
    left: 50%;
    opacity: 0;
    position: absolute;
    top: -6px;
    transition: 0.3s;
    z-index: 99;
  }
  [tooltip]:after {
    background: #191e38;
    border-radius: 3px;
    color: #fff;
    content: attr(tooltip);
    font-size: 0.875rem;
    max-width: 420px;
    min-width: 80px;
    padding: 4px 8px;
    pointer-events: none;
    text-align: center;
    transform: translateX(-50%) translateY(-100%);
    white-space: nowrap;
  }
  [tooltip]:hover:after,
  [tooltip]:hover:before {
    opacity: 1;
  }
  .flatpickr-calendar:after,
  .flatpickr-calendar:before {
    right: 22px !important;
  }
  .flatpickr-wrapper {
    right: 35% !important;
  }
  @media (max-width: 768px) {
    .flatpickr-wrapper {
      right: 50% !important;
    }
  }
  .dark .flatpickr-calendar {
    background-color: #1f2937;
  }
  .dark .flatpickr-weekday {
    color: #f3f4f6;
  }
  .dark .flatpickr-next-month,
  .dark .flatpickr-prev-month {
    fill: #f3f4f6 !important;
  }
  .dark .flatpickr-monthDropdown-months {
    color: #f3f4f6 !important;
  }
  .dark .numInputWrapper {
    color: #f3f4f6;
  }
  .dark .numInput[disabled] {
    color: #9ca3af !important;
  }
  .dark .flatpickr-current-month .numInputWrapper span.arrowUp:after {
    border-bottom-color: #f3f4f6 !important;
  }
  .dark .flatpickr-current-month .numInputWrapper span.arrowDown:after {
    border-top-color: #f3f4f6 !important;
  }
  .dark .flatpickr-day.prevMonthDay {
    color: #94a3af;
  }
  .dark .flatpickr-day {
    color: #e5e7eb;
  }
  .dark .flatpickr-day.nextMonthDay,
  .dark .flatpickr-day.prevMonthDay {
    color: #9ca3af;
  }
  .dark .flatpickr-day:hover,
  .dark :not(.startRange):not(.endRange).flatpickr-day.nextMonthDay:hover,
  .dark :not(.startRange):not(.endRange).flatpickr-day.prevMonthDay:hover {
    background-color: #374151;
  }
  .dark .flatpickr-next-month {
    fill: #f3f4f6;
  }
  .dark .flatpickr-day.flatpickr-disabled,
  .dark .flatpickr-day.flatpickr-disabled:hover {
    color: #4b5563;
  }
  .dark .flatpickr-day.today {
    background-color: rgba(167, 243, 208, 0.5);
    border-color: #34d399;
  }
  .dark .flatpickr-day.inRange,
  .dark .flatpickr-day.nextMonthDay.inRange,
  .dark .flatpickr-day.prevMonthDay.inRange {
    background-color: #374151;
    border-color: #374151;
    box-shadow: -5px 0 0 #374151, 5px 0 0 #374151;
  }
  .flatpickr-day.endRange,
  .flatpickr-day.startRange {
    background: #6574cd !important;
    border-color: #6574cd !important;
  }
  .dark .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1)) {
    -webkit-box-shadow: -10px 0 0 #4556c3 !important;
    box-shadow: -10px 0 0 #4556c3 !important;
  }

  /*! tailwindcss v2.2.16 | MIT License | https://tailwindcss.com */

  /*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */
  html {
    -webkit-text-size-adjust: 100%;
    line-height: 1.15;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
  }
  body {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
    margin: 0;
  }
  hr {
    color: inherit;
    height: 0;
  }
  abbr[title] {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  pre,
  samp {
    font-family: ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo,
      monospace;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    border-color: inherit;
    text-indent: 0;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  select {
    text-transform: none;
  }
  [type='button'],
  [type='reset'],
  [type='submit'],
  button {
    -webkit-appearance: button;
  }
  legend {
    padding: 0;
  }
  progress {
    vertical-align: baseline;
  }
  [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  summary {
    display: list-item;
  }
  blockquote,
  dd,
  dl,
  figure,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  p,
  pre {
    margin: 0;
  }
  button {
    background-color: transparent;
    background-image: none;
  }
  fieldset,
  ol,
  ul {
    margin: 0;
    padding: 0;
  }
  ol,
  ul {
    list-style: none;
  }
  html {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    line-height: 1.5;
  }
  body {
    font-family: inherit;
    line-height: inherit;
  }
  *,
  :after,
  :before {
    border: 0 solid;
    box-sizing: border-box;
  }
  hr {
    border-top-width: 1px;
  }
  img {
    border-style: solid;
  }
  textarea {
    resize: vertical;
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #9ca3af;
  }
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #9ca3af;
  }
  input::placeholder,
  textarea::placeholder {
    color: #9ca3af;
  }
  [role='button'],
  button {
    cursor: pointer;
  }
  table {
    border-collapse: collapse;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    color: inherit;
    line-height: inherit;
    padding: 0;
  }
  code,
  kbd,
  pre,
  samp {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      Liberation Mono, Courier New, monospace;
  }
  audio,
  canvas,
  embed,
  iframe,
  img,
  object,
  svg,
  video {
    display: block;
    vertical-align: middle;
  }
  img,
  video {
    height: auto;
    max-width: 100%;
  }
  [hidden] {
    display: none;
  }
  *,
  :after,
  :before {
    --tw-border-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  }
  [multiple],
  [type='date'],
  [type='email'],
  [type='month'],
  [type='number'],
  [type='password'],
  [type='search'],
  [type='text'],
  [type='time'],
  [type='url'],
  [type='week'],
  select,
  textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    border-color: #6b7280;
    border-radius: 0;
    border-width: 1px;
    font-size: 1rem;
    line-height: 1.5rem;
    padding: 0.5rem 0.75rem;
  }
  [multiple]:focus,
  [type='date']:focus,
  [type='email']:focus,
  [type='month']:focus,
  [type='number']:focus,
  [type='password']:focus,
  [type='search']:focus,
  [type='text']:focus,
  [type='time']:focus,
  [type='url']:focus,
  [type='week']:focus,
  select:focus,
  textarea:focus {
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: #2563eb;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    border-color: #2563eb;
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #6b7280;
    opacity: 1;
  }
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #6b7280;
    opacity: 1;
  }
  input::placeholder,
  textarea::placeholder {
    color: #6b7280;
    opacity: 1;
  }
  select {
    -webkit-print-color-adjust: exact;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    color-adjust: exact;
    padding-right: 2.5rem;
  }
  [multiple] {
    -webkit-print-color-adjust: unset;
    background-image: none;
    background-position: 0 0;
    background-repeat: unset;
    background-size: initial;
    color-adjust: unset;
    padding-right: 0.75rem;
  }
  [type='file'] {
    background: unset;
    border-color: inherit;
    border-radius: 0;
    border-width: 0;
    font-size: unset;
    line-height: inherit;
    padding: 0;
  }
  [type='file']:focus {
    outline: 1px auto -webkit-focus-ring-color;
  }
  .container {
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
  @media (min-width: 640px) {
    .container {
      max-width: 640px;
    }
  }
  @media (min-width: 768px) {
    .container {
      max-width: 768px;
    }
  }
  @media (min-width: 1024px) {
    .container {
      max-width: 1024px;
    }
  }
  @media (min-width: 1280px) {
    .container {
      max-width: 1280px;
    }
  }
  @media (min-width: 1536px) {
    .container {
      max-width: 1536px;
    }
  }
  [x-cloak] {
    display: none;
  }
  .button {
    --tw-bg-opacity: 1;
    background-color: rgba(79, 70, 229, var(--tw-bg-opacity));
    border-color: transparent;
    border-radius: 0.375rem;
    border-width: 1px;
    display: inline-flex;
    justify-content: center;
  }
  .button:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(67, 56, 202, var(--tw-bg-opacity));
  }
  .button {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
  }
  .button:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity));
    --tw-ring-offset-width: 2px;
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  .button {
    transition-duration: 0.15s;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter,
      -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition: all 0.1s ease-in;
  }
  .button[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(156, 163, 175, var(--tw-bg-opacity));
  }
  .dark .button[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
  .button-outline {
    --tw-border-opacity: 1;
    --tw-text-opacity: 1;
    background-color: transparent;
    border-color: rgba(79, 70, 229, var(--tw-border-opacity));
    border-width: 1px;
    color: rgba(79, 70, 229, var(--tw-text-opacity));
  }
  .button-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .button-md,
  .button-sm {
    padding: 0.5rem 1rem;
  }
  html {
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, var(--tw-text-opacity));
  }
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  button:disabled {
    cursor: default;
  }
  blockquote {
    --tw-border-opacity: 1;
    border-color: rgba(107, 114, 128, var(--tw-border-opacity));
    border-left-width: 4px;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
  }
  @media (min-width: 1280px) {
    .container {
      max-width: 70rem;
    }
  }
  .pricing-table {
    height: 920px;
  }
  @media (min-width: 768px) {
    .pricing-table {
      height: auto;
    }
  }
  .sr-only {
    clip: rect(0, 0, 0, 0);
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
  .invisible {
    visibility: hidden;
  }
  .static {
    position: static;
  }
  .fixed {
    position: fixed;
  }
  .absolute {
    position: absolute;
  }
  .relative {
    position: relative;
  }
  .sticky {
    position: sticky;
  }
  .inset-0 {
    left: 0;
    right: 0;
  }
  .inset-0,
  .inset-y-0 {
    bottom: 0;
    top: 0;
  }
  .top-0 {
    top: 0;
  }
  .-top-10 {
    top: -2.5rem;
  }
  .right-0 {
    right: 0;
  }
  .right-3 {
    right: 0.75rem;
  }
  .right-4 {
    right: 1rem;
  }
  .bottom-0 {
    bottom: 0;
  }
  .bottom-4 {
    bottom: 1rem;
  }
  .left-0 {
    left: 0;
  }
  .z-0 {
    z-index: 0;
  }
  .z-9 {
    z-index: 9;
  }
  .z-10 {
    z-index: 10;
  }
  .z-20 {
    z-index: 20;
  }
  .z-50 {
    z-index: 50;
  }
  .focus-within\:z-10:focus-within {
    z-index: 10;
  }
  .order-3 {
    order: 3;
  }
  .col-span-1 {
    grid-column: span 1 / span 1;
  }
  .col-span-4 {
    grid-column: span 4 / span 4;
  }
  .m-1 {
    margin: 0.25rem;
  }
  .m-2 {
    margin: 0.5rem;
  }
  .mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .my-1 {
    margin-bottom: 0.25rem;
    margin-top: 0.25rem;
  }
  .my-2 {
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
  .my-3 {
    margin-bottom: 0.75rem;
    margin-top: 0.75rem;
  }
  .my-4 {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
  .my-6 {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
  }
  .my-8 {
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  .my-12 {
    margin-bottom: 3rem;
    margin-top: 3rem;
  }
  .my-16 {
    margin-bottom: 4rem;
    margin-top: 4rem;
  }
  .my-32 {
    margin-bottom: 8rem;
    margin-top: 8rem;
  }
  .my-40 {
    margin-bottom: 10rem;
    margin-top: 10rem;
  }
  .my-44 {
    margin-bottom: 11rem;
    margin-top: 11rem;
  }
  .my-56 {
    margin-bottom: 14rem;
    margin-top: 14rem;
  }
  .-my-2 {
    margin-bottom: -0.5rem;
    margin-top: -0.5rem;
  }
  .-my-5 {
    margin-bottom: -1.25rem;
    margin-top: -1.25rem;
  }
  .mt-0 {
    margin-top: 0;
  }
  .mt-1 {
    margin-top: 0.25rem;
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .mt-3 {
    margin-top: 0.75rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .mt-6 {
    margin-top: 1.5rem;
  }
  .mt-8 {
    margin-top: 2rem;
  }
  .mt-10 {
    margin-top: 2.5rem;
  }
  .mt-12 {
    margin-top: 3rem;
  }
  .mt-16 {
    margin-top: 4rem;
  }
  .mt-20 {
    margin-top: 5rem;
  }
  .mt-24 {
    margin-top: 6rem;
  }
  .mt-32 {
    margin-top: 8rem;
  }
  .mt-36 {
    margin-top: 9rem;
  }
  .mt-44 {
    margin-top: 11rem;
  }
  .mt-px {
    margin-top: 1px;
  }
  .mt-0\.5 {
    margin-top: 0.125rem;
  }
  .-mt-1 {
    margin-top: -0.25rem;
  }
  .-mt-2 {
    margin-top: -0.5rem;
  }
  .-mt-px {
    margin-top: -1px;
  }
  .mr-1 {
    margin-right: 0.25rem;
  }
  .mr-2 {
    margin-right: 0.5rem;
  }
  .mr-3 {
    margin-right: 0.75rem;
  }
  .mr-4 {
    margin-right: 1rem;
  }
  .mr-6 {
    margin-right: 1.5rem;
  }
  .mr-auto {
    margin-right: auto;
  }
  .mr-px {
    margin-right: 1px;
  }
  .-mr-1 {
    margin-right: -0.25rem;
  }
  .-mr-2 {
    margin-right: -0.5rem;
  }
  .mb-0 {
    margin-bottom: 0;
  }
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  .mb-12 {
    margin-bottom: 3rem;
  }
  .mb-24 {
    margin-bottom: 6rem;
  }
  .ml-0 {
    margin-left: 0;
  }
  .ml-1 {
    margin-left: 0.25rem;
  }
  .ml-2 {
    margin-left: 0.5rem;
  }
  .ml-3 {
    margin-left: 0.75rem;
  }
  .ml-4 {
    margin-left: 1rem;
  }
  .ml-6 {
    margin-left: 1.5rem;
  }
  .ml-auto {
    margin-left: auto;
  }
  .ml-px {
    margin-left: 1px;
  }
  .-ml-1 {
    margin-left: -0.25rem;
  }
  .-ml-px {
    margin-left: -1px;
  }
  .block {
    display: block;
  }
  .inline-block {
    display: inline-block;
  }
  .inline {
    display: inline;
  }
  .flex {
    display: flex;
  }
  .inline-flex {
    display: inline-flex;
  }
  .table {
    display: table;
  }
  .table-cell {
    display: table-cell;
  }
  .flow-root {
    display: flow-root;
  }
  .grid {
    display: grid;
  }
  .contents {
    display: contents;
  }
  .hidden {
    display: none;
  }
  .group:hover .group-hover\:block {
    display: block;
  }
  .dark .dark\:inline {
    display: inline;
  }
  .dark .dark\:hidden {
    display: none;
  }
  .h-0 {
    height: 0;
  }
  .h-2 {
    height: 0.5rem;
  }
  .h-3 {
    height: 0.75rem;
  }
  .h-4 {
    height: 1rem;
  }
  .h-5 {
    height: 1.25rem;
  }
  .h-6 {
    height: 1.5rem;
  }
  .h-8 {
    height: 2rem;
  }
  .h-12 {
    height: 3rem;
  }
  .h-32 {
    height: 8rem;
  }
  .h-full {
    height: 100%;
  }
  .max-h-60 {
    max-height: 15rem;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .w-0 {
    width: 0;
  }
  .w-2 {
    width: 0.5rem;
  }
  .w-3 {
    width: 0.75rem;
  }
  .w-4 {
    width: 1rem;
  }
  .w-5 {
    width: 1.25rem;
  }
  .w-6 {
    width: 1.5rem;
  }
  .w-8 {
    width: 2rem;
  }
  .w-11 {
    width: 2.75rem;
  }
  .w-12 {
    width: 3rem;
  }
  .w-20 {
    width: 5rem;
  }
  .w-24 {
    width: 6rem;
  }
  .w-32 {
    width: 8rem;
  }
  .w-36 {
    width: 9rem;
  }
  .w-48 {
    width: 12rem;
  }
  .w-56 {
    width: 14rem;
  }
  .w-64 {
    width: 16rem;
  }
  .w-72 {
    width: 18rem;
  }
  .w-auto {
    width: auto;
  }
  .w-1\/2 {
    width: 50%;
  }
  .w-2\/3 {
    width: 66.666667%;
  }
  .w-full {
    width: 100%;
  }
  .w-max {
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
  }
  .w-content {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
  }
  .min-w-0 {
    min-width: 0;
  }
  .min-w-full {
    min-width: 100%;
  }
  .max-w-xs {
    max-width: 20rem;
  }
  .max-w-sm {
    max-width: 24rem;
  }
  .max-w-md {
    max-width: 28rem;
  }
  .max-w-lg {
    max-width: 32rem;
  }
  .max-w-xl {
    max-width: 36rem;
  }
  .max-w-2xl {
    max-width: 42rem;
  }
  .max-w-3xl {
    max-width: 48rem;
  }
  .max-w-4xl {
    max-width: 56rem;
  }
  .max-w-screen-lg {
    max-width: 1024px;
  }
  .max-w-2xs {
    max-width: 15rem;
  }
  .max-w-3xs {
    max-width: 12rem;
  }
  .flex-1 {
    flex: 1 1 0%;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .table-fixed {
    table-layout: fixed;
  }
  .border-collapse {
    border-collapse: collapse;
  }
  .origin-top-right {
    transform-origin: top right;
  }
  .origin-top-left {
    transform-origin: top left;
  }
  .transform {
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    transform: translateX(var(--tw-translate-x))
      translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
      skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
      scaleY(var(--tw-scale-y));
  }
  .translate-x-0 {
    --tw-translate-x: 0px;
  }
  .translate-x-5 {
    --tw-translate-x: 1.25rem;
  }
  .translate-y-0 {
    --tw-translate-y: 0px;
  }
  .translate-y-2 {
    --tw-translate-y: 0.5rem;
  }
  .translate-y-4 {
    --tw-translate-y: 1rem;
  }
  .scale-95 {
    --tw-scale-x: 0.95;
    --tw-scale-y: 0.95;
  }
  .scale-100 {
    --tw-scale-x: 1;
    --tw-scale-y: 1;
  }
  @-webkit-keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
  @-webkit-keyframes ping {
    75%,
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
  @keyframes ping {
    75%,
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
  @-webkit-keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  @-webkit-keyframes bounce {
    0%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      transform: translateY(-25%);
    }
    50% {
      -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transform: none;
    }
  }
  @keyframes bounce {
    0%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      transform: translateY(-25%);
    }
    50% {
      -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transform: none;
    }
  }
  .animate-spin {
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-pointer,
  .hover:\cursor-pointer:hover {
    cursor: pointer;
  }

  .cursor-pointer {
    cursor: pointer;
  }


  .cursor-pointer
  .select-none {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .resize-none {
    resize: none;
  }
  .resize {
    resize: both;
  }
  .list-disc {
    list-style-type: disc;
  }
  .appearance-none {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .content-center {
    align-content: center;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-center {
    align-items: center;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .gap-6 {
    gap: 1.5rem;
  }
  .gap-8 {
    gap: 2rem;
  }
  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(0.5rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  }
  .space-x-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(0.75rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  }
  .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-left: calc(1rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(1rem * var(--tw-space-x-reverse));
  }
  .space-y-1 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
    margin-top: calc(0.25rem * (1 - var(--tw-space-y-reverse)));
  }
  .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
    margin-top: calc(1.5rem * (1 - var(--tw-space-y-reverse)));
  }
  .-space-y-px > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(-1px * var(--tw-space-y-reverse));
    margin-top: calc(-1px * (1 - var(--tw-space-y-reverse)));
  }
  .divide-y > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-y-reverse: 0;
    border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
    border-top-width: calc(1px * (1 - var(--tw-divide-y-reverse)));
  }
  .divide-gray-200 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-divide-opacity));
  }
  .dark .dark\:divide-gray-400 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-divide-opacity));
  }
  .dark .dark\:divide-gray-900 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
    border-color: rgba(17, 24, 39, var(--tw-divide-opacity));
  }
  .self-start {
    align-self: flex-start;
  }
  .overflow-auto {
    overflow: auto;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .overflow-x-auto {
    overflow-x: auto;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .truncate,
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .break-all {
    word-break: break-all;
  }
  .rounded-none {
    border-radius: 0;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .rounded-t-none {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .rounded-r-none {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .rounded-r {
    border-bottom-right-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  .rounded-r-md {
    border-bottom-right-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }
  .rounded-l-none {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .rounded-l {
    border-bottom-left-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
  }
  .rounded-l-md {
    border-bottom-left-radius: 0.375rem;
  }
  .rounded-l-md,
  .rounded-tl-md {
    border-top-left-radius: 0.375rem;
  }
  .rounded-tr-md {
    border-top-right-radius: 0.375rem;
  }
  .rounded-br-md {
    border-bottom-right-radius: 0.375rem;
  }
  .rounded-bl-md {
    border-bottom-left-radius: 0.375rem;
  }
  .border-2 {
    border-width: 2px;
  }
  .border,
  .dark .dark\:border {
    border-width: 1px;
  }
  .border-t-2 {
    border-top-width: 2px;
  }
  .border-t {
    border-top-width: 1px;
  }
  .border-r-0 {
    border-right-width: 0;
  }
  .border-r {
    border-right-width: 1px;
  }
  .border-b {
    border-bottom-width: 1px;
  }
  .dark .dark\:border-t {
    border-top-width: 1px;
  }
  .dark .dark\:border-r {
    border-right-width: 1px;
  }
  .dark .dark\:border-l {
    border-left-width: 1px;
  }
  .border-none {
    border-style: none;
  }
  .border-transparent {
    border-color: transparent;
  }
  .border-gray-100 {
    --tw-border-opacity: 1;
    border-color: rgba(243, 244, 246, var(--tw-border-opacity));
  }
  .border-gray-200 {
    --tw-border-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  }
  .border-gray-300 {
    --tw-border-opacity: 1;
    border-color: rgba(209, 213, 219, var(--tw-border-opacity));
  }
  .border-gray-400 {
    --tw-border-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-border-opacity));
  }
  .border-red-600 {
    --tw-border-opacity: 1;
    border-color: rgba(220, 38, 38, var(--tw-border-opacity));
  }
  .border-yellow-200 {
    --tw-border-opacity: 1;
    border-color: rgba(253, 230, 138, var(--tw-border-opacity));
  }
  .border-green-300 {
    --tw-border-opacity: 1;
    border-color: rgba(110, 231, 183, var(--tw-border-opacity));
  }
  .border-green-500 {
    --tw-border-opacity: 1;
    border-color: rgba(16, 185, 129, var(--tw-border-opacity));
  }
  .border-blue-200 {
    --tw-border-opacity: 1;
    border-color: rgba(191, 219, 254, var(--tw-border-opacity));
  }
  .border-indigo-100 {
    --tw-border-opacity: 1;
    border-color: rgba(224, 231, 255, var(--tw-border-opacity));
  }
  .border-indigo-200 {
    --tw-border-opacity: 1;
    border-color: rgba(199, 210, 254, var(--tw-border-opacity));
  }
  .border-indigo-600 {
    --tw-border-opacity: 1;
    border-color: rgba(79, 70, 229, var(--tw-border-opacity));
  }
  .border-indigo-700 {
    --tw-border-opacity: 1;
    border-color: rgba(67, 56, 202, var(--tw-border-opacity));
  }
  .border-orange-200 {
    --tw-border-opacity: 1;
    border-color: rgba(254, 215, 170, var(--tw-border-opacity));
  }
  .hover\:border-gray-400:hover {
    --tw-border-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-border-opacity));
  }
  .focus\:border-gray-300:focus {
    --tw-border-opacity: 1;
    border-color: rgba(209, 213, 219, var(--tw-border-opacity));
  }
  .focus\:border-gray-400:focus {
    --tw-border-opacity: 1;
    border-color: rgba(156, 163, 175, var(--tw-border-opacity));
  }
  .focus\:border-red-300:focus {
    --tw-border-opacity: 1;
    border-color: rgba(252, 165, 165, var(--tw-border-opacity));
  }
  .focus\:border-blue-300:focus {
    --tw-border-opacity: 1;
    border-color: rgba(147, 197, 253, var(--tw-border-opacity));
  }
  .focus\:border-indigo-500:focus {
    --tw-border-opacity: 1;
    border-color: rgba(99, 102, 241, var(--tw-border-opacity));
  }
  .focus\:border-indigo-700:focus {
    --tw-border-opacity: 1;
    border-color: rgba(67, 56, 202, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-500 {
    --tw-border-opacity: 1;
    border-color: rgba(107, 114, 128, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-700 {
    --tw-border-opacity: 1;
    border-color: rgba(55, 65, 81, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-900 {
    --tw-border-opacity: 1;
    border-color: rgba(17, 24, 39, var(--tw-border-opacity));
  }
  .dark .dark\:border-indigo-500 {
    --tw-border-opacity: 1;
    border-color: rgba(99, 102, 241, var(--tw-border-opacity));
  }
  .dark .dark\:border-indigo-800 {
    --tw-border-opacity: 1;
    border-color: rgba(55, 48, 163, var(--tw-border-opacity));
  }
  .dark .dark\:border-orange-200 {
    --tw-border-opacity: 1;
    border-color: rgba(254, 215, 170, var(--tw-border-opacity));
  }
  .dark .dark\:border-gray-850 {
    --tw-border-opacity: 1;
    border-color: rgba(26, 32, 44, var(--tw-border-opacity));
  }
  .dark .dark\:hover\:border-gray-200:hover {
    --tw-border-opacity: 1;
    border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  }
  .dark .dark\:focus\:border-gray-500:focus {
    --tw-border-opacity: 1;
    border-color: rgba(107, 114, 128, var(--tw-border-opacity));
  }
  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .bg-gray-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  }
  .bg-gray-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .bg-gray-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
  .bg-gray-300 {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
  .bg-gray-400 {
    --tw-bg-opacity: 1;
    background-color: rgba(156, 163, 175, var(--tw-bg-opacity));
  }
  .bg-gray-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
  }
  .bg-gray-700 {
    --tw-bg-opacity: 1;
    background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
  }
  .bg-gray-800 {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .bg-red-40 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 247, 247, var(--tw-bg-opacity));
  }
  .bg-red-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }
  .bg-red-60 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 232, 232, var(--tw-bg-opacity));
  }
  .bg-red-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 226, 226, var(--tw-bg-opacity));
  }
  .bg-red-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
  }
  .bg-yellow-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 251, 235, var(--tw-bg-opacity));
  }
  .bg-yellow-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 243, 199, var(--tw-bg-opacity));
  }
  .bg-green-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(236, 253, 245, var(--tw-bg-opacity));
  }
  .bg-green-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 250, 229, var(--tw-bg-opacity));
  }
  .bg-green-300 {
    --tw-bg-opacity: 1;
    background-color: rgba(110, 231, 183, var(--tw-bg-opacity));
  }
  .bg-blue-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(239, 246, 255, var(--tw-bg-opacity));
  }
  .bg-blue-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(191, 219, 254, var(--tw-bg-opacity));
  }
  .bg-indigo-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(238, 242, 255, var(--tw-bg-opacity));
  }
  .bg-indigo-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(199, 210, 254, var(--tw-bg-opacity));
  }
  .bg-indigo-600 {
    --tw-bg-opacity: 1;
    background-color: rgba(79, 70, 229, var(--tw-bg-opacity));
  }
  .bg-orange-50 {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 247, 237, var(--tw-bg-opacity));
  }
  .odd\:bg-white:nth-child(odd) {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .even\:bg-gray-50:nth-child(2n),
  .hover\:bg-gray-50:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-100:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-200:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-300:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-600:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
  .hover\:bg-gray-900:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .hover\:bg-red-50:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 242, 242, var(--tw-bg-opacity));
  }
  .hover\:bg-red-600:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(220, 38, 38, var(--tw-bg-opacity));
  }
  .hover\:bg-indigo-500:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(99, 102, 241, var(--tw-bg-opacity));
  }
  .hover\:bg-indigo-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(67, 56, 202, var(--tw-bg-opacity));
  }
  .focus\:bg-white:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }
  .focus\:bg-gray-50:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
  }
  .focus\:bg-gray-100:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .focus\:bg-gray-200:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-transparent {
    background-color: transparent;
  }
  .dark .dark\:bg-gray-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-600 {
    --tw-bg-opacity: 1;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-700 {
    --tw-bg-opacity: 1;
    background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-800 {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-900 {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-red-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 202, 202, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-red-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-yellow-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 243, 199, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-indigo-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(224, 231, 255, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-indigo-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(99, 102, 241, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-950 {
    --tw-bg-opacity: 1;
    background-color: rgba(13, 18, 30, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-850 {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .dark .dark\:bg-gray-825 {
    --tw-bg-opacity: 1;
    background-color: rgba(37, 47, 63, var(--tw-bg-opacity));
  }
  .dark .dark\:odd\:bg-gray-850:nth-child(odd) {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .dark .dark\:even\:bg-gray-825:nth-child(2n) {
    --tw-bg-opacity: 1;
    background-color: rgba(37, 47, 63, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-800:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-900:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-red-300:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(252, 165, 165, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-red-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(185, 28, 28, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-850:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .dark .dark\:hover\:bg-gray-825:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(37, 47, 63, var(--tw-bg-opacity));
  }
  .dark .dark\:focus\:bg-gray-800:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
  }
  .dark .dark\:focus\:bg-gray-900:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
  }
  .bg-opacity-20 {
    --tw-bg-opacity: 0.2;
  }
  .bg-opacity-75 {
    --tw-bg-opacity: 0.75;
  }
  .dark .dark\:bg-opacity-15 {
    --tw-bg-opacity: 0.15;
  }
  .dark .dark\:bg-opacity-75 {
    --tw-bg-opacity: 0.75;
  }
  .fill-current {
    fill: currentColor;
  }
  .p-1 {
    padding: 0.25rem;
  }
  .p-2 {
    padding: 0.5rem;
  }
  .p-4 {
    padding: 1rem;
  }
  .p-8 {
    padding: 2rem;
  }
  .px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .px-5 {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
  .px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .px-2\.5 {
    padding-left: 0.625rem;
    padding-right: 0.625rem;
  }
  .py-0 {
    padding-bottom: 0;
    padding-top: 0;
  }
  .py-1 {
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
  }
  .py-2 {
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
  }
  .py-3 {
    padding-bottom: 0.75rem;
    padding-top: 0.75rem;
  }
  .py-4 {
    padding-bottom: 1rem;
    padding-top: 1rem;
  }
  .py-5 {
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
  }
  .py-6 {
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
  }
  .py-8 {
    padding-bottom: 2rem;
    padding-top: 2rem;
  }
  .py-12 {
    padding-bottom: 3rem;
    padding-top: 3rem;
  }
  .py-0\.5 {
    padding-bottom: 0.125rem;
    padding-top: 0.125rem;
  }
  .py-1\.5 {
    padding-bottom: 0.375rem;
    padding-top: 0.375rem;
  }
  .pt-0 {
    padding-top: 0;
  }
  .pt-2 {
    padding-top: 0.5rem;
  }
  .pt-4 {
    padding-top: 1rem;
  }
  .pt-5 {
    padding-top: 1.25rem;
  }
  .pt-6 {
    padding-top: 1.5rem;
  }
  .pt-8 {
    padding-top: 2rem;
  }
  .pt-12 {
    padding-top: 3rem;
  }
  .pt-14 {
    padding-top: 3.5rem;
  }
  .pt-16 {
    padding-top: 4rem;
  }
  .pt-32 {
    padding-top: 8rem;
  }
  .pt-52 {
    padding-top: 13rem;
  }
  .pt-px {
    padding-top: 1px;
  }
  .pt-0\.5 {
    padding-top: 0.125rem;
  }
  .pr-1 {
    padding-right: 0.25rem;
  }
  .pr-2 {
    padding-right: 0.5rem;
  }
  .pr-4 {
    padding-right: 1rem;
  }
  .pr-6 {
    padding-right: 1.5rem;
  }
  .pr-9 {
    padding-right: 2.25rem;
  }
  .pr-10 {
    padding-right: 2.5rem;
  }
  .pr-16 {
    padding-right: 4rem;
  }
  .pb-1 {
    padding-bottom: 0.25rem;
  }
  .pb-4 {
    padding-bottom: 1rem;
  }
  .pb-5 {
    padding-bottom: 1.25rem;
  }
  .pb-8 {
    padding-bottom: 2rem;
  }
  .pb-20 {
    padding-bottom: 5rem;
  }
  .pl-1 {
    padding-left: 0.25rem;
  }
  .pl-2 {
    padding-left: 0.5rem;
  }
  .pl-3 {
    padding-left: 0.75rem;
  }
  .pl-8 {
    padding-left: 2rem;
  }
  .pl-10 {
    padding-left: 2.5rem;
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .align-middle {
    vertical-align: middle;
  }
  .align-bottom {
    vertical-align: bottom;
  }
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .text-lg {
    font-size: 1.125rem;
  }
  .text-lg,
  .text-xl {
    line-height: 1.75rem;
  }
  .text-xl {
    font-size: 1.25rem;
  }
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .text-5xl {
    font-size: 3rem;
    line-height: 1;
  }
  .font-normal {
    font-weight: 400;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-bold {
    font-weight: 700;
  }
  .font-extrabold {
    font-weight: 800;
  }
  .font-black {
    font-weight: 900;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .capitalize {
    text-transform: capitalize;
  }
  .italic {
    font-style: italic;
  }
  .leading-4 {
    line-height: 1rem;
  }
  .leading-5 {
    line-height: 1.25rem;
  }
  .leading-6 {
    line-height: 1.5rem;
  }
  .leading-7 {
    line-height: 1.75rem;
  }
  .leading-9 {
    line-height: 2.25rem;
  }
  .leading-none {
    line-height: 1;
  }
  .leading-tight {
    line-height: 1.25;
  }
  .leading-snug {
    line-height: 1.375;
  }
  .leading-normal {
    line-height: 1.5;
  }
  .tracking-tight {
    letter-spacing: -0.025em;
  }
  .tracking-wide {
    letter-spacing: 0.025em;
  }
  .tracking-wider {
    letter-spacing: 0.05em;
  }
  .tracking-widest {
    letter-spacing: 0.1em;
  }
  .text-black {
    --tw-text-opacity: 1;
    color: rgba(0, 0, 0, var(--tw-text-opacity));
  }
  .text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .text-gray-50 {
    --tw-text-opacity: 1;
    color: rgba(249, 250, 251, var(--tw-text-opacity));
  }
  .text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .text-gray-300 {
    --tw-text-opacity: 1;
    color: rgba(209, 213, 219, var(--tw-text-opacity));
  }
  .text-gray-400 {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .text-gray-500 {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .text-gray-600 {
    --tw-text-opacity: 1;
    color: rgba(75, 85, 99, var(--tw-text-opacity));
  }
  .text-gray-700 {
    --tw-text-opacity: 1;
    color: rgba(55, 65, 81, var(--tw-text-opacity));
  }
  .text-gray-800 {
    --tw-text-opacity: 1;
    color: rgba(31, 41, 55, var(--tw-text-opacity));
  }
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
  }
  .text-red-400 {
    --tw-text-opacity: 1;
    color: rgba(248, 113, 113, var(--tw-text-opacity));
  }
  .text-red-500 {
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .text-red-600 {
    --tw-text-opacity: 1;
    color: rgba(220, 38, 38, var(--tw-text-opacity));
  }
  .text-red-700 {
    --tw-text-opacity: 1;
    color: rgba(185, 28, 28, var(--tw-text-opacity));
  }
  .text-red-800 {
    --tw-text-opacity: 1;
    color: rgba(153, 27, 27, var(--tw-text-opacity));
  }
  .text-yellow-400 {
    --tw-text-opacity: 1;
    color: rgba(251, 191, 36, var(--tw-text-opacity));
  }
  .text-yellow-500 {
    --tw-text-opacity: 1;
    color: rgba(245, 158, 11, var(--tw-text-opacity));
  }
  .text-yellow-700 {
    --tw-text-opacity: 1;
    color: rgba(180, 83, 9, var(--tw-text-opacity));
  }
  .text-yellow-800 {
    --tw-text-opacity: 1;
    color: rgba(146, 64, 14, var(--tw-text-opacity));
  }
  .text-yellow-900 {
    --tw-text-opacity: 1;
    color: rgba(120, 53, 15, var(--tw-text-opacity));
  }
  .text-green-400 {
    --tw-text-opacity: 1;
    color: rgba(52, 211, 153, var(--tw-text-opacity));
  }
  .text-green-500 {
    --tw-text-opacity: 1;
    color: rgba(16, 185, 129, var(--tw-text-opacity));
  }
  .text-green-600 {
    --tw-text-opacity: 1;
    color: rgba(5, 150, 105, var(--tw-text-opacity));
  }
  .text-green-800 {
    --tw-text-opacity: 1;
    color: rgba(6, 95, 70, var(--tw-text-opacity));
  }
  .text-blue-500 {
    --tw-text-opacity: 1;
    color: rgba(59, 130, 246, var(--tw-text-opacity));
  }
  .text-blue-700 {
    --tw-text-opacity: 1;
    color: rgba(29, 78, 216, var(--tw-text-opacity));
  }
  .text-blue-900 {
    --tw-text-opacity: 1;
    color: rgba(30, 58, 138, var(--tw-text-opacity));
  }
  .text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .text-indigo-600 {
    --tw-text-opacity: 1;
    color: rgba(79, 70, 229, var(--tw-text-opacity));
  }
  .text-indigo-700 {
    --tw-text-opacity: 1;
    color: rgba(67, 56, 202, var(--tw-text-opacity));
  }
  .text-indigo-800 {
    --tw-text-opacity: 1;
    color: rgba(55, 48, 163, var(--tw-text-opacity));
  }
  .text-indigo-900 {
    --tw-text-opacity: 1;
    color: rgba(49, 46, 129, var(--tw-text-opacity));
  }
  .text-pink-500 {
    --tw-text-opacity: 1;
    color: rgba(236, 72, 153, var(--tw-text-opacity));
  }
  .text-pink-600 {
    --tw-text-opacity: 1;
    color: rgba(219, 39, 119, var(--tw-text-opacity));
  }
  .text-orange-600 {
    --tw-text-opacity: 1;
    color: rgba(234, 88, 12, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-gray-600 {
    --tw-text-opacity: 1;
    color: rgba(75, 85, 99, var(--tw-text-opacity));
  }
  .group:hover .group-hover\:text-indigo-700 {
    --tw-text-opacity: 1;
    color: rgba(67, 56, 202, var(--tw-text-opacity));
  }
  .hover\:text-white:hover {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .hover\:text-gray-500:hover {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .hover\:text-gray-900:hover {
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
  }
  .hover\:text-red-500:hover {
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .hover\:text-red-900:hover {
    --tw-text-opacity: 1;
    color: rgba(127, 29, 29, var(--tw-text-opacity));
  }
  .hover\:text-indigo-500:hover {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .hover\:text-indigo-600:hover {
    --tw-text-opacity: 1;
    color: rgba(79, 70, 229, var(--tw-text-opacity));
  }
  .hover\:text-indigo-700:hover {
    --tw-text-opacity: 1;
    color: rgba(67, 56, 202, var(--tw-text-opacity));
  }
  .hover\:text-indigo-900:hover {
    --tw-text-opacity: 1;
    color: rgba(49, 46, 129, var(--tw-text-opacity));
  }
  .focus\:text-gray-500:focus {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .focus\:text-gray-900:focus {
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
  }
  .dark .dark\:text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-50 {
    --tw-text-opacity: 1;
    color: rgba(249, 250, 251, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-100 {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-200 {
    --tw-text-opacity: 1;
    color: rgba(229, 231, 235, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-300 {
    --tw-text-opacity: 1;
    color: rgba(209, 213, 219, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-400 {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .dark .dark\:text-gray-500 {
    --tw-text-opacity: 1;
    color: rgba(107, 114, 128, var(--tw-text-opacity));
  }
  .dark .dark\:text-red-500 {
    --tw-text-opacity: 1;
    color: rgba(239, 68, 68, var(--tw-text-opacity));
  }
  .dark .dark\:text-red-800 {
    --tw-text-opacity: 1;
    color: rgba(153, 27, 27, var(--tw-text-opacity));
  }
  .dark .dark\:text-yellow-300 {
    --tw-text-opacity: 1;
    color: rgba(252, 211, 77, var(--tw-text-opacity));
  }
  .dark .dark\:text-yellow-400 {
    --tw-text-opacity: 1;
    color: rgba(251, 191, 36, var(--tw-text-opacity));
  }
  .dark .dark\:text-yellow-900 {
    --tw-text-opacity: 1;
    color: rgba(120, 53, 15, var(--tw-text-opacity));
  }
  .dark .dark\:text-blue-300 {
    --tw-text-opacity: 1;
    color: rgba(147, 197, 253, var(--tw-text-opacity));
  }
  .dark .dark\:text-indigo-400 {
    --tw-text-opacity: 1;
    color: rgba(129, 140, 248, var(--tw-text-opacity));
  }
  .dark .dark\:text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .dark .group:hover .dark\:group-hover\:text-white {
    --tw-text-opacity: 1;
    color: rgba(255, 255, 255, var(--tw-text-opacity));
  }
  .dark .group:hover .dark\:group-hover\:text-gray-400 {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .dark .group:hover .dark\:group-hover\:text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-gray-100:hover {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-gray-200:hover {
    --tw-text-opacity: 1;
    color: rgba(229, 231, 235, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-gray-400:hover {
    --tw-text-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-red-400:hover {
    --tw-text-opacity: 1;
    color: rgba(248, 113, 113, var(--tw-text-opacity));
  }
  .dark .dark\:hover\:text-indigo-500:hover {
    --tw-text-opacity: 1;
    color: rgba(99, 102, 241, var(--tw-text-opacity));
  }
  .dark .dark\:focus\:text-gray-100:focus {
    --tw-text-opacity: 1;
    color: rgba(243, 244, 246, var(--tw-text-opacity));
  }
  .dark .dark\:focus\:text-gray-200:focus {
    --tw-text-opacity: 1;
    color: rgba(229, 231, 235, var(--tw-text-opacity));
  }
  .underline {
    text-decoration: underline;
  }
  .line-through {
    text-decoration: line-through;
  }
  .no-underline {
    text-decoration: none;
  }
  .hover\:underline:hover {
    text-decoration: underline;
  }
  .dark .dark\:placeholder-gray-400::-moz-placeholder {
    --tw-placeholder-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
  }
  .dark .dark\:placeholder-gray-400:-ms-input-placeholder {
    --tw-placeholder-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
  }
  .dark .dark\:placeholder-gray-400::placeholder {
    --tw-placeholder-opacity: 1;
    color: rgba(156, 163, 175, var(--tw-placeholder-opacity));
  }
  .opacity-0 {
    opacity: 0;
  }
  .opacity-25 {
    opacity: 0.25;
  }
  .opacity-75 {
    opacity: 0.75;
  }
  .opacity-100 {
    opacity: 1;
  }
  *,
  :after,
  :before {
    --tw-shadow: 0 0 #0000;
  }
  .shadow-sm {
    --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .shadow,
  .shadow-sm {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .shadow {
    --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  .shadow-md {
    --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .shadow-lg,
  .shadow-md {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .shadow-xl {
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .shadow-inner,
  .shadow-xl {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .shadow-inner {
    --tw-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  }
  .group:hover .group-hover\:shadow-lg {
    --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .group:hover .group-hover\:shadow-lg,
  .hover\:shadow-none:hover {
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .hover\:shadow-none:hover {
    --tw-shadow: 0 0 #0000;
  }
  .focus\:outline-none:focus,
  .outline-none {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  *,
  :after,
  :before {
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
  }
  .focus\:ring-1:focus,
  .ring-1 {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  }
  .focus\:ring-1:focus,
  .focus\:ring-2:focus,
  .ring-1 {
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }
  .focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  }
  .focus\:ring:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }
  .ring-black {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(0, 0, 0, var(--tw-ring-opacity));
  }
  .focus\:ring-gray-200:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(229, 231, 235, var(--tw-ring-opacity));
  }
  .focus\:ring-gray-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(107, 114, 128, var(--tw-ring-opacity));
  }
  .focus\:ring-indigo-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity));
  }
  .focus\:ring-indigo-700:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgba(67, 56, 202, var(--tw-ring-opacity));
  }
  .ring-opacity-5 {
    --tw-ring-opacity: 0.05;
  }
  .focus\:ring-offset-1:focus {
    --tw-ring-offset-width: 1px;
  }
  .focus\:ring-offset-2:focus {
    --tw-ring-offset-width: 2px;
  }
  .focus\:ring-offset-gray-100:focus {
    --tw-ring-offset-color: #f3f4f6;
  }
  .dark .dark\:focus\:ring-offset-gray-900:focus {
    --tw-ring-offset-color: #111827;
  }
  .filter {
    --tw-blur: var(--tw-empty, /*!*/ /*!*/);
    --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
    --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
    --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
    --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
    --tw-invert: var(--tw-empty, /*!*/ /*!*/);
    --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
    --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
    --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
      var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert)
      var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .transition-all {
    transition-duration: 0.15s;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition {
    transition-duration: 0.15s;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter,
      -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-colors {
    transition-duration: 0.15s;
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-opacity {
    transition-duration: 0.15s;
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-padding {
    transition-duration: 0.15s;
    transition-property: padding;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .duration-75 {
    transition-duration: 75ms;
  }
  .duration-100 {
    transition-duration: 0.1s;
  }
  .duration-150 {
    transition-duration: 0.15s;
  }
  .duration-200 {
    transition-duration: 0.2s;
  }
  .duration-300 {
    transition-duration: 0.3s;
  }
  .ease-in {
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }
  .ease-out {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  .ease-in-out {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .main-graph {
    height: 0;
    padding-top: calc(148px + 41.45221%);
    position: relative;
  }
  @media (min-width: 640px) {
    .main-graph {
      padding-top: calc(148px + 41.45221%);
    }
  }
  @media (min-width: 768px) {
    .main-graph {
      padding-top: calc(128px + 41.45221%);
    }
  }
  @media (min-width: 1024px) {
    .main-graph {
      padding-top: calc(18px + 41.45221%);
    }
  }
  .top-stats-only {
    height: 0;
    padding-top: 173px;
    position: relative;
  }
  @media (min-width: 640px) {
    .top-stats-only {
      padding-top: 170px;
    }
  }
  @media (min-width: 768px) {
    .top-stats-only {
      padding-top: 183px;
    }
  }
  @media (min-width: 1024px) {
    .top-stats-only {
      padding-top: 90px;
    }
  }

  .graph-inner {
    height: auto;
    left: 0;
    position: absolute;
    top: 0;
    //width: 100%; //TODO: Check this
  }

  .light-text {
    color: #f0f4f8;
  }
  .transition {
    transition: all 0.1s ease-in;
  }
  .pulsating-circle {
    height: 10px;
    position: absolute;
    width: 10px;
    margin-top: 44px;
    margin-left: 127px;
  }
  .pulsating-circle:before {
    --tw-bg-opacity: 1;
    -webkit-animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1)
      infinite;
    animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    background-color: #9ae6b4;
    background-color: rgba(16, 185, 129, var(--tw-bg-opacity));
    border-radius: 45px;
    box-sizing: border-box;
    content: '';
    display: block;
    height: 300%;
    margin-left: -100%;
    margin-top: -100%;
    position: relative;
    width: 300%;
  }
  .pulsating-circle:after {
    --tw-bg-opacity: 1;
    -webkit-animation: pulse-dot 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s
      infinite;
    animation: pulse-dot 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    background-color: #fff;
    background-color: rgba(16, 185, 129, var(--tw-bg-opacity));
    border-radius: 15px;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  @-webkit-keyframes pulse-ring {
    0% {
      transform: scale(0.33);
    }
    50% {
      transform: scale(1);
    }
    40%,
    to {
      opacity: 0;
    }
  }
  @keyframes pulse-ring {
    0% {
      transform: scale(0.33);
    }
    50% {
      transform: scale(1);
    }
    40%,
    to {
      opacity: 0;
    }
  }
  @-webkit-keyframes pulse-dot {
    0% {
      transform: scale(0.8);
    }
    25% {
      transform: scale(1);
    }
    50%,
    to {
      transform: scale(0.8);
    }
  }
  @keyframes pulse-dot {
    0% {
      transform: scale(0.8);
    }
    25% {
      transform: scale(1);
    }
    50%,
    to {
      transform: scale(0.8);
    }
  }
  .just-text h1,
  .just-text h2,
  .just-text h3 {
    margin-bottom: 0.5em;
    margin-top: 1em;
  }
  .just-text p {
    margin-bottom: 1rem;
    margin-top: 0;
  }
  .dropdown-content:before {
    border: 8px solid transparent;
    border-bottom-color: rgba(27, 31, 35, 0.15);
    left: auto;
    right: 8px;
    top: -16px;
  }
  .dropdown-content:after,
  .dropdown-content:before {
    content: '';
    display: inline-block;
    position: absolute;
  }
  .dropdown-content:after {
    border: 7px solid transparent;
    border-bottom-color: #fff;
    left: auto;
    right: 9px;
    top: -14px;
  }
  .feather,
  .feather-sm {
    display: inline;
    height: 1em;
    overflow: visible;
    width: 1em;
  }
  .table-striped tbody tr:nth-child(odd) {
    background-color: #f1f5f8;
  }
  .dark .table-striped tbody tr:nth-child(odd) {
    background-color: #252f3f;
  }
  .dark .table-striped tbody tr:nth-child(2n) {
    background-color: #1a202c;
  }
  .stats-item {
    min-height: 436px;
    min-width: 545px;
  }
  @media (min-width: 768px) {
    .stats-item {
      height: 27.25rem;
      margin-left: 6px;
      margin-right: 6px;
      min-height: auto;
      position: relative;
      width: calc(50% - 6px);
    }
    .stats-item-header {
      height: inherit;
    }
  }

  @media (max-width: 768px) {
    .stats-item {
      min-width: calc(100vw - 32px);
    }
  }

  .stats-item:first-child {
    margin-left: 0;
  }
  .stats-item:last-child {
    margin-right: 0;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 0.1s ease-in;
  }
  .flatpickr-calendar.static.open {
    right: 2px;
    top: 12px;
  }
  .datamaps-subunit {
    cursor: pointer;
  }
  .dark .hoverinfo {
    box-shadow: 1px 1px 5px #1a202c;
  }
  .fullwidth-shadow:before {
    --tw-bg-opacity: 1;
    background-color: rgba(249, 250, 251, var(--tw-bg-opacity));
    height: 100%;
    position: absolute;
    top: 0;
    width: 100vw;
  }
  .dark .fullwidth-shadow:before {
    --tw-bg-opacity: 1;
    background-color: rgba(26, 32, 44, var(--tw-bg-opacity));
  }
  .fullwidth-shadow:before {
    background-color: inherit;
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.06);
    content: '';
    left: calc(-50vw - -50%);
    z-index: -1;
  }
  .dark .fullwidth-shadow:before {
    box-shadow: 0 4px 2px -2px hsla(0, 0%, 78%, 0.1);
  }
  iframe[hidden] {
    display: none;
  }
  .pagination-link[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
    cursor: default;
    pointer-events: none;
  }
  .dark .pagination-link[disabled] {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  }
  @media (max-width: 768px) {
    .flatpickr-wrapper {
      left: 0 !important;
      position: absolute !important;
      right: 0 !important;
    }
  }
  #chartjs-tooltip {
    background-color: #191e38;
    border-radius: 5px;
    font-size: 14px;
    font-style: normal;
    padding: 10px 12px;
    pointer-events: none;
    position: absolute;
    z-index: 100;
  }
  .active-prop-heading {
    -webkit-text-decoration-color: #4338ca;
    text-decoration-color: #4338ca;
    -webkit-text-decoration-line: underline;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
  }
  @media (prefers-color-scheme: dark) {
    .active-prop-heading {
      -webkit-text-decoration-color: #6366f1;
      text-decoration-color: #6366f1;
    }
  }
  @media (min-width: 640px) {
    .sm\:order-2 {
      order: 2;
    }
    .sm\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .sm\:mx-0 {
      margin-left: 0;
      margin-right: 0;
    }
    .sm\:-mx-6 {
      margin-left: -1.5rem;
      margin-right: -1.5rem;
    }
    .sm\:my-0 {
      margin-bottom: 0;
      margin-top: 0;
    }
    .sm\:my-8 {
      margin-bottom: 2rem;
      margin-top: 2rem;
    }
    .sm\:mt-0 {
      margin-top: 0;
    }
    .sm\:mr-4 {
      margin-right: 1rem;
    }
    .sm\:mb-0 {
      margin-bottom: 0;
    }
    .sm\:ml-3 {
      margin-left: 0.75rem;
    }
    .sm\:ml-4 {
      margin-left: 1rem;
    }
    .sm\:block {
      display: block;
    }
    .sm\:inline-block {
      display: inline-block;
    }
    .sm\:flex {
      display: flex;
    }
    .sm\:hidden {
      display: none;
    }
    .sm\:h-10 {
      height: 2.5rem;
    }
    .sm\:h-screen {
      height: 100vh;
    }
    .sm\:w-10 {
      width: 2.5rem;
    }
    .sm\:w-36 {
      width: 9rem;
    }
    .sm\:w-auto {
      width: auto;
    }
    .sm\:w-full {
      width: 100%;
    }
    .sm\:max-w-xs {
      max-width: 20rem;
    }
    .sm\:max-w-lg {
      max-width: 32rem;
    }
    .sm\:translate-x-0 {
      --tw-translate-x: 0px;
    }
    .sm\:translate-x-2 {
      --tw-translate-x: 0.5rem;
    }
    .sm\:translate-y-0 {
      --tw-translate-y: 0px;
    }
    .sm\:scale-95 {
      --tw-scale-x: 0.95;
      --tw-scale-y: 0.95;
    }
    .sm\:scale-100 {
      --tw-scale-x: 1;
      --tw-scale-y: 1;
    }
    .sm\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .sm\:flex-row {
      flex-direction: row;
    }
    .sm\:flex-row-reverse {
      flex-direction: row-reverse;
    }
    .sm\:items-start {
      align-items: flex-start;
    }
    .sm\:justify-end {
      justify-content: flex-end;
    }
    .sm\:self-auto {
      align-self: auto;
    }
    .sm\:overflow-hidden,
    .sm\:truncate {
      overflow: hidden;
    }
    .sm\:truncate {
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sm\:rounded-md {
      border-radius: 0.375rem;
    }
    .sm\:rounded-lg {
      border-radius: 0.5rem;
    }
    .sm\:p-0 {
      padding: 0;
    }
    .sm\:p-3 {
      padding: 0.75rem;
    }
    .sm\:p-6 {
      padding: 1.5rem;
    }
    .sm\:px-2 {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .sm\:px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .sm\:px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .sm\:py-2 {
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
    }
    .sm\:py-3 {
      padding-bottom: 0.75rem;
      padding-top: 0.75rem;
    }
    .sm\:py-6 {
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
    }
    .sm\:pt-14 {
      padding-top: 3.5rem;
    }
    .sm\:pt-36 {
      padding-top: 9rem;
    }
    .sm\:pt-56 {
      padding-top: 14rem;
    }
    .sm\:pb-4 {
      padding-bottom: 1rem;
    }
    .sm\:pl-2 {
      padding-left: 0.5rem;
    }
    .sm\:pl-6 {
      padding-left: 1.5rem;
    }
    .sm\:text-left {
      text-align: left;
    }
    .sm\:align-middle {
      vertical-align: middle;
    }
    .sm\:text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .sm\:text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .sm\:text-4xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    .sm\:leading-5 {
      line-height: 1.25rem;
    }
    .sm\:leading-9 {
      line-height: 2.25rem;
    }
    .sm\:leading-10 {
      line-height: 2.5rem;
    }
  }
  @media (min-width: 768px) {
    .md\:absolute {
      position: absolute;
    }
    .md\:relative {
      position: relative;
    }
    .md\:inset-y-0 {
      bottom: 0;
      top: 0;
    }
    .md\:top-auto {
      top: auto;
    }
    .md\:right-0 {
      right: 0;
    }
    .md\:bottom-0 {
      bottom: 0;
    }
    .md\:left-0 {
      left: 0;
    }
    .md\:left-auto {
      left: auto;
    }
    .md\:mt-0 {
      margin-top: 0;
    }
    .md\:mr-2 {
      margin-right: 0.5rem;
    }
    .md\:ml-2 {
      margin-left: 0.5rem;
    }
    .md\:block {
      display: block;
    }
    .md\:flex {
      display: flex;
    }

    .md\:grid {
      display: grid;
    }
    .md\:h-4 {
      height: 1rem;
    }
    .md\:h-5 {
      height: 1.25rem;
    }
    .md\:w-4 {
      width: 1rem;
    }
    .md\:w-5 {
      width: 1.25rem;
    }
    .md\:w-48 {
      width: 12rem;
    }
    .md\:w-56 {
      width: 14rem;
    }
    .md\:w-72 {
      width: 18rem;
    }
    .md\:w-full {
      width: 100%;
    }
    .md\:max-w-xs {
      max-width: 20rem;
    }
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .md\:flex-row {
      flex-direction: row;
    }
    .md\:justify-center {
      justify-content: center;
    }
    .md\:gap-8 {
      gap: 2rem;
    }
    .md\:truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .md\:px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    .md\:px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .md\:px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .md\:pt-0 {
      padding-top: 0;
    }
    .md\:pt-48 {
      padding-top: 12rem;
    }
    .md\:pt-60 {
      padding-top: 15rem;
    }
    .md\:pb-3 {
      padding-bottom: 0.75rem;
    }
    .md\:text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .md\:text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .md\:text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
  @media (min-width: 1024px) {
    .lg\:col-span-3 {
      grid-column: span 3 / span 3;
    }
    .lg\:col-span-9 {
      grid-column: span 9 / span 9;
    }
    .lg\:-mx-8 {
      margin-left: -2rem;
      margin-right: -2rem;
    }
    .lg\:mt-0 {
      margin-top: 0;
    }
    .lg\:mt-4 {
      margin-top: 1rem;
    }
    .lg\:block {
      display: block;
    }
    .lg\:flex {
      display: flex;
    }
    .lg\:grid {
      display: grid;
    }
    .lg\:hidden {
      display: none;
    }
    .lg\:w-auto {
      width: auto;
    }
    .lg\:w-1\/2 {
      width: 50%;
    }
    .lg\:w-1\/3 {
      width: 33.333333%;
    }
    .lg\:flex-shrink-0 {
      flex-shrink: 0;
    }
    .lg\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .lg\:grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }
    .lg\:items-center {
      align-items: center;
    }
    .lg\:justify-between {
      justify-content: space-between;
    }
    .lg\:gap-x-5 {
      -moz-column-gap: 1.25rem;
      column-gap: 1.25rem;
    }
    .lg\:truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lg\:border-r-0 {
      border-right-width: 0;
    }
    .lg\:border-l {
      border-left-width: 1px;
    }
    .lg\:px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .lg\:py-16 {
      padding-bottom: 4rem;
      padding-top: 4rem;
    }
    .lg\:pt-5 {
      padding-top: 1.25rem;
    }
  }
  @media (min-width: 1280px) {
    .xl\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .xl\:my-0 {
      margin-bottom: 0;
      margin-top: 0;
    }
    .xl\:grid {
      display: grid;
    }
    .xl\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .xl\:gap-8 {
      gap: 2rem;
    }
  }
  .flatpickr-calendar {
    -webkit-animation: none;
    animation: none;
    background: transparent;
    background: #fff;
    border: 0;
    border-radius: 5px;
    -webkit-box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6,
      0 -1px 0 #e6e6e6, 0 3px 13px rgba(0, 0, 0, 0.08);
    box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6,
      0 -1px 0 #e6e6e6, 0 3px 13px rgba(0, 0, 0, 0.08);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    direction: ltr;
    display: none;
    font-size: 14px;
    line-height: 24px;
    opacity: 0;
    padding: 0;
    position: absolute;
    text-align: center;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    visibility: hidden;
    width: 307.875px;
  }
  .flatpickr-calendar.inline,
  .flatpickr-calendar.open {
    max-height: 640px;
    opacity: 1;
    visibility: visible;
  }
  .flatpickr-calendar.open {
    display: inline-block;
    z-index: 99999;
  }
  .flatpickr-calendar.animate.open {
    -webkit-animation: fpFadeInDown 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    animation: fpFadeInDown 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .flatpickr-calendar.inline {
    display: block;
    position: relative;
    top: 2px;
  }
  .flatpickr-calendar.static {
    position: absolute;
    top: calc(100% + 2px);
  }
  .flatpickr-calendar.static.open {
    display: block;
    z-index: 999;
  }
  .flatpickr-calendar.multiMonth
    .flatpickr-days
    .dayContainer:nth-child(n + 1)
    .flatpickr-day.inRange:nth-child(7n + 7) {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  .flatpickr-calendar.multiMonth
    .flatpickr-days
    .dayContainer:nth-child(n + 2)
    .flatpickr-day.inRange:nth-child(7n + 1) {
    -webkit-box-shadow: -2px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
    box-shadow: -2px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
  }
  .flatpickr-calendar .hasTime .dayContainer,
  .flatpickr-calendar .hasWeeks .dayContainer {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .flatpickr-calendar .hasWeeks .dayContainer {
    border-left: 0;
  }
  .flatpickr-calendar.hasTime .flatpickr-time {
    border-top: 1px solid #e6e6e6;
    height: 40px;
  }
  .flatpickr-calendar.noCalendar.hasTime .flatpickr-time {
    height: auto;
  }
  .flatpickr-calendar:after,
  .flatpickr-calendar:before {
    border: solid transparent;
    content: '';
    display: block;
    height: 0;
    left: 22px;
    pointer-events: none;
    position: absolute;
    width: 0;
  }
  .flatpickr-calendar.arrowRight:after,
  .flatpickr-calendar.arrowRight:before,
  .flatpickr-calendar.rightMost:after,
  .flatpickr-calendar.rightMost:before {
    left: auto;
    right: 22px;
  }
  .flatpickr-calendar.arrowCenter:after,
  .flatpickr-calendar.arrowCenter:before {
    left: 50%;
    right: 50%;
  }
  .flatpickr-calendar:before {
    border-width: 5px;
    margin: 0 -5px;
  }
  .flatpickr-calendar:after {
    border-width: 4px;
    margin: 0 -4px;
  }
  .flatpickr-calendar.arrowTop:after,
  .flatpickr-calendar.arrowTop:before {
    bottom: 100%;
  }
  .flatpickr-calendar.arrowTop:before {
    border-bottom-color: #e6e6e6;
  }
  .flatpickr-calendar.arrowTop:after {
    border-bottom-color: #fff;
  }
  .flatpickr-calendar.arrowBottom:after,
  .flatpickr-calendar.arrowBottom:before {
    top: 100%;
  }
  .flatpickr-calendar.arrowBottom:before {
    border-top-color: #e6e6e6;
  }
  .flatpickr-calendar.arrowBottom:after {
    border-top-color: #fff;
  }
  .flatpickr-calendar:focus {
    outline: 0;
  }
  .flatpickr-wrapper {
    display: inline-block;
    position: relative;
  }
  .flatpickr-months {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flatpickr-months .flatpickr-month {
    fill: rgba(0, 0, 0, 0.9);
    -webkit-box-flex: 1;
    background: transparent;
    color: rgba(0, 0, 0, 0.9);
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 34px;
    line-height: 1;
    overflow: hidden;
    position: relative;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .flatpickr-months .flatpickr-next-month,
  .flatpickr-months .flatpickr-prev-month {
    fill: rgba(0, 0, 0, 0.9);
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
    height: 34px;
    padding: 10px;
    position: absolute;
    text-decoration: none;
    top: 0;
    z-index: 3;
  }
  .flatpickr-months .flatpickr-next-month.flatpickr-disabled,
  .flatpickr-months .flatpickr-prev-month.flatpickr-disabled {
    display: none;
  }
  .flatpickr-months .flatpickr-next-month i,
  .flatpickr-months .flatpickr-prev-month i {
    position: relative;
  }
  .flatpickr-months .flatpickr-next-month.flatpickr-prev-month,
  .flatpickr-months .flatpickr-prev-month.flatpickr-prev-month {
    left: 0;
  }
  .flatpickr-months .flatpickr-next-month.flatpickr-next-month,
  .flatpickr-months .flatpickr-prev-month.flatpickr-next-month {
    right: 0;
  }
  .flatpickr-months .flatpickr-next-month:hover,
  .flatpickr-months .flatpickr-prev-month:hover {
    color: #959ea9;
  }
  .flatpickr-months .flatpickr-next-month:hover svg,
  .flatpickr-months .flatpickr-prev-month:hover svg {
    fill: #f64747;
  }
  .flatpickr-months .flatpickr-next-month svg,
  .flatpickr-months .flatpickr-prev-month svg {
    height: 14px;
    width: 14px;
  }
  .flatpickr-months .flatpickr-next-month svg path,
  .flatpickr-months .flatpickr-prev-month svg path {
    fill: inherit;
    -webkit-transition: fill 0.1s;
    transition: fill 0.1s;
  }
  .numInputWrapper {
    height: auto;
    position: relative;
  }
  .numInputWrapper input,
  .numInputWrapper span {
    display: inline-block;
  }
  .numInputWrapper input {
    width: 100%;
  }
  .numInputWrapper input::-ms-clear {
    display: none;
  }
  .numInputWrapper input::-webkit-inner-spin-button,
  .numInputWrapper input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .numInputWrapper span {
    border: 1px solid rgba(57, 57, 57, 0.15);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    height: 50%;
    line-height: 50%;
    opacity: 0;
    padding: 0 4px 0 2px;
    position: absolute;
    right: 0;
    width: 14px;
  }
  .numInputWrapper span:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  .numInputWrapper span:active {
    background: rgba(0, 0, 0, 0.2);
  }
  .numInputWrapper span:after {
    content: '';
    display: block;
    position: absolute;
  }
  .numInputWrapper span.arrowUp {
    border-bottom: 0;
    top: 0;
  }
  .numInputWrapper span.arrowUp:after {
    border-bottom: 4px solid rgba(57, 57, 57, 0.6);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    top: 26%;
  }
  .numInputWrapper span.arrowDown {
    top: 50%;
  }
  .numInputWrapper span.arrowDown:after {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(57, 57, 57, 0.6);
    top: 40%;
  }
  .numInputWrapper span svg {
    height: auto;
    width: inherit;
  }
  .numInputWrapper span svg path {
    fill: rgba(0, 0, 0, 0.5);
  }
  .numInputWrapper:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .numInputWrapper:hover span {
    opacity: 1;
  }
  .flatpickr-current-month {
    color: inherit;
    display: inline-block;
    font-size: 135%;
    font-weight: 300;
    height: 34px;
    left: 12.5%;
    line-height: inherit;
    line-height: 1;
    padding: 7.48px 0 0;
    position: absolute;
    text-align: center;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    width: 75%;
  }
  .flatpickr-current-month span.cur-month {
    color: inherit;
    display: inline-block;
    font-family: inherit;
    font-weight: 700;
    margin-left: 0.5ch;
    padding: 0;
  }
  .flatpickr-current-month span.cur-month:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .flatpickr-current-month .numInputWrapper {
    display: inline-block;
    width: 6ch;
    width: 7ch\0;
  }
  .flatpickr-current-month .numInputWrapper span.arrowUp:after {
    border-bottom-color: rgba(0, 0, 0, 0.9);
  }
  .flatpickr-current-month .numInputWrapper span.arrowDown:after {
    border-top-color: rgba(0, 0, 0, 0.9);
  }
  .flatpickr-current-month input.cur-year {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    background: transparent;
    border: 0;
    border-radius: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    cursor: text;
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: 300;
    height: auto;
    line-height: inherit;
    margin: 0;
    padding: 0 0 0 0.5ch;
    vertical-align: initial;
  }
  .flatpickr-current-month input.cur-year:focus {
    outline: 0;
  }
  .flatpickr-current-month input.cur-year[disabled],
  .flatpickr-current-month input.cur-year[disabled]:hover {
    background: transparent;
    color: rgba(0, 0, 0, 0.5);
    font-size: 100%;
    pointer-events: none;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months {
    appearance: menulist;
    -webkit-appearance: menulist;
    -moz-appearance: menulist;
    background: transparent;
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-weight: 300;
    height: auto;
    line-height: inherit;
    margin: -1px 0 0;
    outline: none;
    padding: 0 0 0 0.5ch;
    position: relative;
    vertical-align: initial;
    width: auto;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months:active,
  .flatpickr-current-month .flatpickr-monthDropdown-months:focus {
    outline: none;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .flatpickr-current-month
    .flatpickr-monthDropdown-months
    .flatpickr-monthDropdown-month {
    background-color: transparent;
    outline: none;
    padding: 0;
  }
  .flatpickr-weekdays {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    background: transparent;
    height: 28px;
    overflow: hidden;
    text-align: center;
    width: 100%;
  }
  .flatpickr-weekdays,
  .flatpickr-weekdays .flatpickr-weekdaycontainer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flatpickr-weekdays .flatpickr-weekdaycontainer,
  span.flatpickr-weekday {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  span.flatpickr-weekday {
    background: transparent;
    color: rgba(0, 0, 0, 0.54);
    cursor: default;
    display: block;
    font-size: 90%;
    font-weight: bolder;
    line-height: 1;
    margin: 0;
    text-align: center;
  }
  .dayContainer,
  .flatpickr-weeks {
    padding: 1px 0 0;
  }
  .flatpickr-days {
    -webkit-box-align: start;
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
    position: relative;
    width: 307.875px;
  }
  .flatpickr-days:focus {
    outline: 0;
  }
  .dayContainer {
    -ms-flex-pack: justify;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    display: -ms-flexbox;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    max-width: 307.875px;
    min-width: 307.875px;
    opacity: 1;
    outline: 0;
    padding: 0;
    text-align: left;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    width: 307.875px;
  }
  .dayContainer + .dayContainer {
    -webkit-box-shadow: -1px 0 0 #e6e6e6;
    box-shadow: -1px 0 0 #e6e6e6;
  }
  .flatpickr-day {
    -ms-flex-preferred-size: 14.2857143%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    background: none;
    border: 1px solid transparent;
    border-radius: 150px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #393939;
    cursor: pointer;
    display: inline-block;
    -webkit-flex-basis: 14.2857143%;
    flex-basis: 14.2857143%;
    font-weight: 400;
    height: 39px;
    -webkit-justify-content: center;
    justify-content: center;
    line-height: 39px;
    margin: 0;
    max-width: 39px;
    position: relative;
    text-align: center;
    width: 14.2857143%;
  }
  .flatpickr-day.inRange,
  .flatpickr-day.nextMonthDay.inRange,
  .flatpickr-day.nextMonthDay.today.inRange,
  .flatpickr-day.nextMonthDay:focus,
  .flatpickr-day.nextMonthDay:hover,
  .flatpickr-day.prevMonthDay.inRange,
  .flatpickr-day.prevMonthDay.today.inRange,
  .flatpickr-day.prevMonthDay:focus,
  .flatpickr-day.prevMonthDay:hover,
  .flatpickr-day.today.inRange,
  .flatpickr-day:focus,
  .flatpickr-day:hover {
    background: #e6e6e6;
    border-color: #e6e6e6;
    cursor: pointer;
    outline: 0;
  }
  .flatpickr-day.today {
    border-color: #959ea9;
  }
  .flatpickr-day.today:focus,
  .flatpickr-day.today:hover {
    background: #959ea9;
    border-color: #959ea9;
    color: #fff;
  }
  .flatpickr-day.endRange,
  .flatpickr-day.endRange.inRange,
  .flatpickr-day.endRange.nextMonthDay,
  .flatpickr-day.endRange.prevMonthDay,
  .flatpickr-day.endRange:focus,
  .flatpickr-day.endRange:hover,
  .flatpickr-day.selected,
  .flatpickr-day.selected.inRange,
  .flatpickr-day.selected.nextMonthDay,
  .flatpickr-day.selected.prevMonthDay,
  .flatpickr-day.selected:focus,
  .flatpickr-day.selected:hover,
  .flatpickr-day.startRange,
  .flatpickr-day.startRange.inRange,
  .flatpickr-day.startRange.nextMonthDay,
  .flatpickr-day.startRange.prevMonthDay,
  .flatpickr-day.startRange:focus,
  .flatpickr-day.startRange:hover {
    background: #569ff7;
    border-color: #569ff7;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: #fff;
  }
  .flatpickr-day.endRange.startRange,
  .flatpickr-day.selected.startRange,
  .flatpickr-day.startRange.startRange {
    border-radius: 50px 0 0 50px;
  }
  .flatpickr-day.endRange.endRange,
  .flatpickr-day.selected.endRange,
  .flatpickr-day.startRange.endRange {
    border-radius: 0 50px 50px 0;
  }
  .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
  .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1)) {
    -webkit-box-shadow: -10px 0 0 #569ff7;
    box-shadow: -10px 0 0 #569ff7;
  }
  .flatpickr-day.endRange.startRange.endRange,
  .flatpickr-day.selected.startRange.endRange,
  .flatpickr-day.startRange.startRange.endRange {
    border-radius: 50px;
  }
  .flatpickr-day.inRange {
    border-radius: 0;
    -webkit-box-shadow: -5px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
    box-shadow: -5px 0 0 #e6e6e6, 5px 0 0 #e6e6e6;
  }
  .flatpickr-day.flatpickr-disabled,
  .flatpickr-day.flatpickr-disabled:hover,
  .flatpickr-day.nextMonthDay,
  .flatpickr-day.notAllowed,
  .flatpickr-day.notAllowed.nextMonthDay,
  .flatpickr-day.notAllowed.prevMonthDay,
  .flatpickr-day.prevMonthDay {
    background: transparent;
    border-color: transparent;
    color: rgba(57, 57, 57, 0.3);
    cursor: default;
  }
  .flatpickr-day.flatpickr-disabled,
  .flatpickr-day.flatpickr-disabled:hover {
    color: rgba(57, 57, 57, 0.1);
    cursor: not-allowed;
  }
  .flatpickr-day.week.selected {
    border-radius: 0;
    -webkit-box-shadow: -5px 0 0 #569ff7, 5px 0 0 #569ff7;
    box-shadow: -5px 0 0 #569ff7, 5px 0 0 #569ff7;
  }
  .flatpickr-day.hidden {
    visibility: hidden;
  }
  .rangeMode .flatpickr-day {
    margin-top: 1px;
  }
  .flatpickr-weekwrapper {
    float: left;
  }
  .flatpickr-weekwrapper .flatpickr-weeks {
    -webkit-box-shadow: 1px 0 0 #e6e6e6;
    box-shadow: 1px 0 0 #e6e6e6;
    padding: 0 12px;
  }
  .flatpickr-weekwrapper .flatpickr-weekday {
    float: none;
    line-height: 28px;
    width: 100%;
  }
  .flatpickr-weekwrapper span.flatpickr-day,
  .flatpickr-weekwrapper span.flatpickr-day:hover {
    background: transparent;
    border: none;
    color: rgba(57, 57, 57, 0.3);
    cursor: default;
    display: block;
    max-width: none;
    width: 100%;
  }
  .flatpickr-innerContainer {
    display: block;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
  }
  .flatpickr-innerContainer,
  .flatpickr-rContainer {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .flatpickr-rContainer {
    display: inline-block;
    padding: 0;
  }
  .flatpickr-time {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    height: 0;
    line-height: 40px;
    max-height: 40px;
    outline: 0;
    overflow: hidden;
    text-align: center;
  }
  .flatpickr-time:after {
    clear: both;
    content: '';
    display: table;
  }
  .flatpickr-time .numInputWrapper {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    float: left;
    height: 40px;
    width: 40%;
  }
  .flatpickr-time .numInputWrapper span.arrowUp:after {
    border-bottom-color: #393939;
  }
  .flatpickr-time .numInputWrapper span.arrowDown:after {
    border-top-color: #393939;
  }
  .flatpickr-time.hasSeconds .numInputWrapper {
    width: 26%;
  }
  .flatpickr-time.time24hr .numInputWrapper {
    width: 49%;
  }
  .flatpickr-time input {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    background: transparent;
    border: 0;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #393939;
    font-size: 14px;
    height: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    position: relative;
    text-align: center;
  }
  .flatpickr-time input.flatpickr-hour {
    font-weight: 700;
  }
  .flatpickr-time input.flatpickr-minute,
  .flatpickr-time input.flatpickr-second {
    font-weight: 400;
  }
  .flatpickr-time input:focus {
    border: 0;
    outline: 0;
  }
  .flatpickr-time .flatpickr-am-pm,
  .flatpickr-time .flatpickr-time-separator {
    -ms-flex-item-align: center;
    -webkit-align-self: center;
    align-self: center;
    color: #393939;
    float: left;
    font-weight: 700;
    height: inherit;
    line-height: inherit;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 2%;
  }
  .flatpickr-time .flatpickr-am-pm {
    cursor: pointer;
    font-weight: 400;
    outline: 0;
    text-align: center;
    width: 18%;
  }
  .flatpickr-time .flatpickr-am-pm:focus,
  .flatpickr-time .flatpickr-am-pm:hover,
  .flatpickr-time input:focus,
  .flatpickr-time input:hover {
    background: #eee;
  }
  .flatpickr-input[readonly] {
    cursor: pointer;
  }
  @-webkit-keyframes fpFadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
  @keyframes fpFadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
`;var W=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};class V extends i{constructor(){super(...arguments),this.language="en",this.rtl=!1,this.wide=!1,this.installMediaQueryWatcher=(t,e)=>{let r=window.matchMedia(t);r.addListener((t=>e(t.matches))),e(r.matches)}}connectedCallback(){super.connectedCallback(),this.addGlobalListener("language-loaded",this._languageEvent.bind(this)),window.appGlobals&&window.appGlobals.i18nTranslation&&window.appGlobals.locale?(this.language=window.appGlobals.locale,this._setupRtl()):this.language="en",this.installMediaQueryWatcher("(min-width: 900px)",(t=>{this.wide=t}))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("language-loaded",this._languageEvent.bind(this))}updated(t){t.has("language")&&this.languageChanged()}static get rtlLanguages(){return["fa","ar","ar_EG"]}languageChanged(){}_setupRtl(){V.rtlLanguages.indexOf(this.language)>-1?this.rtl=!0:this.rtl=!1}static get styles(){return[Y,e`
        [hidden] {
          display: none !important;
        }
      `]}_languageEvent(t){this.language=t.detail.language,window.appGlobals.locale=t.detail.language,void 0!==this.rtl&&this._setupRtl()}fire(t,e={},r=this){const i=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});r.dispatchEvent(i)}fireGlobal(t,e={}){this.fire(t,e,document)}addListener(t,e,r=this){r.addEventListener(t,e,!1)}addGlobalListener(t,e){this.addListener(t,e,document)}removeListener(t,e,r=this){r.removeEventListener(t,e)}removeGlobalListener(t,e){this.removeListener(t,e,document)}t(...t){const e=t[0];if(window.appGlobals&&window.appGlobals.i18nTranslation){let t=window.appGlobals.i18nTranslation.t(e);return t||(t=""),t}return e}getTooltipText(t){return t.tooltipTextToken?this.t(t.tooltipTextToken):void 0}renderIcon(t){return t.icon?"icon":void 0}$$(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}}W([r({type:String})],V.prototype,"language",void 0),W([r({type:Boolean})],V.prototype,"rtl",void 0),W([r({type:Boolean})],V.prototype,"wide",void 0);var G=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let K=class extends V{constructor(){super(...arguments),this.disabled=!1}static get styles(){return[...super.styles]}renderComparison(t,e){const r=x(Math.abs(e));if(e>0){return o`<span class="text-xs dark:text-gray-100"
        ><span class="${("Bounce rate"===t?"text-red-400":"text-green-500")+" font-bold"}">&uarr;</span
        >${r}%</span
      >`}if(e<0){return o`<span class="text-xs dark:text-gray-100"
        ><span class="${("Bounce rate"===t?"text-green-500":"text-red-400")+" font-bold"}">&darr;</span>
        ${r}%</span
      >`}return 0===e?o`<span class="text-xs text-gray-700 dark:text-gray-300"
        >&#12336; N/A</span
      >`:a}topStatNumberShort(t){return["visit duration","time on page"].includes(t.name.toLowerCase())?k(t.value):["bounce rate","conversion rate"].includes(t.name.toLowerCase())?t.value+"%":x(t.value)}topStatTooltip(t){if(["visit duration","time on page","bounce rate","conversion rate"].includes(t.name.toLowerCase()))return null;{let e=t.name.toLowerCase();return e=1===t.value?e.slice(0,-1):e,t.value.toLocaleString()+" "+e}}titleFor(t){return this.metric===mt[t.name]?`Hide ${ft[mt[t.name]].toLowerCase()} from graph`:`Show ${ft[mt[t.name]].toLowerCase()} on graph`}renderStat(t){return o` <div
      class="flex items-center justify-between my-1 whitespace-nowrap"
    >
      <b
        class="mr-4 text-xl md:text-2xl dark:text-gray-100"
        tooltip="${s(null===this.topStatTooltip(t)?void 0:this.topStatTooltip(t))}"
        >${this.topStatNumberShort(t)}</b
      >
      ${this.renderComparison(t.name,t.change)}
    </div>`}render(){const t=this.topStatData&&this.topStatData.top_stats.map(((t,e)=>{let r=e>0?"lg:border-l border-gray-300":"";r=e%2==0?r+" border-r lg:border-r-0":r;const i=Object.keys(mt).includes(t.name)&&!(this.query.filters.goal&&"Unique visitors"===t.name),n=this.metric===mt[t.name],[a,s]=t.name.split(/(\(.+\))/g),l=this.t(a);return o`
          ${i?o`
                <div
                  class="${`px-4 md:px-6 w-1/2 my-4 lg:w-auto group cursor-pointer select-none ${r}`}"
                  @click="${()=>{this.updateMetric(mt[t.name])}}"
                  tabindex="0"
                  .title="${this.titleFor(t)}"
                >
                  <div
                    class="${"text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap flex w-content\n                  "+(n?"text-indigo-700 dark:text-indigo-500\n                        border-indigo-700 dark:border-indigo-500":"group-hover:text-indigo-700\n                        dark:group-hover:text-indigo-500")}"
                  >
                    ${l}
                  </div>
                  <span class="hidden sm:inline-block ml-1"
                    >${s}</span
                  >
                  ${this.renderStat(t)}
                </div>
              `:o`
                <div class=${`px-4 md:px-6 w-1/2 my-4 lg:w-auto ${r}`}>
                  <div
                    class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap flex"
                  >
                    ${t.name}
                  </div>
                  ${this.renderStat(t)}
                </div>
              `}
        `}));return this.query&&"realtime"===this.query.period&&t.push(o`<div
          key="dot"
          class="block pulsating-circle"
          .style=${{left:"125px",top:"52px"}}
        ></div>`),t}};G([r({type:Boolean})],K.prototype,"disabled",void 0),G([r({type:Object})],K.prototype,"query",void 0),G([r({type:Object})],K.prototype,"updateMetric",void 0),G([r({type:Object})],K.prototype,"history",void 0),G([r({type:String})],K.prototype,"classsName",void 0),G([r({type:Object})],K.prototype,"to",void 0),G([r({type:String})],K.prototype,"metric",void 0),G([r({type:Object})],K.prototype,"topStatData",void 0),K=G([n("pl-top-stats")],K),y.register(...v);var X=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let J=class extends V{constructor(){super(...arguments),this.to=void 0}static get styles(){return[...super.styles,e`
        :host {
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
      `]}get currentUri(){return`${location.pathname}?${this.to.search}`}onClick(t){t.preventDefault(),window.history.pushState({},"",this.currentUri),setTimeout((()=>{window.dispatchEvent(new CustomEvent("popstate"))}))}render(){return o`<a href="${this.currentUri}" @click="${this.onClick}"
      ><slot></slot
    ></a> `}};X([r({type:String})],J.prototype,"to",void 0),J=X([n("pl-link")],J);const Z=["realtime","day","month","7d","30d","6mo","12mo","year","all","custom"];function Q(t,e){const r=new URLSearchParams(t);let i=r.get("period");const n=`period__${e.domain}`;return Z.includes(i)?"custom"!==i&&"realtime"!==i&&B(n,i):i=H(n)?H(n):"30d",{period:i,date:r.get("date")?A(r.get("date")):O(e),from:r.get("from")?A(r.get("from")):void 0,to:r.get("to")?A(r.get("to")):void 0,with_imported:!r.get("with_imported")||"true"===r.get("with_imported"),filters:{goal:r.get("goal"),props:JSON.parse(r.get("props")),source:r.get("source"),utm_medium:r.get("utm_medium"),utm_source:r.get("utm_source"),utm_campaign:r.get("utm_campaign"),utm_content:r.get("utm_content"),utm_term:r.get("utm_term"),referrer:r.get("referrer"),screen:r.get("screen"),browser:r.get("browser"),browser_version:r.get("browser_version"),os:r.get("os"),os_version:r.get("os_version"),country:r.get("country"),region:r.get("region"),city:r.get("city"),page:r.get("page"),entry_page:r.get("entry_page"),exit_page:r.get("exit_page")}}}function tt(t){return Object.keys(t.filters).map((e=>[e,t.filters[e]])).filter((([t,e])=>!!e))}function et(t){const e=new URLSearchParams(window.location.search);return Object.keys(t).forEach((r=>{t[r]?e.set(r,t[r]):e.delete(r)})),e.toString()}function rt(t,e,r){const i=et(r);if(r.period&&r.period!==e.period){const t=new URLSearchParams(window.location.search);t.set("period",e.period);const r=`${location.pathname}?${t.toString()}`;window.history.pushState({},"",r),setTimeout((()=>{window.dispatchEvent(new CustomEvent("popstate"))}))}else{const t=`${location.pathname}?${i}`;window.history.pushState({},"",t),setTimeout((()=>{window.dispatchEvent(new CustomEvent("popstate"))}))}t.push({search:i})}const it={goal:"Goal",props:"Property",prop_key:"Property",prop_value:"Value",source:"Source",utm_medium:"UTM Medium",utm_source:"UTM Source",utm_campaign:"UTM Campaign",utm_content:"UTM Content",utm_term:"UTM Term",referrer:"Referrer URL",screen:"Screen size",browser:"Browser",browser_version:"Browser Version",os:"Operating System",os_version:"Operating System Version",country:"Country",region:"Region",city:"City",page:"Page",entry_page:"Entry Page",exit_page:"Exit Page"},nt=(t,e=!1)=>function(r,i,n){let o=A(r);if("month"===t)return M(o);if("date"===t)return T(o);if("hour"===t){const t=r.split(/[^0-9]/);o=new Date(t[0],t[1]-1,t[2],t[3],t[4],t[5]);var a=o.getHours(),s=a>=12?"pm":"am";return(a=(a%=12)||12)+s}if("minute"===t){if(e){const t=Math.abs(parseInt(r));return 1===t?"1 minute ago":t+" minutes ago"}return r+"m"}return r},ot=(t,e,r,i)=>n=>{const o=n.tooltip,a=r.getBoundingClientRect();let s=i;if(s||(s=document.createElement("div"),s.id="chartjs-tooltip",s.style.display="none",s.style.opacity="0",document.body.appendChild(s)),s&&a&&window.innerWidth<768&&(s.style.top=a.y+a.height+window.scrollY+15+"px",s.style.left=a.x+"px",s.style.right="",s.style.opacity="1"),0!==o.opacity){if(o.body){var l=o.body.map((function(t){return t.lines}));3===l.length&&(l[1]=[]);const r=o.dataPoints[0],i=t.labels[r.dataIndex],n=r.raw||0;let a=`\n        <div class='text-gray-100 flex flex-col'>\n          <div class='flex justify-between items-center'>\n            <span class='font-bold mr-4 text-lg'>${ft[e]}</span>\n          </div>\n          <div class='flex flex-col'>\n            <div class='flex flex-row justify-between items-center'>\n              <span class='flex items-center mr-4'>\n                <div class='w-3 h-3 mr-1 rounded-full' style='background-color: rgba(101,116,205)'></div>\n                <span>${function(e,r){const i=nt(t.interval,!0)(e),n=r?nt(t.interval,!0)(r):null;return"month"===t.interval||"date"===t.interval?r?n:i:"hour"===t.interval?r?`${nt("date",!0)(r)}, ${nt(t.interval,!0)(r)}`:`${nt("date",!0)(e)}, ${i}`:r?n:i}(i)}</span>\n              </span>\n              <span>${yt[e](n)}</span>\n            </div>\n          </div>\n          <span class='font-bold text-'>${"month"===t.interval?"Click to view month":"date"===t.interval?"Click to view day":""}</span>\n        </div>\n      `;s.innerHTML=a}s.style.display=""}else s.style.display="none"};function at(t,e=""){return`/api/stats/${encodeURIComponent(t.domain)}${e}`}function st(t,e=""){return function(t,e=""){return`/${encodeURIComponent(t.domain)}${e}`}(t,e)+window.location.search}function lt(t,e){const r=new URLSearchParams(window.location.search);return r.set(t,e),`${r.toString()}`}var ct=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};class dt extends V{}ct([r({type:Object})],dt.prototype,"query",void 0),ct([r({type:Object})],dt.prototype,"site",void 0),ct([r({type:String})],dt.prototype,"proxyUrl",void 0),ct([r({type:String})],dt.prototype,"proxyFaviconBaseUrl",void 0),ct([r({type:Object})],dt.prototype,"timer",void 0),ct([r({type:String})],dt.prototype,"currentUserRole",void 0);var pt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let ht=class extends dt{constructor(){super(),this.darkTheme=!1,this.exported=!1,this.repositionTooltip=this.repositionTooltip.bind(this)}static get styles(){return[...super.styles]}updated(t){super.updated(t);const e=this.$$("#chartjs-tooltip");this.metric&&this.graphData&&(t.has("graphData")||t.has("darkTheme"))&&(this.chart&&this.chart.destroy(),this.chart=this.regenerateChart(),this.chart.update(),e&&(e.style.display="none")),this.graphData&&this.metric||(this.chart&&this.chart.destroy(),e&&(e.style.display="none"))}regenerateChart(){let t=this.$$("canvas");t||(t=this.canvasElement),this.ctx=t.getContext("2d");const e=((t,e,r,i,n)=>{var o=r.createLinearGradient(0,0,0,300),a=r.createLinearGradient(0,0,0,300);if(o.addColorStop(0,"rgba(101,116,205, 0.2)"),o.addColorStop(1,"rgba(101,116,205, 0)"),a.addColorStop(0,"rgba(101,116,205, 0.075)"),a.addColorStop(1,"rgba(101,116,205, 0)"),null!==e){var s=t.slice(e-1,e+1),l=new Array(e-1).fill(void 0).concat(s);const r=[...t];for(var c=e;c<r.length;c++)r[c]=void 0;return[{label:i,data:r,borderWidth:3,borderColor:"rgba(101,116,205)",pointBackgroundColor:"rgba(101,116,205)",pointHoverBackgroundColor:"rgba(71, 87, 193)",pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0},{label:i,data:l,borderWidth:3,borderDash:[3,3],borderColor:"rgba(101,116,205)",pointHoverBackgroundColor:"rgba(71, 87, 193)",pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0}]}return[{label:i,data:t,borderWidth:3,borderColor:"rgba(101,116,205)",pointHoverBackgroundColor:"rgba(71, 87, 193)",pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0}]})(this.graphData.plot,this.graphData.present_index,this.ctx,ft[this.metric]),r=this.graphData;return new y(this.ctx,{type:"line",data:{labels:this.graphData.labels,datasets:e},options:{animation:!1,plugins:{legend:{display:!1},tooltip:{enabled:!1,mode:"index",intersect:!1,position:"average",external:ot(this.graphData,this.metric,t,this.$$("#chartjs-tooltip"))}},responsive:!0,onResize:this.updateWindowDimensions,elements:{line:{tension:0},point:{radius:0}},onClick:this.onClick.bind(this),scales:{y:{beginAtZero:!0,ticks:{callback:yt[this.metric],maxTicksLimit:8,color:this.darkTheme?"rgb(243, 244, 246)":void 0},grid:{zeroLineColor:"transparent",drawBorder:!1}},x:{grid:{display:!1},ticks:{maxTicksLimit:8,callback:function(t,e,i){return nt(r.interval)(this.getLabelForValue(t))},color:this.darkTheme?"rgb(243, 244, 246)":void 0}}},interaction:{mode:"index",intersect:!1}}})}repositionTooltip(t){const e=this.$$("#chartjs-tooltip");e&&window.innerWidth>=768&&(t.clientX>.66*window.innerWidth?(e.style.right=window.innerWidth-t.clientX+window.pageXOffset+"px",e.style.left=""):(e.style.right="",e.style.left=t.clientX+window.pageXOffset+"px"),e.style.top=t.clientY+window.pageYOffset+"px",e.style.opacity="1")}connectedCallback(){super.connectedCallback(),window.addEventListener("mousemove",this.repositionTooltip)}firstUpdated(t){this.metric&&this.graphData&&(this.chart=this.regenerateChart())}disconnectedCallback(){super.disconnectedCallback();const t=document.getElementById("chartjs-tooltip");t&&(t.style.opacity="0",t.style.display="none"),window.removeEventListener("mousemove",this.repositionTooltip)}updateWindowDimensions(t,e){t.options.scales.x.ticks.maxTicksLimit=e.width<720?5:8,t.options.scales.y.ticks.maxTicksLimit=e.height<233?3:8}onClick(t){const e=this.chart.getElementsAtEventForMode(t,"index",{intersect:!1},!1)[0],r=this.chart.data.labels[e.index];"month"===this.graphData.interval?rt(this.history,this.query,{period:"month",date:r}):"date"===this.graphData.interval&&rt(this.history,this.query,{period:"day",date:r})}pollExportReady(){document.cookie.includes("exporting")?setTimeout(this.pollExportReady.bind(this),1e3):this.exported=!1}downloadSpinner(){this.exported=!0,document.cookie="exporting=",setTimeout(this.pollExportReady.bind(this),1e3)}downloadLink(){if("realtime"!==this.query.period){if(this.exported)return o`
          <div class="w-4 h-4 mx-2">
            <svg
              class="animate-spin h-4 w-4 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        `;{const t=`/${encodeURIComponent(this.site.domain)}/export${R(this.query)}`;return o`
          <a
            hidden
            class="w-4 h-4 mx-2"
            href="${t}"
            download
            onClick="{this.downloadSpinner.bind(this)}"
          >
            <svg
              style="max-width: 50px;max-height: 50px;"
              class="absolute text-gray-700 feather dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        `}}return a}samplingNotice(){const t=this.topStatData&&this.topStatData.sample_percent;return t&&t<100?o`
        <div
          tooltip=${`Stats based on a ${t}% sample of all visitors`}
          class="cursor-pointer w-4 h-4 mx-2"
        >
          <svg
            class="absolute w-4 h-4 dark:text-gray-300 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      `:a}importedNotice(){const t=this.topStatData.imported_source;if(t){const e=this.topStatData.with_imported,r=function(t,e){const r=new URLSearchParams(window.location.search);return r.set(t,e),`${window.location.pathname}?${r.toString()}`}("with_imported",(!e).toString());return o`
        <pl-link .to=${r} class="w-4 h-4 mx-2">
          <div
            tooltip=${`Stats ${e?"":"do not "}include data imported from ${t}.`}
            class="cursor-pointer w-4 h-4"
          >
            <svg
              class="absolute dark:text-gray-300 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <text
                x="4"
                y="18"
                fontSize="24"
                fill="currentColor"
                class={'text-gray-700 dark:text-gray-300' + strike}
              >
                ${t[0].toUpperCase()}
              </text>
            </svg>
          </div>
    </pl-link>
      `}return a}render(){const t=this.graphData&&"hour"===this.graphData.interval?"":"cursor-pointer";return o`
      <div class="w-full p-4 bg-white rounded shadow-xl dark:bg-gray-825">
        <div class="flex flex-wrap">
          <pl-top-stats
            .query=${this.query}
            .metric=${this.metric}
            .updateMetric=${this.updateMetric}
            .topStatData=${this.topStatData}
            useTopStatsFor
            class="flex flex-wrap"
          ></pl-top-stats>
        </div>
        <div class="relative px-2">
          <div class="absolute right-4 -top-10 flex">
            ${this.downloadLink()}
            ${this.samplingNotice()}
            ${this.importedNotice()}
          </div>
          <canvas
            id="main-graph-canvas"
            class=${"mt-4 select-none "+t}
            width="1054"
            height="342"
          ></canvas>
        </div>
      </div>
    `}};pt([r({type:Object})],ht.prototype,"graphData",void 0),pt([r({type:String})],ht.prototype,"metric",void 0),pt([r({type:Object})],ht.prototype,"ctx",void 0),pt([r({type:Boolean})],ht.prototype,"darkTheme",void 0),pt([r({type:Object})],ht.prototype,"chart",void 0),pt([r({type:Object})],ht.prototype,"updateMetric",void 0),pt([r({type:Object})],ht.prototype,"history",void 0),pt([r({type:Object})],ht.prototype,"topStatData",void 0),pt([l("canvas")],ht.prototype,"canvasElement",void 0),pt([r({type:Boolean})],ht.prototype,"exported",void 0),ht=pt([n("pl-line-graph")],ht);var ut=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let gt=class extends dt{constructor(){super(),this.useTopStatsForCurrentVisitors=!1}static get styles(){return[...super.styles]}connectedCallback(){super.connectedCallback(),this.metric=H(`metric__${this.site.domain}`)||"visitors",this.updateMetric=this.updateMetric.bind(this),this.fetchGraphData=this.fetchGraphData.bind(this),this.fetchTopStatData=this.fetchTopStatData.bind(this)}updated(t){if(super.updated(t),t.get("query")){this.fetchGraphData(),this.fetchTopStatData();const e=H(`metric__${this.site.domain}`),r=this.topStatData&&this.topStatData.top_stats.map((({name:t})=>mt[t])).filter((t=>t)),i=t.get("topStatData")&&t.get("topStatData").top_stats.map((({name:t})=>mt[t])).filter((t=>t));r&&`${r}`!=`${i}`&&(r.includes(e)||""===e?this.metric=e:this.query.filters.goal&&"conversions"!==this.metric?this.metric="conversions":this.metric=r[0])}else t.get("metric")&&this.fetchGraphData()}firstUpdated(){this.fetchGraphData(),this.fetchTopStatData(),this.timer&&(this.timer.onTick(this.fetchGraphData),this.timer.onTick(this.fetchTopStatData))}updateMetric(t){t===this.metric?B(`metric__${this.site.domain}`,""):(B(`metric__${this.site.domain}`,t),this.metric=t)}fetchGraphData(){this.metric&&U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/main-graph`,this.query,{metric:this.metric||"none"}).then((t=>{this.graphData=t}))}fetchTopStatData(){U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`,this.query).then((t=>{this.useTopStatsForCurrentVisitors&&"realtime"==this.query.period&&(t.top_stats[0]={name:t.top_stats[0].name,value:t.top_stats[1].value}),this.topStatData=t}))}renderInner(){const t=document.querySelector("html").classList.contains("dark")||!1;return o`
      <pl-line-graph
        .graphData="${this.graphData}"
        .topStatData="${this.topStatData}"
        .site="${this.site}"
        .query="${this.query}"
        .darkTheme="${t}"
        .metric="${this.metric}"
        .updateMetric="${this.updateMetric}"
      ></pl-line-graph>
    `}render(){return o`
    <div class="graph-inner">
      <div
        class="${this.topStatData&&!this.graphData?"pt-52 sm:pt-56 md:pt-60":this.metric?"pt-32 sm:pt-36 md:pt-48":"pt-16 sm:pt-14 md:pt-18 lg:pt-5"} mx-auto ${this.topStatData?"":"loading"}"
      >
        <div></div>
      </div>
    </div>
  ${this.topStatData?this.renderInner():a}
</div>

`}};ut([r({type:Object})],gt.prototype,"history",void 0),ut([r({type:String})],gt.prototype,"metric",void 0),ut([r({type:Object})],gt.prototype,"topStatData",void 0),ut([r({type:Object})],gt.prototype,"graphData",void 0),ut([r({type:Boolean})],gt.prototype,"useTopStatsForCurrentVisitors",void 0),gt=ut([n("pl-visitors-graph")],gt);const mt={"Unique visitors (last 30 min)":"visitors","Pageviews (last 30 min)":"pageviews","Unique visitors":"visitors","Visit duration":"visit_duration","Total pageviews":"pageviews","Bounce rate":"bounce_rate","Unique conversions":"conversions"},ft={visitors:"Visitors",pageviews:"Pageviews",bounce_rate:"Bounce Rate",visit_duration:"Visit Duration",conversions:"Converted Visitors"},yt={visitors:x,pageviews:x,bounce_rate:t=>`${t}%`,visit_duration:k,conversions:x};var vt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let bt=class extends V{constructor(){super(...arguments),this.plot="visitors"}static get styles(){return[...super.styles,e`
        :host {
          width: 90%;
        }

        .faviconMargin {
          margin-left: 30px;
        }

        .rounded {
          border-radius: 12px;
        }
      `,e``]}render(){const t=function(t,e,r){let i=e[0][r];for(const t of e)t>i&&(i=t[r]);return t/i*100}(this.count,this.all,this.plot);return o`
      <div
        class="w-full relative"
        .not-used-old-style="max-width: calc(100% - ${this.maxWidthDeduction});"
      >
        <div
          class="${`absolute top-0 left-0 h-full test rounded ${this.bg||""}`}"
          .style="width: ${t}%;"
        ></div>
        <slot></slot>
      </div>
    `}};vt([r({type:Number})],bt.prototype,"count",void 0),vt([r({type:Array})],bt.prototype,"all",void 0),vt([r({type:String})],bt.prototype,"maxWidthDeduction",void 0),vt([r({type:String})],bt.prototype,"plot",void 0),vt([r({type:String})],bt.prototype,"bg",void 0),bt=vt([n("pl-bar")],bt);var wt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let xt=class extends dt{constructor(){super(),this.loading=!0,this.viewport=1080,this.breakdown=[],this.page=1,this.moreResultsAvailable=!0}async connectedCallback(){super.connectedCallback(),this.propKey=this.goal.prop_names[0],this.storageKey="goalPropTab__"+this.site.domain+this.goal.name;const t=H(this.storageKey);this.goal.prop_names.includes(t)&&(this.propKey=t),this.query.filters.props&&(this.propKey=Object.keys(this.query.filters.props)[0]),this.handleResize=this.handleResize.bind(this),window.addEventListener("resize",this.handleResize,!1),this.handleResize(),await this.updateComplete,this.fetchPropBreakdown()}disconnectedCallback(){window.removeEventListener("resize",this.handleResize,!1)}static get styles(){return[...super.styles]}handleResize(){this.viewport=window.innerWidth}getBarMaxWidth(){return this.viewport>767?"16rem":"10rem"}fetchPropBreakdown(){this.query.filters.goal&&U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/property/${encodeURIComponent(this.propKey)}`,this.query,{limit:100,page:this.page}).then((t=>{this.loading=!1,this.breakdown=this.breakdown.concat(t),this.moreResultsAvailable=100===t.length}))}loadMore(){this.loading=!0,this.page=this.page+1,this.fetchPropBreakdown()}renderUrl(t){return function(t){let e;try{e=new URL(t)}catch(t){return!1}return"http:"===e.protocol||"https:"===e.protocol}(t.name)?o`
        <a
          target="_blank"
          href="{value.name}"
          rel="noreferrer"
          class="hidden group-hover:block"
        >
          <svg
            class="inline h-4 w-4 ml-1 -mt-1 text-gray-600 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
            ></path>
            <path
              d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
            ></path>
          </svg>
        </a>
      `:a}renderPropContent(t,e){return o`
      <span
        class="flex px-2 py-1.5 group dark:text-gray-300 relative z-2 break-all"
      >
        <pl-link
          .to=${{pathname:window.location.pathname,search:e.toString()}}
          class="md:truncate hover:underline block"
        >
          ${t.name}
        </pl-link>
        ${this.renderUrl(t)}
      </span>
    `}renderPropValue(t){const e=new URLSearchParams(window.location.search);return e.set("props",JSON.stringify({[this.propKey]:t.name})),o`
      <div class="flex items-center justify-between my-2" key="{value.name}">
        <pl-bar
          .count=${t.unique_conversions}
          plot="unique_conversions"
          .all=${this.breakdown}
          bg="bg-red-50 dark:bg-gray-500 dark:bg-opacity-15"
          maxWidthDeduction=${this.getBarMaxWidth()}
        >
          ${this.renderPropContent(t,e)}
        </pl-bar>
        <div class="dark:text-gray-200">
          <span class="font-medium inline-block w-20 text-right"
            >${x(t.unique_conversions)}</span
          >
          ${this.viewport&&this.viewport>767?o`
                <span class="font-medium inline-block w-20 text-right"
                  >${x(t.total_conversions)}
                </span>
              `:null}
          <span class="font-medium inline-block w-20 text-right"
            >${x(t.conversion_rate)}%</span
          >
        </div>
      </div>
    `}changePropKey(t){B(this.storageKey,t),this.propKey=t,this.loading=!0,this.breakdown=[],this.page=1,this.moreResultsAvailable=!1,this.fetchPropBreakdown()}renderLoading(){return this.loading?o` <div class="px-4 py-2">
        <div class="loading sm mx-auto"><div></div></div>
      </div>`:this.moreResultsAvailable?o`
        <div class="w-full text-center my-4">
          <button
            @click=${this.loadMore.bind(this)}
            type="button"
            class="button"
          >
            Load more
          </button>
        </div>
      `:a}renderBody(){return this.breakdown.map((t=>this.renderPropValue(t)))}renderPill(t){return this.propKey===t?o`<li
        key="${t}"
        class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold mr-2 active-prop-heading"
      >
        ${t}
      </li>`:o`<li
        key="${t}"
        class="hover:text-indigo-600 cursor-pointer mr-2"
        @click=${this.changePropKey.bind(this,t)}
      >
        ${t}
      </li>`}render(){return this.goal&&this.propKey?o`
        <div class="w-full pl-3 sm:pl-6 mt-4">
          <div class="flex-col sm:flex-row flex items-center pb-1">
            <span
              class="text-xs font-bold text-gray-600 dark:text-gray-300 self-start sm:self-auto mb-1 sm:mb-0"
              >Breakdown by:</span
            >
            <ul
              class="flex flex-wrap font-medium text-xs text-gray-500 dark:text-gray-400 leading-5 pl-1 sm:pl-2"
            >
              ${this.goal.prop_names.map(this.renderPill.bind(this))}
            </ul>
          </div>
          ${this.renderBody()} ${this.renderLoading()}
        </div>
      `:a}};wt([r({type:Object})],xt.prototype,"onClickFunction",void 0),wt([r({type:Object})],xt.prototype,"goal",void 0),wt([r({type:String})],xt.prototype,"propKey",void 0),wt([r({type:String})],xt.prototype,"storageKey",void 0),wt([r({type:Boolean})],xt.prototype,"loading",void 0),wt([r({type:Number})],xt.prototype,"viewport",void 0),wt([r({type:Array})],xt.prototype,"breakdown",void 0),wt([r({type:Number})],xt.prototype,"page",void 0),wt([r({type:Boolean})],xt.prototype,"moreResultsAvailable",void 0),xt=wt([n("pl-prop-breakdown")],xt);var kt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let $t=class extends dt{constructor(){super(),this.loading=!1,this.viewport=1080,this.handleResize=this.handleResize.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this.handleResize,!1),this.handleResize(),this.timer&&this.timer.onTick(this.fetchConversions.bind(this))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this.handleResize,!1)}updated(t){if(super.updated(t),t.get("query")){const t=this.offsetHeight;this.loading=!0,this.prevHeight=t,this.fetchConversions()}}static get styles(){return[...super.styles,e`
        @media (max-width: 767px) {
          .mainContainer {
            max-width: calc(100vw - 32px);
          }

          .w-20 {
            width: 2.6rem;
          }

          pl-bar {
            max-width: 70%;
          }

          .padOnMobile {
            margin-right: 16px;
          }
        }

        pl-bar {
            max-width: 70%;
        }
      `]}handleResize(){this.viewport=window.innerWidth}firstUpdated(){this.fetchConversions()}getBarMaxWidth(){return this.viewport>767?"16rem":"10rem"}fetchConversions(){U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/conversions`,this.query).then((t=>{this.loading=!1,this.goals=t,this.prevHeight=void 0}))}getPlBackground(t){return this.highlightedGoals&&this.highlightedGoals.includes(t)?"bg-red-60":this.highlightedGoals?"bg-red-40":"bg-red-50"}renderGoal(t){const e=this.query.filters.goal==t.name&&t.prop_names;return o`
      <div class="my-2 text-sm" key=${t.name}>
        <div class="flex items-center justify-between my-2">
          <pl-bar
            .count="${t.unique_conversions}"
            .all="${this.goals}"
            bg="${this.getPlBackground(t.name)} dark:bg-gray-500 dark:bg-opacity-15"
            .maxWidthDeduction="${this.getBarMaxWidth()}"
            plot="unique_conversions"
          >
            <pl-link
              .to="${{search:lt("goal",t.name)}}"
              class="block px-2 py-1.5 hover:underline relative z-2 break-all lg:truncate dark:text-gray-200"
              >${this.t(t.name)}</pl-link
            >
          </pl-bar>
          <div class="dark:text-gray-200">
            <span class="inline-block w-20 font-medium text-right"
              >${x(t.unique_conversions)}</span
            >
            ${this.viewport&&this.viewport>767?o`<span class="inline-block w-20 font-medium text-right"
                  >${x(t.total_conversions)}</span
                >`:a}
            <span class="inline-block w-20 font-medium text-right"
              >${t.conversion_rate}%</span
            >
          </div>
        </div>
        ${e?o`<pl-prop-breakdown
              .site=${this.site}
              .query=${this.query}
              .goal=${t}
              .proxyUrl=${this.proxyUrl}
            ></pl-prop-breakdown>`:a}
      </div>
    `}renderInner(){return this.goals?o`
        <h3 class="font-bold dark:text-gray-100">
          ${this.title||this.t("Goal Conversions")}
        </h3>
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
        >
          <span>${this.t("Goal")}</span>
          <div class="text-right">
            <span class="inline-block w-20 padOnMobile">${this.t("Uniques")}</span>
            ${this.viewport&&this.viewport>767?o`<span class="inline-block w-20">${this.t("Total")}</span>`:a}
            <span class="inline-block w-20">CR</span>
          </div>
        </div>

        ${this.goals.map(this.renderGoal.bind(this))}
      `:o`<div class="mx-auto my-2 loading"><div></div></div>`}render(){return o`
      <div
        class="w-full p-4 bg-white rounded shadow-xl dark:bg-gray-825 mainContainer"
        .style="${{minHeight:"132px",height:this.prevHeight??"auto"}}"
        .ref=${this}
      >
        ${this.renderInner()}
      </div>
    `}};kt([r({type:Object})],$t.prototype,"onClickFunction",void 0),kt([r({type:Boolean})],$t.prototype,"loading",void 0),kt([r({type:Number})],$t.prototype,"viewport",void 0),kt([r({type:Number})],$t.prototype,"prevHeight",void 0),kt([r({type:Array})],$t.prototype,"goals",void 0),kt([r({type:Array})],$t.prototype,"highlightedGoals",void 0),$t=kt([n("pl-conversions")],$t);var Ct=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let _t=class extends V{static get styles(){return[...super.styles,e`
      span {
        text-transform: uppercase;
      }
    `]}render(){return this.list.length>0?o`
        <div hidden
          class="text-center w-full py-3 md:pb-3 md:pt-0 md:absolute md:bottom-0 md:left-0"
        >
          <pl-link
            .to=${this.url||`/${encodeURIComponent(this.site.domain)}/${this.endpoint}${window.location.search}`}
            class="leading-snug font-bold text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition tracking-wide"
          >
            <svg
              class="feather mr-1"
              style=${{marginTop:"-2px"}}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
              />
            </svg>
            <span>${this.t("details")}</span>
          </pl-link>
        </div>
      `:a}};Ct([r({type:String})],_t.prototype,"url",void 0),Ct([r({type:String})],_t.prototype,"endpoint",void 0),Ct([r({type:Object})],_t.prototype,"site",void 0),Ct([r({type:Array})],_t.prototype,"list",void 0),_t=Ct([n("pl-more-link")],_t);var Dt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let St=class extends dt{constructor(){super(...arguments),this.filter=void 0,this.loading=!1}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.fetchData.bind(this)),this.valueKey=this.valueKey||"visitors",this.showConversionRate=!!this.query.filters.goal}static get styles(){return[...super.styles,e`
        .externalLinkSvg {
          margin-top: 8px;
          margin-left: 6px;
        }
      `]}getExternalLink(t){if(this.externalLinkDest){const e=this.externalLinkDest(t);return o`
        <a
          target="_blank"
          rel="noreferrer"
          href=${e}
          class="group-hover:block"
        >
          <svg
            class="inline w-4 h-4 ml-1 -mt-1 text-gray-600 dark:text-gray-400 externalLinkSvg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
            ></path>
            <path
              d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
            ></path>
          </svg>
        </a>
      `}return a}firstUpdated(t){this.fetchData()}updated(t){super.updated(t),t.get("query")&&this.fetchData()}fetchData(){if(this.prevQuery!==this.query){this.prevQuery=this.query,this.loading=!0,this.list=void 0;try{this.fetchDataFunction().then((t=>{this.loading=!1,this.list=t}))}catch(t){console.error(t)}}}get label(){return"realtime"===this.query.period?this.t("Current visitors"):this.showConversionRate?this.t("Conversions"):this.valueLabel||this.t("Visitors")}renderListItem(t){const e=new URLSearchParams(window.location.search);Object.entries(this.filter).forEach((([r,i])=>{e.set(r,t[i])}));const r=this.showConversionRate?"10rem":"5rem",i=this.color||"bg-green-50";return o`
      <div
        class="flex items-center justify-between my-1 text-sm"
        key="${t.name}"
      >
        <pl-bar
          .count=${t[this.valueKey]}
          .all=${this.list}
          .bg=${`${i} dark:bg-gray-500 dark:bg-opacity-15`}
          maxWidthDeduction="${r}"
          .plot="${this.valueKey}"
        >
          <span
            class="flex px-2 py-1.5 group dark:text-gray-300 relative z-2 break-all"
            tooltip=${this.getTooltipText(t)}
          >
            <pl-link
              @click="${this.onClick||(()=>{})}"
              class="md:truncate block hover:underline"
              .to=${{search:e.toString()}}
            >
              ${this.renderIcon(t)} ${t.name}
            </pl-link>
            ${this.getExternalLink(t)}
          </span>
        </pl-bar>
        <span
          class="font-medium dark:text-gray-200 w-20 text-right"
          tooltip=${t[this.valueKey]}
        >
          ${x(t[this.valueKey])}
          ${t.percentage>=0?o`<span class="inline-block w-8 pl-1 text-xs text-right"
                >(${t.percentage}%)</span
              >`:a}
        </span>
        ${this.showConversionRate?o`<span class="font-medium dark:text-gray-200 w-20 text-right"
              >${t.conversion_rate}%</span
            >`:a}
      </div>
    `}renderList(){return this.list&&this.list.length>0?o`
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
        >
          <span>${this.keyLabel}</span>
          <span class="text-right">
            <span class="inline-block w-30">${this.label}</span>
            ${this.showConversionRate?o`<span class="inline-block w-20">CR</span>`:a}
          </span>
        </div>
        ${this.list.map((t=>this.renderListItem(t)))}
      `:a}render(){return o`
      <div class="flex flex-col flex-grow">
        ${this.loading?o`<div class="mx-auto loading mt-44"><div></div></div>`:a}
        <div class="flex-grow">${this.renderList()}</div>
        ${this.detailsLink&&this.list?o`<pl-more-link
              .url=${this.detailsLink}
              .list=${this.list}
            ></pl-more-link>`:a}
      </div>
    `}};Dt([r({type:Object})],St.prototype,"prevQuery",void 0),Dt([r({type:String})],St.prototype,"tabKey",void 0),Dt([r({type:String})],St.prototype,"valueKey",void 0),Dt([r({type:String})],St.prototype,"keyLabel",void 0),Dt([r({type:String})],St.prototype,"color",void 0),Dt([r({type:String})],St.prototype,"valueLabel",void 0),Dt([r({type:String})],St.prototype,"storedTab",void 0),Dt([r({type:Object})],St.prototype,"externalLinkDest",void 0),Dt([r({type:Boolean})],St.prototype,"showConversionRate",void 0),Dt([r({type:String})],St.prototype,"detailsLink",void 0),Dt([r({type:Object})],St.prototype,"onClick",void 0),Dt([r({type:Object})],St.prototype,"fetchDataFunction",void 0),Dt([r({type:Object})],St.prototype,"filter",void 0),Dt([r({type:Array})],St.prototype,"list",void 0),Dt([r({type:Boolean})],St.prototype,"loading",void 0),St=Dt([n("pl-list-report")],St);var Mt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};class Tt extends dt{connectedCallback(){super.connectedCallback()}fetchData(){return U(this.proxyUrl,at(this.site,this.pagePath),this.query,{limit:9})}externalLinkDest(t){return function(t,e){return new URL(`https://${t}`),`https://${window.location.hostname}${e}`}(this.site.domain,t.name)}}Mt([r({type:String})],Tt.prototype,"pagePath",void 0);var Et=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let At=class extends Tt{constructor(){super(),this.pagePath="/pages"}render(){return o`
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{entry_page:"name"}}
        .keyLabel=${this.t("Page")}
        .timer="${this.timer}"
        .proxyUrl="${this.proxyUrl}"
        .detailsLink=${st(this.site,this.pagePath)}
        .query=${this.query}
        .pagePath="${this.pagePath}"
        .site="${this.site}"
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `}};At=Et([n("pl-top-pages")],At);var Ot=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let It=class extends Tt{constructor(){super(),this.pagePath="/entry-pages"}render(){return o`
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{entry_page:"name"}}
        .keyLabel=${this.t("Entry page")}
        .proxyUrl="${this.proxyUrl}"
        .valueLabel=${this.t("Unique Entrances")}
        valueKey="unique_entrances"
        .pagePath="${this.pagePath}"
        .timer="${this.timer}"
        .site="${this.site}"
        .detailsLink=${st(this.site,this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `}};It=Ot([n("pl-entry-pages")],It);var Pt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let jt=class extends Tt{constructor(){super(),this.pagePath="/exit-pages"}render(){return o`
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{entry_page:"name"}}
        .keyLabel="${this.t("Exit page")}"
        .proxyUrl="${this.proxyUrl}"
        .valueLabel=${this.t("Unique Exits")}
        valueKey="unique_exits"
        .pagePath="${this.pagePath}"
        .site="${this.site}"
        .timer="${this.timer}"
        .detailsLink=${st(this.site,this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `}};jt=Pt([n("pl-exit-pages")],jt);var qt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Nt=class extends dt{constructor(){super(...arguments),this.labelFor={pages:"Top Pages","entry-pages":"Entry Pages","exit-pages":"Exit Pages"}}connectedCallback(){super.connectedCallback(),this.tabKey=`pageTab__${this.site.domain}`,this.mode=this.storedTab||"pages"}setMode(t){B(this.tabKey,t),this.mode=t}renderContent(){switch(this.mode){case"entry-pages":return o`<pl-entry-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-entry-pages>`;case"exit-pages":return o`<pl-exit-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-exit-pages>`;default:return o`<pl-top-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-top-pages>`}}renderPill(t,e){return this.mode===e?o`
        <li
          class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading"
        >
          ${this.t(t)}
        </li>
      `:o`
        <li
          class="hover:text-indigo-600 cursor-pointer"
          @click=${()=>this.setMode(e)}
        >
          ${this.t(t)}
        </li>
      `}render(){return this.site?o`
        <div
          class="stats-item flex flex-col w-full mt-6 stats-item--has-header"
        >
          <div
            class="stats-item-header flex flex-col flex-grow bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
          >
            <div class="w-full flex justify-between" style="max-height: 40px !important">
              <h3 class="font-bold dark:text-gray-100">
                ${this.t(this.labelFor[this.mode])||this.t("Page Visits")}
              </h3>
              <div class="flex"></div>
              <ul
                class="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2"
              >
                ${this.renderPill("Top Pages","pages")}
                ${this.renderPill("Entry Pages","entry-pages")}
                ${this.renderPill("Exit Pages","exit-pages")}
              </ul>
            </div>
            ${this.renderContent()}
          </div>
        </div>
      `:a}};qt([r({type:String})],Nt.prototype,"tabKey",void 0),qt([r({type:String})],Nt.prototype,"storedTab",void 0),qt([r({type:String})],Nt.prototype,"mode",void 0),Nt=qt([n("pl-pages")],Nt);const Lt=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
</svg>`,Rt=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
</svg>`,Ut=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg>`,Ft=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
</svg>`,zt=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg>`;var Bt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};const Ht={utm_medium:{label:"UTM Medium",shortLabel:"UTM Medium",endpoint:"utm_mediums"},utm_source:{label:"UTM Source",shortLabel:"UTM Source",endpoint:"utm_sources"},utm_campaign:{label:"UTM Campaign",shortLabel:"UTM Campai",endpoint:"utm_campaigns"},utm_content:{label:"UTM Content",shortLabel:"UTM Conten",endpoint:"utm_contents"},utm_term:{label:"UTM Term",shortLabel:"UTM Term",endpoint:"utm_terms"}};class Yt extends dt{constructor(){super(...arguments),this.loading=!1,this.open=!1,this.alwaysShowNoRef=!1}fetchReferrers(){}updated(t){t.has("tab")&&this.fire("tab-changed",this.tab),(t.has("tab")||t.get("query"))&&this.fetchReferrers()}toggleOpen(){this.open=!this.open}get label(){return"realtime"===this.query.period?this.t("Current visitors"):this.showConversionRate?this.t("Conversions"):this.t("Visitors")}get showConversionRate(){return!!this.query.filters?.goal}get showNoRef(){return this.alwaysShowNoRef||"realtime"===this.query.period}setTab(t){this.tab=t,this.open=!1}faviconUrl(t){return this.proxyFaviconBaseUrl?`${this.proxyFaviconBaseUrl}${encodeURIComponent(t)}`:`/favicon/sources/${encodeURIComponent(t)}`}static get styles(){return[...super.styles,e`

    `]}setAllTab(){this.fire("tab-changed","all"),this.open=!1}renderTabs(){const t="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading truncate text-left",e="hover:text-indigo-600 cursor-pointer truncate text-left";let r=Ht[this.tab]?this.t(Ht[this.tab].label):this.t("UTM");return o`
      <div
        class="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2"
      >
        <div
          class=${"all"===this.tab?t:e}
          @click=${this.setAllTab}
        >
          ${this.t("All")}
        </div>

        <div class="relative inline-block text-left">
          <div>
            <div
              class="inline-flex justify-between focus:outline-none"
              @click="${this.toggleOpen}"
            >
              <span
                style="width: ${"UTM"==r?"1.8rem":"4.5rem"}"
                class="${this.tab.startsWith("utm_")?t:e}"
                >${r}</span
              >
              <div class="-mr-1 ml-px h-4 w-4" aria-hidden="true">
                ${zt}
              </div>
            </div>
          </div>

          <div
            ?hidden="${!this.open}"
            class="text-left origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          >
            <div class="py-1">
              ${["utm_medium","utm_source","utm_campaign","utm_term","utm_content"].map((t=>o`<span
                  @click="${()=>this.setTab(t)}"
                  class="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm ${this.tab===t?"font-bold":""}"
                >
                  ${this.t(Ht[t].label)}
                </span>`))}
            </div>
          </div>
        </div>
      </div>
    `}}Bt([r({type:String})],Yt.prototype,"tab",void 0),Bt([r({type:Array})],Yt.prototype,"referrers",void 0),Bt([r({type:Boolean})],Yt.prototype,"loading",void 0),Bt([r({type:Boolean})],Yt.prototype,"open",void 0),Bt([r({type:Boolean})],Yt.prototype,"alwaysShowNoRef",void 0);var Wt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Vt=class extends i{constructor(){super(...arguments),this.show=!1}render(){return o`
      <div
        class="${`${this.myClassName||""} ${this.show?"fade-enter-active":"fade-enter"}`}"
      >
        <slot></slot>
      </div>
    `}};Wt([r({type:Boolean})],Vt.prototype,"show",void 0),Wt([r({type:String})],Vt.prototype,"myClassName",void 0),Vt=Wt([n("pl-fade-in")],Vt);var Gt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Kt=class extends Yt{constructor(){super(...arguments),this.to=void 0}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.fetchReferrers.bind(this))}fetchReferrers(){this.loading=!0,this.referrers=void 0,U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/sources`,this.query,{show_noref:this.showNoRef}).then((t=>{this.loading=!1,this.referrers=t}))}static get styles(){return[...super.styles,e`
      .directNoneIcon {
        margin-right: 28px;
      }
    `]}renderReferrer(t){const e=this.showConversionRate?"10rem":"5rem";let r;return t.name&&(r=this.t(t.name)),o`
      <div
        class="flex items-center justify-between my-1 text-sm"
        key=${t.name}
      >
        <pl-bar
          .count=${t.visitors}
          .all=${this.referrers}
          bg="bg-blue-50 dark:bg-gray-500 dark:bg-opacity-15 faviconMargin"
          .maxWidthDeduction=${e}
        >
          <span
            class="flex px-2 py-1.5 dark:text-gray-300 relative z-2 break-all"
          >
            <pl-link
              class="md:truncate block hover:underline"
              .to=${{search:lt("source",t.name)}}
            >
            ${"Direct / None"!==t.name?o`
              <img
                  src=${this.faviconUrl(t.name)}
                  class="inline w-4 h-4 mr-2 -mt-px align-middle"
                />
            `:o`
              <div class="inline w-4 h-4 mr-2 -mt-px align-middle directNoneIcon"></div>
            `}
              ${r}
            </pl-link>
          </span>
        </pl-bar>
        <span
          class="font-medium dark:text-gray-200 w-20 text-right"
          tooltip="${t.visitors}"
          >${x(t.visitors)}</span
        >
        ${this.showConversionRate?o`<span class="font-medium dark:text-gray-200 w-20 text-right"
              >${t.conversion_rate}%</span
            >`:a}
      </div>
    `}renderList(){return this.referrers&&this.referrers.length>0?o`
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500"
        >
          <span>${this.t("Source")}</span>
          <div class="text-right">
            <span class="inline-block w-20">${this.label}</span>
            ${this.showConversionRate?o`<span class="inline-block w-20">CR</span>`:a}
          </div>
        </div>

        <div class="flex-grow">
          ${this.referrers.map((t=>this.renderReferrer(t)))}
        </div>

        <pl-more-link
          .site=${this.site}
          .list=${this.referrers}
          endpoint="sources"
        ></pl-more-link>
      `:o`
        <div class="font-medium text-center text-gray-500 mt-44">
          No data yet
        </div>
      `}renderContent(){return o`
      <div class="flex flex-col flex-grow">
        <div id="sources" class="justify-between w-full flex">
          <h3 class="font-bold dark:text-gray-100">${this.t("Top Sources")}</h3>
          ${this.renderTabs()}
        </div>
        ${this.loading?o`<div class="mx-auto loading mt-44">
              <div></div>
            </div>`:a}
        <pl-fade-in .show="${!this.loading}" class="flex flex-col flex-grow">
          ${this.renderList()}
        </pl-fade-in>
      </div>
    `}render(){return o`
      <div
        class="relative p-4 bg-white rounded shadow-xl stats-item flex flex-col mt-6 w-full dark:bg-gray-825"
      >
        ${this.renderContent()}
      </div>
    `}};Gt([r({type:String})],Kt.prototype,"to",void 0),Kt=Gt([n("pl-sources-all")],Kt);var Xt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Jt=class extends Yt{constructor(){super(...arguments),this.to=void 0}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.fetchReferrers.bind(this))}fetchReferrers(){const t=Ht[this.tab].endpoint;this.loading=!0,this.referrers=void 0,U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/${t}`,this.query,{show_noref:this.showNoRef}).then((t=>{this.loading=!1,this.referrers=t}))}renderReferrer(t){const e=this.showConversionRate?"10rem":"5rem";return o`
          <div
        class="flex items-center justify-between my-1 text-sm"
        key=${t.name}
      >
        <pl-bar
          .count=${t.visitors}
          .all=${this.referrers}
          bg="bg-blue-50 dark:bg-gray-500 dark:bg-opacity-15"
          .maxWidthDeduction=${e}
        >

          <span class="flex px-2 py-1.5 dark:text-gray-300 relative z-2 break-all">
            <pl-link
              class="md:truncate block hover:underline"
              .to=${{search:lt(this.tab,t.name)}}
            >
              ${t.name}
           </pl-link>
          </span>
        </pl-bar>
        <span class="font-medium dark:text-gray-200 w-20 text-right" tooltip=${t.visitors}>${x(t.visitors)}</span>
        ${this.showConversionRate?o`<span class="font-medium dark:text-gray-200 w-20 text-right"
                >${t.conversion_rate}%</span
              >`:a}
      </div>

    `}renderList(){return this.referrers&&this.referrers.length>0?o`
        <div class="flex flex-col flex-grow">
          <div
            class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
          >
            <span>${Ht[this.tab].label}</span>
            <div class="text-right">
              <span class="inline-block w-20">${this.label}</span>
              ${this.showConversionRate?o`<span class="inline-block w-20">CR</span>`:a}
            </div>
          </div>

          <div class="flex-grow">
            ${this.referrers.map((t=>this.renderReferrer(t)))}
          </div>
          <pl-more-link
            .site=${this.site}
            .list=${this.referrers}
            .endpoint=${Ht[this.tab].endpoint}
          ></pl-more-link>
        </div>
      `:o`<div
        class="font-medium text-center text-gray-500 mt-44 dark:text-gray-400"
      >
        No data yet
      </div>`}renderContent(){return o`
      <div class="flex justify-between w-full">
        <h3 class="font-bold dark:text-gray-100">${this.t("Top Sources")}</h3>
        ${this.renderTabs()}
      </div>
      ${this.loading?o` <div class="mx-auto loading mt-44"><div></div></div>
            }`:a}

      <pl-fade-in ?show="${!this.loading}" class="flex flex-col flex-grow">
        ${this.renderList()}
       </pl-fade-in>
    `}render(){return o`
      <div
        class="relative p-4 bg-white rounded shadow-xl stats-item flex flex-col dark:bg-gray-825 mt-6 w-full"
      >
        ${this.renderContent()}
      </div>
    `}};Xt([r({type:String})],Jt.prototype,"to",void 0),Jt=Xt([n("pl-sources-utm")],Jt);var Zt=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Qt=class extends Kt{fetchReferrers(){this.loading=!0,this.referrers=void 0,U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/referrers/${encodeURIComponent(this.query.filters.source)}`,this.query,{show_noref:this.showNoRef}).then((t=>{this.loading=!1,this.referrers=t}))}};Qt=Zt([n("pl-sources-referrers")],Qt);var te=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let ee=class extends dt{constructor(){super(...arguments),this.alwaysShowNoRef=!1}connectedCallback(){super.connectedCallback(),this.tabKey="sourceTab__"+this.site.domain;const t=H(this.tabKey);this.tab=t||"all"}tabChanged(t){this.tab=t.detail,this.tab&&B(this.tabKey,this.tab)}render(){return this.query.filters.source&&"Direct / None"!==this.query.filters.source?o`
        <pl-sources-referrers
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .alwaysShowNoRef="${this.alwaysShowNoRef}"
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-referrers>
      `:"all"===this.tab?o`
        <pl-sources-all
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .alwaysShowNoRef="${this.alwaysShowNoRef}"
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-all>
      `:o`
        <pl-sources-utm
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-utm>
      `}};te([r({type:String})],ee.prototype,"tabKey",void 0),te([r({type:String})],ee.prototype,"tab",void 0),te([r({type:Boolean})],ee.prototype,"alwaysShowNoRef",void 0),ee=te([n("pl-sources-list")],ee);var re=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};const ie={Mobile:"up to 576px",Tablet:"576px to 992px",Laptop:"992px to 1440px",Desktop:"above 1440px"};let ne=class extends dt{connectedCallback(){super.connectedCallback(),this.tabKey=`pageTab__${this.site.domain}`,this.mode=this.storedTab||"browser"}setMode(t){B(this.tabKey,t),this.mode=t}renderBrowsers(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/browsers"),this.query)}
        .filter=${{browser:"name"}}
        .timer="${this.timer}"
        .keyLabel="${this.t("Browser")}"
        .query=${this.query}
      ></pl-list-report>
    `}renderBrowserVersions(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/browser-versions"),this.query)}
        .timer="${this.timer}"
        .filter=${{browser_version:"name"}}
        .keyLabel=${this.query.filters.browser+` ${this.t("version")}`}
        .query=${this.query}
      ></pl-list-report>
    `}renderOperatingSystems(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/operating-systems"),this.query)}
        .timer="${this.timer}"
        .filter=${{os:"name"}}
        .keyLabel=${this.t("Operating system")}
        .query=${this.query}
      ></pl-list-report>
    `}renderOperatingSystemVersions(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/operating-system-versions"),this.query)}
        .timer="${this.timer}"
        .filter=${{os_version:"name"}}
        .keyLabel=${this.query.filters.os+` ${this.t("version")}`}
        .query=${this.query}
      ></pl-list-report>
    `}renderScreenSizes(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/screen-sizes"),this.query)}
        .filter=${{screen:"name"}}
        .keyLabel=${this.t("Screen size")}
        .timer="${this.timer}"
        .query=${this.query}
        .renderIcon=${t=>this.iconFor(t.name)}
        .tooltipText=${t=>ie[t.name]}
      ></pl-list-report>
    `}iconFor(t){return"Mobile"===t?o`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
      `:"Tablet"===t?o`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            ry="2"
            transform="rotate(180 12 12)"
          />
          <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
      `:"Laptop"===t?o`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      `:"Desktop"===t?o`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="-mt-px feather"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      `:a}renderContent(){switch(this.mode){case"browser":return this.query.filters.browser?this.renderBrowserVersions():this.renderBrowsers();case"os":return this.query.filters.os?this.renderOperatingSystemVersions():this.renderOperatingSystems();default:return this.renderScreenSizes()}}renderPill(t,e){return this.mode===e?o`
        <li
          class="inline-block h-5 font-bold text-indigo-700 active-prop-heading dark:text-indigo-500"
        >
          ${this.t(t)}
        </li>
      `:o`
        <li
          class="cursor-pointer hover:text-indigo-600"
          @click=${()=>this.setMode(e)}
        >
          ${this.t(t)}
        </li>
      `}render(){return o`
      <div class="stats-item flex flex-col mt-6 stats-item--has-header w-full">
        <div
          class="stats-item-header flex flex-col flex-grow relative p-4 bg-white rounded shadow-xl dark:bg-gray-825"
        >
          <div class="flex justify-between w-full">
            <h3 class="font-bold dark:text-gray-100">${this.t("Devices")}</h3>
            <ul
              class="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2"
            >
              ${this.renderPill("Size","size")}
              ${this.renderPill("Browser","browser")}
              ${this.renderPill("OS","os")}
            </ul>
          </div>
          ${this.renderContent()}
        </div>
      </div>
    `}};function oe(t,e){return null==t||null==e?NaN:t<e?-1:t>e?1:t>=e?0:NaN}function ae(t,e){return null==t||null==e?NaN:e<t?-1:e>t?1:e>=t?0:NaN}function se(t){let e,r,i;function n(t,i,n=0,o=t.length){if(n<o){if(0!==e(i,i))return o;do{const e=n+o>>>1;r(t[e],i)<0?n=e+1:o=e}while(n<o)}return n}return 2!==t.length?(e=oe,r=(e,r)=>oe(t(e),r),i=(e,r)=>t(e)-r):(e=t===oe||t===ae?t:le,r=t,i=t),{left:n,center:function(t,e,r=0,o=t.length){const a=n(t,e,r,o-1);return a>r&&i(t[a-1],e)>-i(t[a],e)?a-1:a},right:function(t,i,n=0,o=t.length){if(n<o){if(0!==e(i,i))return o;do{const e=n+o>>>1;r(t[e],i)<=0?n=e+1:o=e}while(n<o)}return n}}}function le(){return 0}re([r({type:String})],ne.prototype,"tabKey",void 0),re([r({type:String})],ne.prototype,"storedTab",void 0),re([r({type:String})],ne.prototype,"mode",void 0),ne=re([n("pl-devices")],ne);const ce=se(oe).right;se((function(t){return null===t?NaN:+t})).center;class de{constructor(){this._partials=new Float64Array(32),this._n=0}add(t){const e=this._partials;let r=0;for(let i=0;i<this._n&&i<32;i++){const n=e[i],o=t+n,a=Math.abs(t)<Math.abs(n)?t-(o-n):n-(o-t);a&&(e[r++]=a),t=o}return e[r]=t,this._n=r+1,this}valueOf(){const t=this._partials;let e,r,i,n=this._n,o=0;if(n>0){for(o=t[--n];n>0&&(e=o,r=t[--n],o=e+r,i=r-(o-e),!i););n>0&&(i<0&&t[n-1]<0||i>0&&t[n-1]>0)&&(r=2*i,e=o+r,r==e-o&&(o=e))}return o}}const pe=Math.sqrt(50),he=Math.sqrt(10),ue=Math.sqrt(2);function ge(t,e,r){const i=(e-t)/Math.max(0,r),n=Math.floor(Math.log10(i)),o=i/Math.pow(10,n),a=o>=pe?10:o>=he?5:o>=ue?2:1;let s,l,c;return n<0?(c=Math.pow(10,-n)/a,s=Math.round(t*c),l=Math.round(e*c),s/c<t&&++s,l/c>e&&--l,c=-c):(c=Math.pow(10,n)*a,s=Math.round(t/c),l=Math.round(e/c),s*c<t&&++s,l*c>e&&--l),l<s&&.5<=r&&r<2?ge(t,e,2*r):[s,l,c]}function me(t,e,r){return ge(t=+t,e=+e,r=+r)[2]}function fe(t){return Array.from(function*(t){for(const e of t)yield*e}(t))}var ye={value:()=>{}};function ve(){for(var t,e=0,r=arguments.length,i={};e<r;++e){if(!(t=arguments[e]+"")||t in i||/[\s.]/.test(t))throw new Error("illegal type: "+t);i[t]=[]}return new be(i)}function be(t){this._=t}function we(t,e){for(var r,i=0,n=t.length;i<n;++i)if((r=t[i]).name===e)return r.value}function xe(t,e,r){for(var i=0,n=t.length;i<n;++i)if(t[i].name===e){t[i]=ye,t=t.slice(0,i).concat(t.slice(i+1));break}return null!=r&&t.push({name:e,value:r}),t}be.prototype=ve.prototype={constructor:be,on:function(t,e){var r,i,n=this._,o=(i=n,(t+"").trim().split(/^|\s+/).map((function(t){var e="",r=t.indexOf(".");if(r>=0&&(e=t.slice(r+1),t=t.slice(0,r)),t&&!i.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}}))),a=-1,s=o.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++a<s;)if(r=(t=o[a]).type)n[r]=xe(n[r],t.name,e);else if(null==e)for(r in n)n[r]=xe(n[r],t.name,null);return this}for(;++a<s;)if((r=(t=o[a]).type)&&(r=we(n[r],t.name)))return r},copy:function(){var t={},e=this._;for(var r in e)t[r]=e[r].slice();return new be(t)},call:function(t,e){if((r=arguments.length-2)>0)for(var r,i,n=new Array(r),o=0;o<r;++o)n[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=0,r=(i=this._[t]).length;o<r;++o)i[o].value.apply(e,n)},apply:function(t,e,r){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var i=this._[t],n=0,o=i.length;n<o;++n)i[n].value.apply(e,r)}};var ke="http://www.w3.org/1999/xhtml",$e={svg:"http://www.w3.org/2000/svg",xhtml:ke,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function Ce(t){var e=t+="",r=e.indexOf(":");return r>=0&&"xmlns"!==(e=t.slice(0,r))&&(t=t.slice(r+1)),$e.hasOwnProperty(e)?{space:$e[e],local:t}:t}function _e(t){return function(){var e=this.ownerDocument,r=this.namespaceURI;return r===ke&&e.documentElement.namespaceURI===ke?e.createElement(t):e.createElementNS(r,t)}}function De(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function Se(t){var e=Ce(t);return(e.local?De:_e)(e)}function Me(){}function Te(t){return null==t?Me:function(){return this.querySelector(t)}}function Ee(){return[]}function Ae(t){return null==t?Ee:function(){return this.querySelectorAll(t)}}function Oe(t){return function(){return function(t){return null==t?[]:Array.isArray(t)?t:Array.from(t)}(t.apply(this,arguments))}}function Ie(t){return function(){return this.matches(t)}}function Pe(t){return function(e){return e.matches(t)}}var je=Array.prototype.find;function qe(){return this.firstElementChild}var Ne=Array.prototype.filter;function Le(){return Array.from(this.children)}function Re(t){return new Array(t.length)}function Ue(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e}function Fe(t,e,r,i,n,o){for(var a,s=0,l=e.length,c=o.length;s<c;++s)(a=e[s])?(a.__data__=o[s],i[s]=a):r[s]=new Ue(t,o[s]);for(;s<l;++s)(a=e[s])&&(n[s]=a)}function ze(t,e,r,i,n,o,a){var s,l,c,d=new Map,p=e.length,h=o.length,u=new Array(p);for(s=0;s<p;++s)(l=e[s])&&(u[s]=c=a.call(l,l.__data__,s,e)+"",d.has(c)?n[s]=l:d.set(c,l));for(s=0;s<h;++s)c=a.call(t,o[s],s,o)+"",(l=d.get(c))?(i[s]=l,l.__data__=o[s],d.delete(c)):r[s]=new Ue(t,o[s]);for(s=0;s<p;++s)(l=e[s])&&d.get(u[s])===l&&(n[s]=l)}function Be(t){return t.__data__}function He(t){return"object"==typeof t&&"length"in t?t:Array.from(t)}function Ye(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function We(t){return function(){this.removeAttribute(t)}}function Ve(t){return function(){this.removeAttributeNS(t.space,t.local)}}function Ge(t,e){return function(){this.setAttribute(t,e)}}function Ke(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function Xe(t,e){return function(){var r=e.apply(this,arguments);null==r?this.removeAttribute(t):this.setAttribute(t,r)}}function Je(t,e){return function(){var r=e.apply(this,arguments);null==r?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,r)}}function Ze(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function Qe(t){return function(){this.style.removeProperty(t)}}function tr(t,e,r){return function(){this.style.setProperty(t,e,r)}}function er(t,e,r){return function(){var i=e.apply(this,arguments);null==i?this.style.removeProperty(t):this.style.setProperty(t,i,r)}}function rr(t,e){return t.style.getPropertyValue(e)||Ze(t).getComputedStyle(t,null).getPropertyValue(e)}function ir(t){return function(){delete this[t]}}function nr(t,e){return function(){this[t]=e}}function or(t,e){return function(){var r=e.apply(this,arguments);null==r?delete this[t]:this[t]=r}}function ar(t){return t.trim().split(/^|\s+/)}function sr(t){return t.classList||new lr(t)}function lr(t){this._node=t,this._names=ar(t.getAttribute("class")||"")}function cr(t,e){for(var r=sr(t),i=-1,n=e.length;++i<n;)r.add(e[i])}function dr(t,e){for(var r=sr(t),i=-1,n=e.length;++i<n;)r.remove(e[i])}function pr(t){return function(){cr(this,t)}}function hr(t){return function(){dr(this,t)}}function ur(t,e){return function(){(e.apply(this,arguments)?cr:dr)(this,t)}}function gr(){this.textContent=""}function mr(t){return function(){this.textContent=t}}function fr(t){return function(){var e=t.apply(this,arguments);this.textContent=null==e?"":e}}function yr(){this.innerHTML=""}function vr(t){return function(){this.innerHTML=t}}function br(t){return function(){var e=t.apply(this,arguments);this.innerHTML=null==e?"":e}}function wr(){this.nextSibling&&this.parentNode.appendChild(this)}function xr(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function kr(){return null}function $r(){var t=this.parentNode;t&&t.removeChild(this)}function Cr(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function _r(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Dr(t){return function(){var e=this.__on;if(e){for(var r,i=0,n=-1,o=e.length;i<o;++i)r=e[i],t.type&&r.type!==t.type||r.name!==t.name?e[++n]=r:this.removeEventListener(r.type,r.listener,r.options);++n?e.length=n:delete this.__on}}}function Sr(t,e,r){return function(){var i,n=this.__on,o=function(t){return function(e){t.call(this,e,this.__data__)}}(e);if(n)for(var a=0,s=n.length;a<s;++a)if((i=n[a]).type===t.type&&i.name===t.name)return this.removeEventListener(i.type,i.listener,i.options),this.addEventListener(i.type,i.listener=o,i.options=r),void(i.value=e);this.addEventListener(t.type,o,r),i={type:t.type,name:t.name,value:e,listener:o,options:r},n?n.push(i):this.__on=[i]}}function Mr(t,e,r){var i=Ze(t),n=i.CustomEvent;"function"==typeof n?n=new n(e,r):(n=i.document.createEvent("Event"),r?(n.initEvent(e,r.bubbles,r.cancelable),n.detail=r.detail):n.initEvent(e,!1,!1)),t.dispatchEvent(n)}function Tr(t,e){return function(){return Mr(this,t,e)}}function Er(t,e){return function(){return Mr(this,t,e.apply(this,arguments))}}Ue.prototype={constructor:Ue,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}},lr.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var Ar=[null];function Or(t,e){this._groups=t,this._parents=e}function Ir(){return new Or([[document.documentElement]],Ar)}function Pr(t){return"string"==typeof t?new Or([[document.querySelector(t)]],[document.documentElement]):new Or([[t]],Ar)}function jr(t,e,r){t.prototype=e.prototype=r,r.constructor=t}function qr(t,e){var r=Object.create(t.prototype);for(var i in e)r[i]=e[i];return r}function Nr(){}Or.prototype=Ir.prototype={constructor:Or,select:function(t){"function"!=typeof t&&(t=Te(t));for(var e=this._groups,r=e.length,i=new Array(r),n=0;n<r;++n)for(var o,a,s=e[n],l=s.length,c=i[n]=new Array(l),d=0;d<l;++d)(o=s[d])&&(a=t.call(o,o.__data__,d,s))&&("__data__"in o&&(a.__data__=o.__data__),c[d]=a);return new Or(i,this._parents)},selectAll:function(t){t="function"==typeof t?Oe(t):Ae(t);for(var e=this._groups,r=e.length,i=[],n=[],o=0;o<r;++o)for(var a,s=e[o],l=s.length,c=0;c<l;++c)(a=s[c])&&(i.push(t.call(a,a.__data__,c,s)),n.push(a));return new Or(i,n)},selectChild:function(t){return this.select(null==t?qe:function(t){return function(){return je.call(this.children,t)}}("function"==typeof t?t:Pe(t)))},selectChildren:function(t){return this.selectAll(null==t?Le:function(t){return function(){return Ne.call(this.children,t)}}("function"==typeof t?t:Pe(t)))},filter:function(t){"function"!=typeof t&&(t=Ie(t));for(var e=this._groups,r=e.length,i=new Array(r),n=0;n<r;++n)for(var o,a=e[n],s=a.length,l=i[n]=[],c=0;c<s;++c)(o=a[c])&&t.call(o,o.__data__,c,a)&&l.push(o);return new Or(i,this._parents)},data:function(t,e){if(!arguments.length)return Array.from(this,Be);var r=e?ze:Fe,i=this._parents,n=this._groups;"function"!=typeof t&&(t=function(t){return function(){return t}}(t));for(var o=n.length,a=new Array(o),s=new Array(o),l=new Array(o),c=0;c<o;++c){var d=i[c],p=n[c],h=p.length,u=He(t.call(d,d&&d.__data__,c,i)),g=u.length,m=s[c]=new Array(g),f=a[c]=new Array(g);r(d,p,m,f,l[c]=new Array(h),u,e);for(var y,v,b=0,w=0;b<g;++b)if(y=m[b]){for(b>=w&&(w=b+1);!(v=f[w])&&++w<g;);y._next=v||null}}return(a=new Or(a,i))._enter=s,a._exit=l,a},enter:function(){return new Or(this._enter||this._groups.map(Re),this._parents)},exit:function(){return new Or(this._exit||this._groups.map(Re),this._parents)},join:function(t,e,r){var i=this.enter(),n=this,o=this.exit();return"function"==typeof t?(i=t(i))&&(i=i.selection()):i=i.append(t+""),null!=e&&(n=e(n))&&(n=n.selection()),null==r?o.remove():r(o),i&&n?i.merge(n).order():n},merge:function(t){for(var e=t.selection?t.selection():t,r=this._groups,i=e._groups,n=r.length,o=i.length,a=Math.min(n,o),s=new Array(n),l=0;l<a;++l)for(var c,d=r[l],p=i[l],h=d.length,u=s[l]=new Array(h),g=0;g<h;++g)(c=d[g]||p[g])&&(u[g]=c);for(;l<n;++l)s[l]=r[l];return new Or(s,this._parents)},selection:function(){return this},order:function(){for(var t=this._groups,e=-1,r=t.length;++e<r;)for(var i,n=t[e],o=n.length-1,a=n[o];--o>=0;)(i=n[o])&&(a&&4^i.compareDocumentPosition(a)&&a.parentNode.insertBefore(i,a),a=i);return this},sort:function(t){function e(e,r){return e&&r?t(e.__data__,r.__data__):!e-!r}t||(t=Ye);for(var r=this._groups,i=r.length,n=new Array(i),o=0;o<i;++o){for(var a,s=r[o],l=s.length,c=n[o]=new Array(l),d=0;d<l;++d)(a=s[d])&&(c[d]=a);c.sort(e)}return new Or(n,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){return Array.from(this)},node:function(){for(var t=this._groups,e=0,r=t.length;e<r;++e)for(var i=t[e],n=0,o=i.length;n<o;++n){var a=i[n];if(a)return a}return null},size:function(){let t=0;for(const e of this)++t;return t},empty:function(){return!this.node()},each:function(t){for(var e=this._groups,r=0,i=e.length;r<i;++r)for(var n,o=e[r],a=0,s=o.length;a<s;++a)(n=o[a])&&t.call(n,n.__data__,a,o);return this},attr:function(t,e){var r=Ce(t);if(arguments.length<2){var i=this.node();return r.local?i.getAttributeNS(r.space,r.local):i.getAttribute(r)}return this.each((null==e?r.local?Ve:We:"function"==typeof e?r.local?Je:Xe:r.local?Ke:Ge)(r,e))},style:function(t,e,r){return arguments.length>1?this.each((null==e?Qe:"function"==typeof e?er:tr)(t,e,null==r?"":r)):rr(this.node(),t)},property:function(t,e){return arguments.length>1?this.each((null==e?ir:"function"==typeof e?or:nr)(t,e)):this.node()[t]},classed:function(t,e){var r=ar(t+"");if(arguments.length<2){for(var i=sr(this.node()),n=-1,o=r.length;++n<o;)if(!i.contains(r[n]))return!1;return!0}return this.each(("function"==typeof e?ur:e?pr:hr)(r,e))},text:function(t){return arguments.length?this.each(null==t?gr:("function"==typeof t?fr:mr)(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?yr:("function"==typeof t?br:vr)(t)):this.node().innerHTML},raise:function(){return this.each(wr)},lower:function(){return this.each(xr)},append:function(t){var e="function"==typeof t?t:Se(t);return this.select((function(){return this.appendChild(e.apply(this,arguments))}))},insert:function(t,e){var r="function"==typeof t?t:Se(t),i=null==e?kr:"function"==typeof e?e:Te(e);return this.select((function(){return this.insertBefore(r.apply(this,arguments),i.apply(this,arguments)||null)}))},remove:function(){return this.each($r)},clone:function(t){return this.select(t?_r:Cr)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,e,r){var i,n,o=function(t){return t.trim().split(/^|\s+/).map((function(t){var e="",r=t.indexOf(".");return r>=0&&(e=t.slice(r+1),t=t.slice(0,r)),{type:t,name:e}}))}(t+""),a=o.length;if(!(arguments.length<2)){for(s=e?Sr:Dr,i=0;i<a;++i)this.each(s(o[i],e,r));return this}var s=this.node().__on;if(s)for(var l,c=0,d=s.length;c<d;++c)for(i=0,l=s[c];i<a;++i)if((n=o[i]).type===l.type&&n.name===l.name)return l.value},dispatch:function(t,e){return this.each(("function"==typeof e?Er:Tr)(t,e))},[Symbol.iterator]:function*(){for(var t=this._groups,e=0,r=t.length;e<r;++e)for(var i,n=t[e],o=0,a=n.length;o<a;++o)(i=n[o])&&(yield i)}};var Lr=.7,Rr=1/Lr,Ur="\\s*([+-]?\\d+)\\s*",Fr="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",zr="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Br=/^#([0-9a-f]{3,8})$/,Hr=new RegExp(`^rgb\\(${Ur},${Ur},${Ur}\\)$`),Yr=new RegExp(`^rgb\\(${zr},${zr},${zr}\\)$`),Wr=new RegExp(`^rgba\\(${Ur},${Ur},${Ur},${Fr}\\)$`),Vr=new RegExp(`^rgba\\(${zr},${zr},${zr},${Fr}\\)$`),Gr=new RegExp(`^hsl\\(${Fr},${zr},${zr}\\)$`),Kr=new RegExp(`^hsla\\(${Fr},${zr},${zr},${Fr}\\)$`),Xr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Jr(){return this.rgb().formatHex()}function Zr(){return this.rgb().formatRgb()}function Qr(t){var e,r;return t=(t+"").trim().toLowerCase(),(e=Br.exec(t))?(r=e[1].length,e=parseInt(e[1],16),6===r?ti(e):3===r?new ii(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1):8===r?ei(e>>24&255,e>>16&255,e>>8&255,(255&e)/255):4===r?ei(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|240&e,((15&e)<<4|15&e)/255):null):(e=Hr.exec(t))?new ii(e[1],e[2],e[3],1):(e=Yr.exec(t))?new ii(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=Wr.exec(t))?ei(e[1],e[2],e[3],e[4]):(e=Vr.exec(t))?ei(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=Gr.exec(t))?ci(e[1],e[2]/100,e[3]/100,1):(e=Kr.exec(t))?ci(e[1],e[2]/100,e[3]/100,e[4]):Xr.hasOwnProperty(t)?ti(Xr[t]):"transparent"===t?new ii(NaN,NaN,NaN,0):null}function ti(t){return new ii(t>>16&255,t>>8&255,255&t,1)}function ei(t,e,r,i){return i<=0&&(t=e=r=NaN),new ii(t,e,r,i)}function ri(t,e,r,i){return 1===arguments.length?function(t){return t instanceof Nr||(t=Qr(t)),t?new ii((t=t.rgb()).r,t.g,t.b,t.opacity):new ii}(t):new ii(t,e,r,null==i?1:i)}function ii(t,e,r,i){this.r=+t,this.g=+e,this.b=+r,this.opacity=+i}function ni(){return`#${li(this.r)}${li(this.g)}${li(this.b)}`}function oi(){const t=ai(this.opacity);return`${1===t?"rgb(":"rgba("}${si(this.r)}, ${si(this.g)}, ${si(this.b)}${1===t?")":`, ${t})`}`}function ai(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function si(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function li(t){return((t=si(t))<16?"0":"")+t.toString(16)}function ci(t,e,r,i){return i<=0?t=e=r=NaN:r<=0||r>=1?t=e=NaN:e<=0&&(t=NaN),new pi(t,e,r,i)}function di(t){if(t instanceof pi)return new pi(t.h,t.s,t.l,t.opacity);if(t instanceof Nr||(t=Qr(t)),!t)return new pi;if(t instanceof pi)return t;var e=(t=t.rgb()).r/255,r=t.g/255,i=t.b/255,n=Math.min(e,r,i),o=Math.max(e,r,i),a=NaN,s=o-n,l=(o+n)/2;return s?(a=e===o?(r-i)/s+6*(r<i):r===o?(i-e)/s+2:(e-r)/s+4,s/=l<.5?o+n:2-o-n,a*=60):s=l>0&&l<1?0:a,new pi(a,s,l,t.opacity)}function pi(t,e,r,i){this.h=+t,this.s=+e,this.l=+r,this.opacity=+i}function hi(t){return(t=(t||0)%360)<0?t+360:t}function ui(t){return Math.max(0,Math.min(1,t||0))}function gi(t,e,r){return 255*(t<60?e+(r-e)*t/60:t<180?r:t<240?e+(r-e)*(240-t)/60:e)}jr(Nr,Qr,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:Jr,formatHex:Jr,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return di(this).formatHsl()},formatRgb:Zr,toString:Zr}),jr(ii,ri,qr(Nr,{brighter(t){return t=null==t?Rr:Math.pow(Rr,t),new ii(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=null==t?Lr:Math.pow(Lr,t),new ii(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new ii(si(this.r),si(this.g),si(this.b),ai(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:ni,formatHex:ni,formatHex8:function(){return`#${li(this.r)}${li(this.g)}${li(this.b)}${li(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:oi,toString:oi})),jr(pi,(function(t,e,r,i){return 1===arguments.length?di(t):new pi(t,e,r,null==i?1:i)}),qr(Nr,{brighter(t){return t=null==t?Rr:Math.pow(Rr,t),new pi(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=null==t?Lr:Math.pow(Lr,t),new pi(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,r=this.l,i=r+(r<.5?r:1-r)*e,n=2*r-i;return new ii(gi(t>=240?t-240:t+120,n,i),gi(t,n,i),gi(t<120?t+240:t-120,n,i),this.opacity)},clamp(){return new pi(hi(this.h),ui(this.s),ui(this.l),ai(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=ai(this.opacity);return`${1===t?"hsl(":"hsla("}${hi(this.h)}, ${100*ui(this.s)}%, ${100*ui(this.l)}%${1===t?")":`, ${t})`}`}}));var mi=t=>()=>t;function fi(t){return 1==(t=+t)?yi:function(e,r){return r-e?function(t,e,r){return t=Math.pow(t,r),e=Math.pow(e,r)-t,r=1/r,function(i){return Math.pow(t+i*e,r)}}(e,r,t):mi(isNaN(e)?r:e)}}function yi(t,e){var r=e-t;return r?function(t,e){return function(r){return t+r*e}}(t,r):mi(isNaN(t)?e:t)}var vi=function t(e){var r=fi(e);function i(t,e){var i=r((t=ri(t)).r,(e=ri(e)).r),n=r(t.g,e.g),o=r(t.b,e.b),a=yi(t.opacity,e.opacity);return function(e){return t.r=i(e),t.g=n(e),t.b=o(e),t.opacity=a(e),t+""}}return i.gamma=t,i}(1);function bi(t,e){e||(e=[]);var r,i=t?Math.min(e.length,t.length):0,n=e.slice();return function(o){for(r=0;r<i;++r)n[r]=t[r]*(1-o)+e[r]*o;return n}}function wi(t,e){var r,i=e?e.length:0,n=t?Math.min(i,t.length):0,o=new Array(n),a=new Array(i);for(r=0;r<n;++r)o[r]=Si(t[r],e[r]);for(;r<i;++r)a[r]=e[r];return function(t){for(r=0;r<n;++r)a[r]=o[r](t);return a}}function xi(t,e){var r=new Date;return t=+t,e=+e,function(i){return r.setTime(t*(1-i)+e*i),r}}function ki(t,e){return t=+t,e=+e,function(r){return t*(1-r)+e*r}}function $i(t,e){var r,i={},n={};for(r in null!==t&&"object"==typeof t||(t={}),null!==e&&"object"==typeof e||(e={}),e)r in t?i[r]=Si(t[r],e[r]):n[r]=e[r];return function(t){for(r in i)n[r]=i[r](t);return n}}var Ci=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,_i=new RegExp(Ci.source,"g");function Di(t,e){var r,i,n,o=Ci.lastIndex=_i.lastIndex=0,a=-1,s=[],l=[];for(t+="",e+="";(r=Ci.exec(t))&&(i=_i.exec(e));)(n=i.index)>o&&(n=e.slice(o,n),s[a]?s[a]+=n:s[++a]=n),(r=r[0])===(i=i[0])?s[a]?s[a]+=i:s[++a]=i:(s[++a]=null,l.push({i:a,x:ki(r,i)})),o=_i.lastIndex;return o<e.length&&(n=e.slice(o),s[a]?s[a]+=n:s[++a]=n),s.length<2?l[0]?function(t){return function(e){return t(e)+""}}(l[0].x):function(t){return function(){return t}}(e):(e=l.length,function(t){for(var r,i=0;i<e;++i)s[(r=l[i]).i]=r.x(t);return s.join("")})}function Si(t,e){var r,i=typeof e;return null==e||"boolean"===i?mi(e):("number"===i?ki:"string"===i?(r=Qr(e))?(e=r,vi):Di:e instanceof Qr?vi:e instanceof Date?xi:function(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}(e)?bi:Array.isArray(e)?wi:"function"!=typeof e.valueOf&&"function"!=typeof e.toString||isNaN(e)?$i:ki)(t,e)}function Mi(t,e){return t=+t,e=+e,function(r){return Math.round(t*(1-r)+e*r)}}var Ti,Ei=180/Math.PI,Ai={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function Oi(t,e,r,i,n,o){var a,s,l;return(a=Math.sqrt(t*t+e*e))&&(t/=a,e/=a),(l=t*r+e*i)&&(r-=t*l,i-=e*l),(s=Math.sqrt(r*r+i*i))&&(r/=s,i/=s,l/=s),t*i<e*r&&(t=-t,e=-e,l=-l,a=-a),{translateX:n,translateY:o,rotate:Math.atan2(e,t)*Ei,skewX:Math.atan(l)*Ei,scaleX:a,scaleY:s}}function Ii(t,e,r,i){function n(t){return t.length?t.pop()+" ":""}return function(o,a){var s=[],l=[];return o=t(o),a=t(a),function(t,i,n,o,a,s){if(t!==n||i!==o){var l=a.push("translate(",null,e,null,r);s.push({i:l-4,x:ki(t,n)},{i:l-2,x:ki(i,o)})}else(n||o)&&a.push("translate("+n+e+o+r)}(o.translateX,o.translateY,a.translateX,a.translateY,s,l),function(t,e,r,o){t!==e?(t-e>180?e+=360:e-t>180&&(t+=360),o.push({i:r.push(n(r)+"rotate(",null,i)-2,x:ki(t,e)})):e&&r.push(n(r)+"rotate("+e+i)}(o.rotate,a.rotate,s,l),function(t,e,r,o){t!==e?o.push({i:r.push(n(r)+"skewX(",null,i)-2,x:ki(t,e)}):e&&r.push(n(r)+"skewX("+e+i)}(o.skewX,a.skewX,s,l),function(t,e,r,i,o,a){if(t!==r||e!==i){var s=o.push(n(o)+"scale(",null,",",null,")");a.push({i:s-4,x:ki(t,r)},{i:s-2,x:ki(e,i)})}else 1===r&&1===i||o.push(n(o)+"scale("+r+","+i+")")}(o.scaleX,o.scaleY,a.scaleX,a.scaleY,s,l),o=a=null,function(t){for(var e,r=-1,i=l.length;++r<i;)s[(e=l[r]).i]=e.x(t);return s.join("")}}}var Pi,ji,qi=Ii((function(t){const e=new("function"==typeof DOMMatrix?DOMMatrix:WebKitCSSMatrix)(t+"");return e.isIdentity?Ai:Oi(e.a,e.b,e.c,e.d,e.e,e.f)}),"px, ","px)","deg)"),Ni=Ii((function(t){return null==t?Ai:(Ti||(Ti=document.createElementNS("http://www.w3.org/2000/svg","g")),Ti.setAttribute("transform",t),(t=Ti.transform.baseVal.consolidate())?Oi((t=t.matrix).a,t.b,t.c,t.d,t.e,t.f):Ai)}),", ",")",")"),Li=0,Ri=0,Ui=0,Fi=1e3,zi=0,Bi=0,Hi=0,Yi="object"==typeof performance&&performance.now?performance:Date,Wi="object"==typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function Vi(){return Bi||(Wi(Gi),Bi=Yi.now()+Hi)}function Gi(){Bi=0}function Ki(){this._call=this._time=this._next=null}function Xi(t,e,r){var i=new Ki;return i.restart(t,e,r),i}function Ji(){Bi=(zi=Yi.now())+Hi,Li=Ri=0;try{!function(){Vi(),++Li;for(var t,e=Pi;e;)(t=Bi-e._time)>=0&&e._call.call(void 0,t),e=e._next;--Li}()}finally{Li=0,function(){var t,e,r=Pi,i=1/0;for(;r;)r._call?(i>r._time&&(i=r._time),t=r,r=r._next):(e=r._next,r._next=null,r=t?t._next=e:Pi=e);ji=t,Qi(i)}(),Bi=0}}function Zi(){var t=Yi.now(),e=t-zi;e>Fi&&(Hi-=e,zi=t)}function Qi(t){Li||(Ri&&(Ri=clearTimeout(Ri)),t-Bi>24?(t<1/0&&(Ri=setTimeout(Ji,t-Yi.now()-Hi)),Ui&&(Ui=clearInterval(Ui))):(Ui||(zi=Yi.now(),Ui=setInterval(Zi,Fi)),Li=1,Wi(Ji)))}function tn(t,e,r){var i=new Ki;return e=null==e?0:+e,i.restart((r=>{i.stop(),t(r+e)}),e,r),i}Ki.prototype=Xi.prototype={constructor:Ki,restart:function(t,e,r){if("function"!=typeof t)throw new TypeError("callback is not a function");r=(null==r?Vi():+r)+(null==e?0:+e),this._next||ji===this||(ji?ji._next=this:Pi=this,ji=this),this._call=t,this._time=r,Qi()},stop:function(){this._call&&(this._call=null,this._time=1/0,Qi())}};var en=ve("start","end","cancel","interrupt"),rn=[],nn=0,on=1,an=2,sn=3,ln=4,cn=5,dn=6;function pn(t,e,r,i,n,o){var a=t.__transition;if(a){if(r in a)return}else t.__transition={};!function(t,e,r){var i,n=t.__transition;function o(t){r.state=on,r.timer.restart(a,r.delay,r.time),r.delay<=t&&a(t-r.delay)}function a(o){var c,d,p,h;if(r.state!==on)return l();for(c in n)if((h=n[c]).name===r.name){if(h.state===sn)return tn(a);h.state===ln?(h.state=dn,h.timer.stop(),h.on.call("interrupt",t,t.__data__,h.index,h.group),delete n[c]):+c<e&&(h.state=dn,h.timer.stop(),h.on.call("cancel",t,t.__data__,h.index,h.group),delete n[c])}if(tn((function(){r.state===sn&&(r.state=ln,r.timer.restart(s,r.delay,r.time),s(o))})),r.state=an,r.on.call("start",t,t.__data__,r.index,r.group),r.state===an){for(r.state=sn,i=new Array(p=r.tween.length),c=0,d=-1;c<p;++c)(h=r.tween[c].value.call(t,t.__data__,r.index,r.group))&&(i[++d]=h);i.length=d+1}}function s(e){for(var n=e<r.duration?r.ease.call(null,e/r.duration):(r.timer.restart(l),r.state=cn,1),o=-1,a=i.length;++o<a;)i[o].call(t,n);r.state===cn&&(r.on.call("end",t,t.__data__,r.index,r.group),l())}function l(){for(var i in r.state=dn,r.timer.stop(),delete n[e],n)return;delete t.__transition}n[e]=r,r.timer=Xi(o,0,r.time)}(t,r,{name:e,index:i,group:n,on:en,tween:rn,time:o.time,delay:o.delay,duration:o.duration,ease:o.ease,timer:null,state:nn})}function hn(t,e){var r=gn(t,e);if(r.state>nn)throw new Error("too late; already scheduled");return r}function un(t,e){var r=gn(t,e);if(r.state>sn)throw new Error("too late; already running");return r}function gn(t,e){var r=t.__transition;if(!r||!(r=r[e]))throw new Error("transition not found");return r}function mn(t,e){var r,i;return function(){var n=un(this,t),o=n.tween;if(o!==r)for(var a=0,s=(i=r=o).length;a<s;++a)if(i[a].name===e){(i=i.slice()).splice(a,1);break}n.tween=i}}function fn(t,e,r){var i,n;if("function"!=typeof r)throw new Error;return function(){var o=un(this,t),a=o.tween;if(a!==i){n=(i=a).slice();for(var s={name:e,value:r},l=0,c=n.length;l<c;++l)if(n[l].name===e){n[l]=s;break}l===c&&n.push(s)}o.tween=n}}function yn(t,e,r){var i=t._id;return t.each((function(){var t=un(this,i);(t.value||(t.value={}))[e]=r.apply(this,arguments)})),function(t){return gn(t,i).value[e]}}function vn(t,e){var r;return("number"==typeof e?ki:e instanceof Qr?vi:(r=Qr(e))?(e=r,vi):Di)(t,e)}function bn(t){return function(){this.removeAttribute(t)}}function wn(t){return function(){this.removeAttributeNS(t.space,t.local)}}function xn(t,e,r){var i,n,o=r+"";return function(){var a=this.getAttribute(t);return a===o?null:a===i?n:n=e(i=a,r)}}function kn(t,e,r){var i,n,o=r+"";return function(){var a=this.getAttributeNS(t.space,t.local);return a===o?null:a===i?n:n=e(i=a,r)}}function $n(t,e,r){var i,n,o;return function(){var a,s,l=r(this);if(null!=l)return(a=this.getAttribute(t))===(s=l+"")?null:a===i&&s===n?o:(n=s,o=e(i=a,l));this.removeAttribute(t)}}function Cn(t,e,r){var i,n,o;return function(){var a,s,l=r(this);if(null!=l)return(a=this.getAttributeNS(t.space,t.local))===(s=l+"")?null:a===i&&s===n?o:(n=s,o=e(i=a,l));this.removeAttributeNS(t.space,t.local)}}function _n(t,e){var r,i;function n(){var n=e.apply(this,arguments);return n!==i&&(r=(i=n)&&function(t,e){return function(r){this.setAttributeNS(t.space,t.local,e.call(this,r))}}(t,n)),r}return n._value=e,n}function Dn(t,e){var r,i;function n(){var n=e.apply(this,arguments);return n!==i&&(r=(i=n)&&function(t,e){return function(r){this.setAttribute(t,e.call(this,r))}}(t,n)),r}return n._value=e,n}function Sn(t,e){return function(){hn(this,t).delay=+e.apply(this,arguments)}}function Mn(t,e){return e=+e,function(){hn(this,t).delay=e}}function Tn(t,e){return function(){un(this,t).duration=+e.apply(this,arguments)}}function En(t,e){return e=+e,function(){un(this,t).duration=e}}var An=Ir.prototype.constructor;function On(t){return function(){this.style.removeProperty(t)}}var In=0;function Pn(t,e,r,i){this._groups=t,this._parents=e,this._name=r,this._id=i}function jn(){return++In}var qn=Ir.prototype;Pn.prototype={constructor:Pn,select:function(t){var e=this._name,r=this._id;"function"!=typeof t&&(t=Te(t));for(var i=this._groups,n=i.length,o=new Array(n),a=0;a<n;++a)for(var s,l,c=i[a],d=c.length,p=o[a]=new Array(d),h=0;h<d;++h)(s=c[h])&&(l=t.call(s,s.__data__,h,c))&&("__data__"in s&&(l.__data__=s.__data__),p[h]=l,pn(p[h],e,r,h,p,gn(s,r)));return new Pn(o,this._parents,e,r)},selectAll:function(t){var e=this._name,r=this._id;"function"!=typeof t&&(t=Ae(t));for(var i=this._groups,n=i.length,o=[],a=[],s=0;s<n;++s)for(var l,c=i[s],d=c.length,p=0;p<d;++p)if(l=c[p]){for(var h,u=t.call(l,l.__data__,p,c),g=gn(l,r),m=0,f=u.length;m<f;++m)(h=u[m])&&pn(h,e,r,m,u,g);o.push(u),a.push(l)}return new Pn(o,a,e,r)},selectChild:qn.selectChild,selectChildren:qn.selectChildren,filter:function(t){"function"!=typeof t&&(t=Ie(t));for(var e=this._groups,r=e.length,i=new Array(r),n=0;n<r;++n)for(var o,a=e[n],s=a.length,l=i[n]=[],c=0;c<s;++c)(o=a[c])&&t.call(o,o.__data__,c,a)&&l.push(o);return new Pn(i,this._parents,this._name,this._id)},merge:function(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,r=t._groups,i=e.length,n=r.length,o=Math.min(i,n),a=new Array(i),s=0;s<o;++s)for(var l,c=e[s],d=r[s],p=c.length,h=a[s]=new Array(p),u=0;u<p;++u)(l=c[u]||d[u])&&(h[u]=l);for(;s<i;++s)a[s]=e[s];return new Pn(a,this._parents,this._name,this._id)},selection:function(){return new An(this._groups,this._parents)},transition:function(){for(var t=this._name,e=this._id,r=jn(),i=this._groups,n=i.length,o=0;o<n;++o)for(var a,s=i[o],l=s.length,c=0;c<l;++c)if(a=s[c]){var d=gn(a,e);pn(a,t,r,c,s,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new Pn(i,this._parents,t,r)},call:qn.call,nodes:qn.nodes,node:qn.node,size:qn.size,empty:qn.empty,each:qn.each,on:function(t,e){var r=this._id;return arguments.length<2?gn(this.node(),r).on.on(t):this.each(function(t,e,r){var i,n,o=function(t){return(t+"").trim().split(/^|\s+/).every((function(t){var e=t.indexOf(".");return e>=0&&(t=t.slice(0,e)),!t||"start"===t}))}(e)?hn:un;return function(){var a=o(this,t),s=a.on;s!==i&&(n=(i=s).copy()).on(e,r),a.on=n}}(r,t,e))},attr:function(t,e){var r=Ce(t),i="transform"===r?Ni:vn;return this.attrTween(t,"function"==typeof e?(r.local?Cn:$n)(r,i,yn(this,"attr."+t,e)):null==e?(r.local?wn:bn)(r):(r.local?kn:xn)(r,i,e))},attrTween:function(t,e){var r="attr."+t;if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==e)return this.tween(r,null);if("function"!=typeof e)throw new Error;var i=Ce(t);return this.tween(r,(i.local?_n:Dn)(i,e))},style:function(t,e,r){var i="transform"==(t+="")?qi:vn;return null==e?this.styleTween(t,function(t,e){var r,i,n;return function(){var o=rr(this,t),a=(this.style.removeProperty(t),rr(this,t));return o===a?null:o===r&&a===i?n:n=e(r=o,i=a)}}(t,i)).on("end.style."+t,On(t)):"function"==typeof e?this.styleTween(t,function(t,e,r){var i,n,o;return function(){var a=rr(this,t),s=r(this),l=s+"";return null==s&&(this.style.removeProperty(t),l=s=rr(this,t)),a===l?null:a===i&&l===n?o:(n=l,o=e(i=a,s))}}(t,i,yn(this,"style."+t,e))).each(function(t,e){var r,i,n,o,a="style."+e,s="end."+a;return function(){var l=un(this,t),c=l.on,d=null==l.value[a]?o||(o=On(e)):void 0;c===r&&n===d||(i=(r=c).copy()).on(s,n=d),l.on=i}}(this._id,t)):this.styleTween(t,function(t,e,r){var i,n,o=r+"";return function(){var a=rr(this,t);return a===o?null:a===i?n:n=e(i=a,r)}}(t,i,e),r).on("end.style."+t,null)},styleTween:function(t,e,r){var i="style."+(t+="");if(arguments.length<2)return(i=this.tween(i))&&i._value;if(null==e)return this.tween(i,null);if("function"!=typeof e)throw new Error;return this.tween(i,function(t,e,r){var i,n;function o(){var o=e.apply(this,arguments);return o!==n&&(i=(n=o)&&function(t,e,r){return function(i){this.style.setProperty(t,e.call(this,i),r)}}(t,o,r)),i}return o._value=e,o}(t,e,null==r?"":r))},text:function(t){return this.tween("text","function"==typeof t?function(t){return function(){var e=t(this);this.textContent=null==e?"":e}}(yn(this,"text",t)):function(t){return function(){this.textContent=t}}(null==t?"":t+""))},textTween:function(t){var e="text";if(arguments.length<1)return(e=this.tween(e))&&e._value;if(null==t)return this.tween(e,null);if("function"!=typeof t)throw new Error;return this.tween(e,function(t){var e,r;function i(){var i=t.apply(this,arguments);return i!==r&&(e=(r=i)&&function(t){return function(e){this.textContent=t.call(this,e)}}(i)),e}return i._value=t,i}(t))},remove:function(){return this.on("end.remove",function(t){return function(){var e=this.parentNode;for(var r in this.__transition)if(+r!==t)return;e&&e.removeChild(this)}}(this._id))},tween:function(t,e){var r=this._id;if(t+="",arguments.length<2){for(var i,n=gn(this.node(),r).tween,o=0,a=n.length;o<a;++o)if((i=n[o]).name===t)return i.value;return null}return this.each((null==e?mn:fn)(r,t,e))},delay:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?Sn:Mn)(e,t)):gn(this.node(),e).delay},duration:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?Tn:En)(e,t)):gn(this.node(),e).duration},ease:function(t){var e=this._id;return arguments.length?this.each(function(t,e){if("function"!=typeof e)throw new Error;return function(){un(this,t).ease=e}}(e,t)):gn(this.node(),e).ease},easeVarying:function(t){if("function"!=typeof t)throw new Error;return this.each(function(t,e){return function(){var r=e.apply(this,arguments);if("function"!=typeof r)throw new Error;un(this,t).ease=r}}(this._id,t))},end:function(){var t,e,r=this,i=r._id,n=r.size();return new Promise((function(o,a){var s={value:a},l={value:function(){0==--n&&o()}};r.each((function(){var r=un(this,i),n=r.on;n!==t&&((e=(t=n).copy())._.cancel.push(s),e._.interrupt.push(s),e._.end.push(l)),r.on=e})),0===n&&o()}))},[Symbol.iterator]:qn[Symbol.iterator]};var Nn={time:null,delay:0,duration:250,ease:function(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}};function Ln(t,e){for(var r;!(r=t.__transition)||!(r=r[e]);)if(!(t=t.parentNode))throw new Error(`transition ${e} not found`);return r}function Rn(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);if(204!==t.status&&205!==t.status)return t.json()}function Un(t,e){if((r=(t=e?t.toExponential(e-1):t.toExponential()).indexOf("e"))<0)return null;var r,i=t.slice(0,r);return[i.length>1?i[0]+i.slice(2):i,+t.slice(r+1)]}function Fn(t){return(t=Un(Math.abs(t)))?t[1]:NaN}Ir.prototype.interrupt=function(t){return this.each((function(){!function(t,e){var r,i,n,o=t.__transition,a=!0;if(o){for(n in e=null==e?null:e+"",o)(r=o[n]).name===e?(i=r.state>an&&r.state<cn,r.state=dn,r.timer.stop(),r.on.call(i?"interrupt":"cancel",t,t.__data__,r.index,r.group),delete o[n]):a=!1;a&&delete t.__transition}}(this,t)}))},Ir.prototype.transition=function(t){var e,r;t instanceof Pn?(e=t._id,t=t._name):(e=jn(),(r=Nn).time=Vi(),t=null==t?null:t+"");for(var i=this._groups,n=i.length,o=0;o<n;++o)for(var a,s=i[o],l=s.length,c=0;c<l;++c)(a=s[c])&&pn(a,t,e,c,s,r||Ln(a,e));return new Pn(i,this._parents,t,e)};var zn,Bn=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Hn(t){if(!(e=Bn.exec(t)))throw new Error("invalid format: "+t);var e;return new Yn({fill:e[1],align:e[2],sign:e[3],symbol:e[4],zero:e[5],width:e[6],comma:e[7],precision:e[8]&&e[8].slice(1),trim:e[9],type:e[10]})}function Yn(t){this.fill=void 0===t.fill?" ":t.fill+"",this.align=void 0===t.align?">":t.align+"",this.sign=void 0===t.sign?"-":t.sign+"",this.symbol=void 0===t.symbol?"":t.symbol+"",this.zero=!!t.zero,this.width=void 0===t.width?void 0:+t.width,this.comma=!!t.comma,this.precision=void 0===t.precision?void 0:+t.precision,this.trim=!!t.trim,this.type=void 0===t.type?"":t.type+""}function Wn(t,e){var r=Un(t,e);if(!r)return t+"";var i=r[0],n=r[1];return n<0?"0."+new Array(-n).join("0")+i:i.length>n+1?i.slice(0,n+1)+"."+i.slice(n+1):i+new Array(n-i.length+2).join("0")}Hn.prototype=Yn.prototype,Yn.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};var Vn={"%":(t,e)=>(100*t).toFixed(e),b:t=>Math.round(t).toString(2),c:t=>t+"",d:function(t){return Math.abs(t=Math.round(t))>=1e21?t.toLocaleString("en").replace(/,/g,""):t.toString(10)},e:(t,e)=>t.toExponential(e),f:(t,e)=>t.toFixed(e),g:(t,e)=>t.toPrecision(e),o:t=>Math.round(t).toString(8),p:(t,e)=>Wn(100*t,e),r:Wn,s:function(t,e){var r=Un(t,e);if(!r)return t+"";var i=r[0],n=r[1],o=n-(zn=3*Math.max(-8,Math.min(8,Math.floor(n/3))))+1,a=i.length;return o===a?i:o>a?i+new Array(o-a+1).join("0"):o>0?i.slice(0,o)+"."+i.slice(o):"0."+new Array(1-o).join("0")+Un(t,Math.max(0,e+o-1))[0]},X:t=>Math.round(t).toString(16).toUpperCase(),x:t=>Math.round(t).toString(16)};function Gn(t){return t}var Kn,Xn,Jn,Zn=Array.prototype.map,Qn=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function to(t){var e,r,i=void 0===t.grouping||void 0===t.thousands?Gn:(e=Zn.call(t.grouping,Number),r=t.thousands+"",function(t,i){for(var n=t.length,o=[],a=0,s=e[0],l=0;n>0&&s>0&&(l+s+1>i&&(s=Math.max(1,i-l)),o.push(t.substring(n-=s,n+s)),!((l+=s+1)>i));)s=e[a=(a+1)%e.length];return o.reverse().join(r)}),n=void 0===t.currency?"":t.currency[0]+"",o=void 0===t.currency?"":t.currency[1]+"",a=void 0===t.decimal?".":t.decimal+"",s=void 0===t.numerals?Gn:function(t){return function(e){return e.replace(/[0-9]/g,(function(e){return t[+e]}))}}(Zn.call(t.numerals,String)),l=void 0===t.percent?"%":t.percent+"",c=void 0===t.minus?"−":t.minus+"",d=void 0===t.nan?"NaN":t.nan+"";function p(t){var e=(t=Hn(t)).fill,r=t.align,p=t.sign,h=t.symbol,u=t.zero,g=t.width,m=t.comma,f=t.precision,y=t.trim,v=t.type;"n"===v?(m=!0,v="g"):Vn[v]||(void 0===f&&(f=12),y=!0,v="g"),(u||"0"===e&&"="===r)&&(u=!0,e="0",r="=");var b="$"===h?n:"#"===h&&/[boxX]/.test(v)?"0"+v.toLowerCase():"",w="$"===h?o:/[%p]/.test(v)?l:"",x=Vn[v],k=/[defgprs%]/.test(v);function $(t){var n,o,l,h=b,$=w;if("c"===v)$=x(t)+$,t="";else{var C=(t=+t)<0||1/t<0;if(t=isNaN(t)?d:x(Math.abs(t),f),y&&(t=function(t){t:for(var e,r=t.length,i=1,n=-1;i<r;++i)switch(t[i]){case".":n=e=i;break;case"0":0===n&&(n=i),e=i;break;default:if(!+t[i])break t;n>0&&(n=0)}return n>0?t.slice(0,n)+t.slice(e+1):t}(t)),C&&0==+t&&"+"!==p&&(C=!1),h=(C?"("===p?p:c:"-"===p||"("===p?"":p)+h,$=("s"===v?Qn[8+zn/3]:"")+$+(C&&"("===p?")":""),k)for(n=-1,o=t.length;++n<o;)if(48>(l=t.charCodeAt(n))||l>57){$=(46===l?a+t.slice(n+1):t.slice(n))+$,t=t.slice(0,n);break}}m&&!u&&(t=i(t,1/0));var _=h.length+t.length+$.length,D=_<g?new Array(g-_+1).join(e):"";switch(m&&u&&(t=i(D+t,D.length?g-$.length:1/0),D=""),r){case"<":t=h+t+$+D;break;case"=":t=h+D+t+$;break;case"^":t=D.slice(0,_=D.length>>1)+h+t+$+D.slice(_);break;default:t=D+h+t+$}return s(t)}return f=void 0===f?6:/[gprs]/.test(v)?Math.max(1,Math.min(21,f)):Math.max(0,Math.min(20,f)),$.toString=function(){return t+""},$}return{format:p,formatPrefix:function(t,e){var r=p(((t=Hn(t)).type="f",t)),i=3*Math.max(-8,Math.min(8,Math.floor(Fn(e)/3))),n=Math.pow(10,-i),o=Qn[8+i/3];return function(t){return r(n*t)+o}}}}Kn=to({thousands:",",grouping:[3],currency:["$",""]}),Xn=Kn.format,Jn=Kn.formatPrefix;var eo=1e-6,ro=1e-12,io=Math.PI,no=io/2,oo=io/4,ao=2*io,so=180/io,lo=io/180,co=Math.abs,po=Math.atan,ho=Math.atan2,uo=Math.cos,go=Math.exp,mo=Math.log,fo=Math.sin,yo=Math.sign||function(t){return t>0?1:t<0?-1:0},vo=Math.sqrt,bo=Math.tan;function wo(t){return t>1?no:t<-1?-no:Math.asin(t)}function xo(){}function ko(t,e){t&&Co.hasOwnProperty(t.type)&&Co[t.type](t,e)}var $o={Feature:function(t,e){ko(t.geometry,e)},FeatureCollection:function(t,e){for(var r=t.features,i=-1,n=r.length;++i<n;)ko(r[i].geometry,e)}},Co={Sphere:function(t,e){e.sphere()},Point:function(t,e){t=t.coordinates,e.point(t[0],t[1],t[2])},MultiPoint:function(t,e){for(var r=t.coordinates,i=-1,n=r.length;++i<n;)t=r[i],e.point(t[0],t[1],t[2])},LineString:function(t,e){_o(t.coordinates,e,0)},MultiLineString:function(t,e){for(var r=t.coordinates,i=-1,n=r.length;++i<n;)_o(r[i],e,0)},Polygon:function(t,e){Do(t.coordinates,e)},MultiPolygon:function(t,e){for(var r=t.coordinates,i=-1,n=r.length;++i<n;)Do(r[i],e)},GeometryCollection:function(t,e){for(var r=t.geometries,i=-1,n=r.length;++i<n;)ko(r[i],e)}};function _o(t,e,r){var i,n=-1,o=t.length-r;for(e.lineStart();++n<o;)i=t[n],e.point(i[0],i[1],i[2]);e.lineEnd()}function Do(t,e){var r=-1,i=t.length;for(e.polygonStart();++r<i;)_o(t[r],e,1);e.polygonEnd()}function So(t,e){t&&$o.hasOwnProperty(t.type)?$o[t.type](t,e):ko(t,e)}function Mo(t){return[ho(t[1],t[0]),wo(t[2])]}function To(t){var e=t[0],r=t[1],i=uo(r);return[i*uo(e),i*fo(e),fo(r)]}function Eo(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Ao(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function Oo(t,e){t[0]+=e[0],t[1]+=e[1],t[2]+=e[2]}function Io(t,e){return[t[0]*e,t[1]*e,t[2]*e]}function Po(t){var e=vo(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]/=e,t[1]/=e,t[2]/=e}function jo(t,e){function r(r,i){return r=t(r,i),e(r[0],r[1])}return t.invert&&e.invert&&(r.invert=function(r,i){return(r=e.invert(r,i))&&t.invert(r[0],r[1])}),r}function qo(t,e){return co(t)>io&&(t-=Math.round(t/ao)*ao),[t,e]}function No(t,e,r){return(t%=ao)?e||r?jo(Ro(t),Uo(e,r)):Ro(t):e||r?Uo(e,r):qo}function Lo(t){return function(e,r){return co(e+=t)>io&&(e-=Math.round(e/ao)*ao),[e,r]}}function Ro(t){var e=Lo(t);return e.invert=Lo(-t),e}function Uo(t,e){var r=uo(t),i=fo(t),n=uo(e),o=fo(e);function a(t,e){var a=uo(e),s=uo(t)*a,l=fo(t)*a,c=fo(e),d=c*r+s*i;return[ho(l*n-d*o,s*r-c*i),wo(d*n+l*o)]}return a.invert=function(t,e){var a=uo(e),s=uo(t)*a,l=fo(t)*a,c=fo(e),d=c*n-l*o;return[ho(l*n+c*o,s*r+d*i),wo(d*r-s*i)]},a}function Fo(t,e){(e=To(e))[0]-=t,Po(e);var r=function(t){return t>1?0:t<-1?io:Math.acos(t)}(-e[1]);return((-e[2]<0?-r:r)+ao-eo)%ao}function zo(){var t,e=[];return{point:function(e,r,i){t.push([e,r,i])},lineStart:function(){e.push(t=[])},lineEnd:xo,rejoin:function(){e.length>1&&e.push(e.pop().concat(e.shift()))},result:function(){var r=e;return e=[],t=null,r}}}function Bo(t,e){return co(t[0]-e[0])<eo&&co(t[1]-e[1])<eo}function Ho(t,e,r,i){this.x=t,this.z=e,this.o=r,this.e=i,this.v=!1,this.n=this.p=null}function Yo(t,e,r,i,n){var o,a,s=[],l=[];if(t.forEach((function(t){if(!((e=t.length-1)<=0)){var e,r,i=t[0],a=t[e];if(Bo(i,a)){if(!i[2]&&!a[2]){for(n.lineStart(),o=0;o<e;++o)n.point((i=t[o])[0],i[1]);return void n.lineEnd()}a[0]+=2*eo}s.push(r=new Ho(i,t,null,!0)),l.push(r.o=new Ho(i,null,r,!1)),s.push(r=new Ho(a,t,null,!1)),l.push(r.o=new Ho(a,null,r,!0))}})),s.length){for(l.sort(e),Wo(s),Wo(l),o=0,a=l.length;o<a;++o)l[o].e=r=!r;for(var c,d,p=s[0];;){for(var h=p,u=!0;h.v;)if((h=h.n)===p)return;c=h.z,n.lineStart();do{if(h.v=h.o.v=!0,h.e){if(u)for(o=0,a=c.length;o<a;++o)n.point((d=c[o])[0],d[1]);else i(h.x,h.n.x,1,n);h=h.n}else{if(u)for(c=h.p.z,o=c.length-1;o>=0;--o)n.point((d=c[o])[0],d[1]);else i(h.x,h.p.x,-1,n);h=h.p}c=(h=h.o).z,u=!u}while(!h.v);n.lineEnd()}}}function Wo(t){if(e=t.length){for(var e,r,i=0,n=t[0];++i<e;)n.n=r=t[i],r.p=n,n=r;n.n=r=t[0],r.p=n}}function Vo(t){return co(t[0])<=io?t[0]:yo(t[0])*((co(t[0])+io)%ao-io)}function Go(t,e,r,i){return function(n){var o,a,s,l=e(n),c=zo(),d=e(c),p=!1,h={point:u,lineStart:m,lineEnd:f,polygonStart:function(){h.point=y,h.lineStart=v,h.lineEnd=b,a=[],o=[]},polygonEnd:function(){h.point=u,h.lineStart=m,h.lineEnd=f,a=fe(a);var t=function(t,e){var r=Vo(e),i=e[1],n=fo(i),o=[fo(r),-uo(r),0],a=0,s=0,l=new de;1===n?i=no+eo:-1===n&&(i=-no-eo);for(var c=0,d=t.length;c<d;++c)if(h=(p=t[c]).length)for(var p,h,u=p[h-1],g=Vo(u),m=u[1]/2+oo,f=fo(m),y=uo(m),v=0;v<h;++v,g=w,f=k,y=$,u=b){var b=p[v],w=Vo(b),x=b[1]/2+oo,k=fo(x),$=uo(x),C=w-g,_=C>=0?1:-1,D=_*C,S=D>io,M=f*k;if(l.add(ho(M*_*fo(D),y*$+M*uo(D))),a+=S?C+_*ao:C,S^g>=r^w>=r){var T=Ao(To(u),To(b));Po(T);var E=Ao(o,T);Po(E);var A=(S^C>=0?-1:1)*wo(E[2]);(i>A||i===A&&(T[0]||T[1]))&&(s+=S^C>=0?1:-1)}}return(a<-eo||a<eo&&l<-ro)^1&s}(o,i);a.length?(p||(n.polygonStart(),p=!0),Yo(a,Xo,t,r,n)):t&&(p||(n.polygonStart(),p=!0),n.lineStart(),r(null,null,1,n),n.lineEnd()),p&&(n.polygonEnd(),p=!1),a=o=null},sphere:function(){n.polygonStart(),n.lineStart(),r(null,null,1,n),n.lineEnd(),n.polygonEnd()}};function u(e,r){t(e,r)&&n.point(e,r)}function g(t,e){l.point(t,e)}function m(){h.point=g,l.lineStart()}function f(){h.point=u,l.lineEnd()}function y(t,e){s.push([t,e]),d.point(t,e)}function v(){d.lineStart(),s=[]}function b(){y(s[0][0],s[0][1]),d.lineEnd();var t,e,r,i,l=d.clean(),h=c.result(),u=h.length;if(s.pop(),o.push(s),s=null,u)if(1&l){if((e=(r=h[0]).length-1)>0){for(p||(n.polygonStart(),p=!0),n.lineStart(),t=0;t<e;++t)n.point((i=r[t])[0],i[1]);n.lineEnd()}}else u>1&&2&l&&h.push(h.pop().concat(h.shift())),a.push(h.filter(Ko))}return h}}function Ko(t){return t.length>1}function Xo(t,e){return((t=t.x)[0]<0?t[1]-no-eo:no-t[1])-((e=e.x)[0]<0?e[1]-no-eo:no-e[1])}qo.invert=qo;var Jo=Go((function(){return!0}),(function(t){var e,r=NaN,i=NaN,n=NaN;return{lineStart:function(){t.lineStart(),e=1},point:function(o,a){var s=o>0?io:-io,l=co(o-r);co(l-io)<eo?(t.point(r,i=(i+a)/2>0?no:-no),t.point(n,i),t.lineEnd(),t.lineStart(),t.point(s,i),t.point(o,i),e=0):n!==s&&l>=io&&(co(r-n)<eo&&(r-=n*eo),co(o-s)<eo&&(o-=s*eo),i=function(t,e,r,i){var n,o,a=fo(t-r);return co(a)>eo?po((fo(e)*(o=uo(i))*fo(r)-fo(i)*(n=uo(e))*fo(t))/(n*o*a)):(e+i)/2}(r,i,o,a),t.point(n,i),t.lineEnd(),t.lineStart(),t.point(s,i),e=0),t.point(r=o,i=a),n=s},lineEnd:function(){t.lineEnd(),r=i=NaN},clean:function(){return 2-e}}}),(function(t,e,r,i){var n;if(null==t)n=r*no,i.point(-io,n),i.point(0,n),i.point(io,n),i.point(io,0),i.point(io,-n),i.point(0,-n),i.point(-io,-n),i.point(-io,0),i.point(-io,n);else if(co(t[0]-e[0])>eo){var o=t[0]<e[0]?io:-io;n=r*o/2,i.point(-o,n),i.point(0,n),i.point(o,n)}else i.point(e[0],e[1])}),[-io,-no]);function Zo(t){var e=uo(t),r=2*lo,i=e>0,n=co(e)>eo;function o(t,r){return uo(t)*uo(r)>e}function a(t,r,i){var n=[1,0,0],o=Ao(To(t),To(r)),a=Eo(o,o),s=o[0],l=a-s*s;if(!l)return!i&&t;var c=e*a/l,d=-e*s/l,p=Ao(n,o),h=Io(n,c);Oo(h,Io(o,d));var u=p,g=Eo(h,u),m=Eo(u,u),f=g*g-m*(Eo(h,h)-1);if(!(f<0)){var y=vo(f),v=Io(u,(-g-y)/m);if(Oo(v,h),v=Mo(v),!i)return v;var b,w=t[0],x=r[0],k=t[1],$=r[1];x<w&&(b=w,w=x,x=b);var C=x-w,_=co(C-io)<eo;if(!_&&$<k&&(b=k,k=$,$=b),_||C<eo?_?k+$>0^v[1]<(co(v[0]-w)<eo?k:$):k<=v[1]&&v[1]<=$:C>io^(w<=v[0]&&v[0]<=x)){var D=Io(u,(-g+y)/m);return Oo(D,h),[v,Mo(D)]}}}function s(e,r){var n=i?t:io-t,o=0;return e<-n?o|=1:e>n&&(o|=2),r<-n?o|=4:r>n&&(o|=8),o}return Go(o,(function(t){var e,r,l,c,d;return{lineStart:function(){c=l=!1,d=1},point:function(p,h){var u,g=[p,h],m=o(p,h),f=i?m?0:s(p,h):m?s(p+(p<0?io:-io),h):0;if(!e&&(c=l=m)&&t.lineStart(),m!==l&&(!(u=a(e,g))||Bo(e,u)||Bo(g,u))&&(g[2]=1),m!==l)d=0,m?(t.lineStart(),u=a(g,e),t.point(u[0],u[1])):(u=a(e,g),t.point(u[0],u[1],2),t.lineEnd()),e=u;else if(n&&e&&i^m){var y;f&r||!(y=a(g,e,!0))||(d=0,i?(t.lineStart(),t.point(y[0][0],y[0][1]),t.point(y[1][0],y[1][1]),t.lineEnd()):(t.point(y[1][0],y[1][1]),t.lineEnd(),t.lineStart(),t.point(y[0][0],y[0][1],3)))}!m||e&&Bo(e,g)||t.point(g[0],g[1]),e=g,l=m,r=f},lineEnd:function(){l&&t.lineEnd(),e=null},clean:function(){return d|(c&&l)<<1}}}),(function(e,i,n,o){!function(t,e,r,i,n,o){if(r){var a=uo(e),s=fo(e),l=i*r;null==n?(n=e+i*ao,o=e-l/2):(n=Fo(a,n),o=Fo(a,o),(i>0?n<o:n>o)&&(n+=i*ao));for(var c,d=n;i>0?d>o:d<o;d-=l)c=Mo([a,-s*uo(d),-s*fo(d)]),t.point(c[0],c[1])}}(o,t,r,n,e,i)}),i?[0,-t]:[-io,t-io])}var Qo=1e9,ta=-Qo;function ea(t,e,r,i){function n(n,o){return t<=n&&n<=r&&e<=o&&o<=i}function o(n,o,s,c){var d=0,p=0;if(null==n||(d=a(n,s))!==(p=a(o,s))||l(n,o)<0^s>0)do{c.point(0===d||3===d?t:r,d>1?i:e)}while((d=(d+s+4)%4)!==p);else c.point(o[0],o[1])}function a(i,n){return co(i[0]-t)<eo?n>0?0:3:co(i[0]-r)<eo?n>0?2:1:co(i[1]-e)<eo?n>0?1:0:n>0?3:2}function s(t,e){return l(t.x,e.x)}function l(t,e){var r=a(t,1),i=a(e,1);return r!==i?r-i:0===r?e[1]-t[1]:1===r?t[0]-e[0]:2===r?t[1]-e[1]:e[0]-t[0]}return function(a){var l,c,d,p,h,u,g,m,f,y,v,b=a,w=zo(),x={point:k,lineStart:function(){x.point=$,c&&c.push(d=[]);y=!0,f=!1,g=m=NaN},lineEnd:function(){l&&($(p,h),u&&f&&w.rejoin(),l.push(w.result()));x.point=k,f&&b.lineEnd()},polygonStart:function(){b=w,l=[],c=[],v=!0},polygonEnd:function(){var e=function(){for(var e=0,r=0,n=c.length;r<n;++r)for(var o,a,s=c[r],l=1,d=s.length,p=s[0],h=p[0],u=p[1];l<d;++l)o=h,a=u,h=(p=s[l])[0],u=p[1],a<=i?u>i&&(h-o)*(i-a)>(u-a)*(t-o)&&++e:u<=i&&(h-o)*(i-a)<(u-a)*(t-o)&&--e;return e}(),r=v&&e,n=(l=fe(l)).length;(r||n)&&(a.polygonStart(),r&&(a.lineStart(),o(null,null,1,a),a.lineEnd()),n&&Yo(l,s,e,o,a),a.polygonEnd());b=a,l=c=d=null}};function k(t,e){n(t,e)&&b.point(t,e)}function $(o,a){var s=n(o,a);if(c&&d.push([o,a]),y)p=o,h=a,u=s,y=!1,s&&(b.lineStart(),b.point(o,a));else if(s&&f)b.point(o,a);else{var l=[g=Math.max(ta,Math.min(Qo,g)),m=Math.max(ta,Math.min(Qo,m))],w=[o=Math.max(ta,Math.min(Qo,o)),a=Math.max(ta,Math.min(Qo,a))];!function(t,e,r,i,n,o){var a,s=t[0],l=t[1],c=0,d=1,p=e[0]-s,h=e[1]-l;if(a=r-s,p||!(a>0)){if(a/=p,p<0){if(a<c)return;a<d&&(d=a)}else if(p>0){if(a>d)return;a>c&&(c=a)}if(a=n-s,p||!(a<0)){if(a/=p,p<0){if(a>d)return;a>c&&(c=a)}else if(p>0){if(a<c)return;a<d&&(d=a)}if(a=i-l,h||!(a>0)){if(a/=h,h<0){if(a<c)return;a<d&&(d=a)}else if(h>0){if(a>d)return;a>c&&(c=a)}if(a=o-l,h||!(a<0)){if(a/=h,h<0){if(a>d)return;a>c&&(c=a)}else if(h>0){if(a<c)return;a<d&&(d=a)}return c>0&&(t[0]=s+c*p,t[1]=l+c*h),d<1&&(e[0]=s+d*p,e[1]=l+d*h),!0}}}}}(l,w,t,e,r,i)?s&&(b.lineStart(),b.point(o,a),v=!1):(f||(b.lineStart(),b.point(l[0],l[1])),b.point(w[0],w[1]),s||b.lineEnd(),v=!1)}g=o,m=a,f=s}return x}}var ra,ia,na,oa,aa=t=>t,sa=new de,la=new de,ca={point:xo,lineStart:xo,lineEnd:xo,polygonStart:function(){ca.lineStart=da,ca.lineEnd=ua},polygonEnd:function(){ca.lineStart=ca.lineEnd=ca.point=xo,sa.add(co(la)),la=new de},result:function(){var t=sa/2;return sa=new de,t}};function da(){ca.point=pa}function pa(t,e){ca.point=ha,ra=na=t,ia=oa=e}function ha(t,e){la.add(oa*t-na*e),na=t,oa=e}function ua(){ha(ra,ia)}var ga=1/0,ma=ga,fa=-ga,ya=fa,va={point:function(t,e){t<ga&&(ga=t);t>fa&&(fa=t);e<ma&&(ma=e);e>ya&&(ya=e)},lineStart:xo,lineEnd:xo,polygonStart:xo,polygonEnd:xo,result:function(){var t=[[ga,ma],[fa,ya]];return fa=ya=-(ma=ga=1/0),t}};var ba,wa,xa,ka,$a=0,Ca=0,_a=0,Da=0,Sa=0,Ma=0,Ta=0,Ea=0,Aa=0,Oa={point:Ia,lineStart:Pa,lineEnd:Na,polygonStart:function(){Oa.lineStart=La,Oa.lineEnd=Ra},polygonEnd:function(){Oa.point=Ia,Oa.lineStart=Pa,Oa.lineEnd=Na},result:function(){var t=Aa?[Ta/Aa,Ea/Aa]:Ma?[Da/Ma,Sa/Ma]:_a?[$a/_a,Ca/_a]:[NaN,NaN];return $a=Ca=_a=Da=Sa=Ma=Ta=Ea=Aa=0,t}};function Ia(t,e){$a+=t,Ca+=e,++_a}function Pa(){Oa.point=ja}function ja(t,e){Oa.point=qa,Ia(xa=t,ka=e)}function qa(t,e){var r=t-xa,i=e-ka,n=vo(r*r+i*i);Da+=n*(xa+t)/2,Sa+=n*(ka+e)/2,Ma+=n,Ia(xa=t,ka=e)}function Na(){Oa.point=Ia}function La(){Oa.point=Ua}function Ra(){Fa(ba,wa)}function Ua(t,e){Oa.point=Fa,Ia(ba=xa=t,wa=ka=e)}function Fa(t,e){var r=t-xa,i=e-ka,n=vo(r*r+i*i);Da+=n*(xa+t)/2,Sa+=n*(ka+e)/2,Ma+=n,Ta+=(n=ka*t-xa*e)*(xa+t),Ea+=n*(ka+e),Aa+=3*n,Ia(xa=t,ka=e)}function za(t){this._context=t}za.prototype={_radius:4.5,pointRadius:function(t){return this._radius=t,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._context.closePath(),this._point=NaN},point:function(t,e){switch(this._point){case 0:this._context.moveTo(t,e),this._point=1;break;case 1:this._context.lineTo(t,e);break;default:this._context.moveTo(t+this._radius,e),this._context.arc(t,e,this._radius,0,ao)}},result:xo};var Ba,Ha,Ya,Wa,Va,Ga=new de,Ka={point:xo,lineStart:function(){Ka.point=Xa},lineEnd:function(){Ba&&Ja(Ha,Ya),Ka.point=xo},polygonStart:function(){Ba=!0},polygonEnd:function(){Ba=null},result:function(){var t=+Ga;return Ga=new de,t}};function Xa(t,e){Ka.point=Ja,Ha=Wa=t,Ya=Va=e}function Ja(t,e){Wa-=t,Va-=e,Ga.add(vo(Wa*Wa+Va*Va)),Wa=t,Va=e}let Za,Qa,ts,es;class rs{constructor(t){this._append=null==t?is:function(t){const e=Math.floor(t);if(!(e>=0))throw new RangeError(`invalid digits: ${t}`);if(e>15)return is;if(e!==Za){const t=10**e;Za=e,Qa=function(e){let r=1;this._+=e[0];for(const i=e.length;r<i;++r)this._+=Math.round(arguments[r]*t)/t+e[r]}}return Qa}(t),this._radius=4.5,this._=""}pointRadius(t){return this._radius=+t,this}polygonStart(){this._line=0}polygonEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){0===this._line&&(this._+="Z"),this._point=NaN}point(t,e){switch(this._point){case 0:this._append`M${t},${e}`,this._point=1;break;case 1:this._append`L${t},${e}`;break;default:if(this._append`M${t},${e}`,this._radius!==ts||this._append!==Qa){const t=this._radius,e=this._;this._="",this._append`m0,${t}a${t},${t} 0 1,1 0,${-2*t}a${t},${t} 0 1,1 0,${2*t}z`,ts=t,Qa=this._append,es=this._,this._=e}this._+=es}}result(){const t=this._;return this._="",t.length?t:null}}function is(t){let e=1;this._+=t[0];for(const r=t.length;e<r;++e)this._+=arguments[e]+t[e]}function ns(t){return function(e){var r=new os;for(var i in t)r[i]=t[i];return r.stream=e,r}}function os(){}function as(t,e,r){var i=t.clipExtent&&t.clipExtent();return t.scale(150).translate([0,0]),null!=i&&t.clipExtent(null),So(r,t.stream(va)),e(va.result()),null!=i&&t.clipExtent(i),t}function ss(t,e,r){return as(t,(function(r){var i=e[1][0]-e[0][0],n=e[1][1]-e[0][1],o=Math.min(i/(r[1][0]-r[0][0]),n/(r[1][1]-r[0][1])),a=+e[0][0]+(i-o*(r[1][0]+r[0][0]))/2,s=+e[0][1]+(n-o*(r[1][1]+r[0][1]))/2;t.scale(150*o).translate([a,s])}),r)}os.prototype={constructor:os,point:function(t,e){this.stream.point(t,e)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};var ls=16,cs=uo(30*lo);function ds(t,e){return+e?function(t,e){function r(i,n,o,a,s,l,c,d,p,h,u,g,m,f){var y=c-i,v=d-n,b=y*y+v*v;if(b>4*e&&m--){var w=a+h,x=s+u,k=l+g,$=vo(w*w+x*x+k*k),C=wo(k/=$),_=co(co(k)-1)<eo||co(o-p)<eo?(o+p)/2:ho(x,w),D=t(_,C),S=D[0],M=D[1],T=S-i,E=M-n,A=v*T-y*E;(A*A/b>e||co((y*T+v*E)/b-.5)>.3||a*h+s*u+l*g<cs)&&(r(i,n,o,a,s,l,S,M,_,w/=$,x/=$,k,m,f),f.point(S,M),r(S,M,_,w,x,k,c,d,p,h,u,g,m,f))}}return function(e){var i,n,o,a,s,l,c,d,p,h,u,g,m={point:f,lineStart:y,lineEnd:b,polygonStart:function(){e.polygonStart(),m.lineStart=w},polygonEnd:function(){e.polygonEnd(),m.lineStart=y}};function f(r,i){r=t(r,i),e.point(r[0],r[1])}function y(){d=NaN,m.point=v,e.lineStart()}function v(i,n){var o=To([i,n]),a=t(i,n);r(d,p,c,h,u,g,d=a[0],p=a[1],c=i,h=o[0],u=o[1],g=o[2],ls,e),e.point(d,p)}function b(){m.point=f,e.lineEnd()}function w(){y(),m.point=x,m.lineEnd=k}function x(t,e){v(i=t,e),n=d,o=p,a=h,s=u,l=g,m.point=v}function k(){r(d,p,c,h,u,g,n,o,i,a,s,l,ls,e),m.lineEnd=b,b()}return m}}(t,e):function(t){return ns({point:function(e,r){e=t(e,r),this.stream.point(e[0],e[1])}})}(t)}var ps=ns({point:function(t,e){this.stream.point(t*lo,e*lo)}});function hs(t,e,r,i,n,o){if(!o)return function(t,e,r,i,n){function o(o,a){return[e+t*(o*=i),r-t*(a*=n)]}return o.invert=function(o,a){return[(o-e)/t*i,(r-a)/t*n]},o}(t,e,r,i,n);var a=uo(o),s=fo(o),l=a*t,c=s*t,d=a/t,p=s/t,h=(s*r-a*e)/t,u=(s*e+a*r)/t;function g(t,o){return[l*(t*=i)-c*(o*=n)+e,r-c*t-l*o]}return g.invert=function(t,e){return[i*(d*t-p*e+h),n*(u-p*t-d*e)]},g}function us(t){return function(t){var e,r,i,n,o,a,s,l,c,d,p=150,h=480,u=250,g=0,m=0,f=0,y=0,v=0,b=0,w=1,x=1,k=null,$=Jo,C=null,_=aa,D=.5;function S(t){return l(t[0]*lo,t[1]*lo)}function M(t){return(t=l.invert(t[0],t[1]))&&[t[0]*so,t[1]*so]}function T(){var t=hs(p,0,0,w,x,b).apply(null,e(g,m)),i=hs(p,h-t[0],u-t[1],w,x,b);return r=No(f,y,v),s=jo(e,i),l=jo(r,s),a=ds(s,D),E()}function E(){return c=d=null,S}return S.stream=function(t){return c&&d===t?c:c=ps(function(t){return ns({point:function(e,r){var i=t(e,r);return this.stream.point(i[0],i[1])}})}(r)($(a(_(d=t)))))},S.preclip=function(t){return arguments.length?($=t,k=void 0,E()):$},S.postclip=function(t){return arguments.length?(_=t,C=i=n=o=null,E()):_},S.clipAngle=function(t){return arguments.length?($=+t?Zo(k=t*lo):(k=null,Jo),E()):k*so},S.clipExtent=function(t){return arguments.length?(_=null==t?(C=i=n=o=null,aa):ea(C=+t[0][0],i=+t[0][1],n=+t[1][0],o=+t[1][1]),E()):null==C?null:[[C,i],[n,o]]},S.scale=function(t){return arguments.length?(p=+t,T()):p},S.translate=function(t){return arguments.length?(h=+t[0],u=+t[1],T()):[h,u]},S.center=function(t){return arguments.length?(g=t[0]%360*lo,m=t[1]%360*lo,T()):[g*so,m*so]},S.rotate=function(t){return arguments.length?(f=t[0]%360*lo,y=t[1]%360*lo,v=t.length>2?t[2]%360*lo:0,T()):[f*so,y*so,v*so]},S.angle=function(t){return arguments.length?(b=t%360*lo,T()):b*so},S.reflectX=function(t){return arguments.length?(w=t?-1:1,T()):w<0},S.reflectY=function(t){return arguments.length?(x=t?-1:1,T()):x<0},S.precision=function(t){return arguments.length?(a=ds(s,D=t*t),E()):vo(D)},S.fitExtent=function(t,e){return ss(S,t,e)},S.fitSize=function(t,e){return function(t,e,r){return ss(t,[[0,0],e],r)}(S,t,e)},S.fitWidth=function(t,e){return function(t,e,r){return as(t,(function(r){var i=+e,n=i/(r[1][0]-r[0][0]),o=(i-n*(r[1][0]+r[0][0]))/2,a=-n*r[0][1];t.scale(150*n).translate([o,a])}),r)}(S,t,e)},S.fitHeight=function(t,e){return function(t,e,r){return as(t,(function(r){var i=+e,n=i/(r[1][1]-r[0][1]),o=-n*r[0][0],a=(i-n*(r[1][1]+r[0][1]))/2;t.scale(150*n).translate([o,a])}),r)}(S,t,e)},function(){return e=t.apply(this,arguments),S.invert=e.invert&&M,T()}}((function(){return t}))()}function gs(t,e){return[t,mo(bo((no+e)/2))]}function ms(){return function(t){var e,r,i,n=us(t),o=n.center,a=n.scale,s=n.translate,l=n.clipExtent,c=null;function d(){var o=io*a(),s=n(function(t){function e(e){return(e=t(e[0]*lo,e[1]*lo))[0]*=so,e[1]*=so,e}return t=No(t[0]*lo,t[1]*lo,t.length>2?t[2]*lo:0),e.invert=function(e){return(e=t.invert(e[0]*lo,e[1]*lo))[0]*=so,e[1]*=so,e},e}(n.rotate()).invert([0,0]));return l(null==c?[[s[0]-o,s[1]-o],[s[0]+o,s[1]+o]]:t===gs?[[Math.max(s[0]-o,c),e],[Math.min(s[0]+o,r),i]]:[[c,Math.max(s[1]-o,e)],[r,Math.min(s[1]+o,i)]])}return n.scale=function(t){return arguments.length?(a(t),d()):a()},n.translate=function(t){return arguments.length?(s(t),d()):s()},n.center=function(t){return arguments.length?(o(t),d()):o()},n.clipExtent=function(t){return arguments.length?(null==t?c=e=r=i=null:(c=+t[0][0],e=+t[0][1],r=+t[1][0],i=+t[1][1]),d()):null==c?null:[[c,e],[r,i]]},d()}(gs).scale(961/ao)}function fs(t,e){switch(arguments.length){case 0:break;case 1:this.range(t);break;default:this.range(e).domain(t)}return this}function ys(t){return+t}gs.invert=function(t,e){return[t,2*po(go(e))-no]};var vs=[0,1];function bs(t){return t}function ws(t,e){return(e-=t=+t)?function(r){return(r-t)/e}:function(t){return function(){return t}}(isNaN(e)?NaN:.5)}function xs(t,e,r){var i=t[0],n=t[1],o=e[0],a=e[1];return n<i?(i=ws(n,i),o=r(a,o)):(i=ws(i,n),o=r(o,a)),function(t){return o(i(t))}}function ks(t,e,r){var i=Math.min(t.length,e.length)-1,n=new Array(i),o=new Array(i),a=-1;for(t[i]<t[0]&&(t=t.slice().reverse(),e=e.slice().reverse());++a<i;)n[a]=ws(t[a],t[a+1]),o[a]=r(e[a],e[a+1]);return function(e){var r=ce(t,e,1,i)-1;return o[r](n[r](e))}}function $s(){var t,e,r,i,n,o,a=vs,s=vs,l=Si,c=bs;function d(){var t=Math.min(a.length,s.length);return c!==bs&&(c=function(t,e){var r;return t>e&&(r=t,t=e,e=r),function(r){return Math.max(t,Math.min(e,r))}}(a[0],a[t-1])),i=t>2?ks:xs,n=o=null,p}function p(e){return null==e||isNaN(e=+e)?r:(n||(n=i(a.map(t),s,l)))(t(c(e)))}return p.invert=function(r){return c(e((o||(o=i(s,a.map(t),ki)))(r)))},p.domain=function(t){return arguments.length?(a=Array.from(t,ys),d()):a.slice()},p.range=function(t){return arguments.length?(s=Array.from(t),d()):s.slice()},p.rangeRound=function(t){return s=Array.from(t),l=Mi,d()},p.clamp=function(t){return arguments.length?(c=!!t||bs,d()):c!==bs},p.interpolate=function(t){return arguments.length?(l=t,d()):l},p.unknown=function(t){return arguments.length?(r=t,p):r},function(r,i){return t=r,e=i,d()}}function Cs(t,e,r,i){var n,o=function(t,e,r){r=+r;const i=(e=+e)<(t=+t),n=i?me(e,t,r):me(t,e,r);return(i?-1:1)*(n<0?1/-n:n)}(t,e,r);switch((i=Hn(null==i?",f":i)).type){case"s":var a=Math.max(Math.abs(t),Math.abs(e));return null!=i.precision||isNaN(n=function(t,e){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(Fn(e)/3)))-Fn(Math.abs(t)))}(o,a))||(i.precision=n),Jn(i,a);case"":case"e":case"g":case"p":case"r":null!=i.precision||isNaN(n=function(t,e){return t=Math.abs(t),e=Math.abs(e)-t,Math.max(0,Fn(e)-Fn(t))+1}(o,Math.max(Math.abs(t),Math.abs(e))))||(i.precision=n-("e"===i.type));break;case"f":case"%":null!=i.precision||isNaN(n=function(t){return Math.max(0,-Fn(Math.abs(t)))}(o))||(i.precision=n-2*("%"===i.type))}return Xn(i)}function _s(t){var e=t.domain;return t.ticks=function(t){var r=e();return function(t,e,r){if(!((r=+r)>0))return[];if((t=+t)==(e=+e))return[t];const i=e<t,[n,o,a]=i?ge(e,t,r):ge(t,e,r);if(!(o>=n))return[];const s=o-n+1,l=new Array(s);if(i)if(a<0)for(let t=0;t<s;++t)l[t]=(o-t)/-a;else for(let t=0;t<s;++t)l[t]=(o-t)*a;else if(a<0)for(let t=0;t<s;++t)l[t]=(n+t)/-a;else for(let t=0;t<s;++t)l[t]=(n+t)*a;return l}(r[0],r[r.length-1],null==t?10:t)},t.tickFormat=function(t,r){var i=e();return Cs(i[0],i[i.length-1],null==t?10:t,r)},t.nice=function(r){null==r&&(r=10);var i,n,o=e(),a=0,s=o.length-1,l=o[a],c=o[s],d=10;for(c<l&&(n=l,l=c,c=n,n=a,a=s,s=n);d-- >0;){if((n=me(l,c,r))===i)return o[a]=l,o[s]=c,e(o);if(n>0)l=Math.floor(l/n)*n,c=Math.ceil(c/n)*n;else{if(!(n<0))break;l=Math.ceil(l*n)/n,c=Math.floor(c*n)/n}i=n}return t},t}function Ds(){var t=$s()(bs,bs);return t.copy=function(){return e=t,Ds().domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());var e},fs.apply(t,arguments),_s(t)}function Ss(t,e,r){this.k=t,this.x=e,this.y=r}function Ms(t){return t}function Ts(t,e){var r=e.id,i=e.bbox,n=null==e.properties?{}:e.properties,o=function(t,e){var r=function(t){if(null==t)return Ms;var e,r,i=t.scale[0],n=t.scale[1],o=t.translate[0],a=t.translate[1];return function(t,s){s||(e=r=0);var l=2,c=t.length,d=new Array(c);for(d[0]=(e+=t[0])*i+o,d[1]=(r+=t[1])*n+a;l<c;)d[l]=t[l],++l;return d}}(t.transform),i=t.arcs;function n(t,e){e.length&&e.pop();for(var n=i[t<0?~t:t],o=0,a=n.length;o<a;++o)e.push(r(n[o],o));t<0&&function(t,e){for(var r,i=t.length,n=i-e;n<--i;)r=t[n],t[n++]=t[i],t[i]=r}(e,a)}function o(t){return r(t)}function a(t){for(var e=[],r=0,i=t.length;r<i;++r)n(t[r],e);return e.length<2&&e.push(e[0]),e}function s(t){for(var e=a(t);e.length<4;)e.push(e[0]);return e}function l(t){return t.map(s)}function c(t){var e,r=t.type;switch(r){case"GeometryCollection":return{type:r,geometries:t.geometries.map(c)};case"Point":e=o(t.coordinates);break;case"MultiPoint":e=t.coordinates.map(o);break;case"LineString":e=a(t.arcs);break;case"MultiLineString":e=t.arcs.map(a);break;case"Polygon":e=l(t.arcs);break;case"MultiPolygon":e=t.arcs.map(l);break;default:return null}return{type:r,coordinates:e}}return c(e)}(t,e);return null==r&&null==i?{type:"Feature",properties:n,geometry:o}:null==i?{type:"Feature",id:r,properties:n,geometry:o}:{type:"Feature",id:r,bbox:i,properties:n,geometry:o}}Ss.prototype={constructor:Ss,scale:function(t){return 1===t?this:new Ss(this.k*t,this.x,this.y)},translate:function(t,e){return 0===t&0===e?this:new Ss(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}},Ss.prototype;var Es=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let As=class extends dt{constructor(){super(),this.loading=!0,this.darkTheme=!1,this.defaultFill="#038bff",this.resizeMap=this.resizeMap.bind(this),this.drawMap=this.drawMap.bind(this),this.getDataset=this.getDataset.bind(this),this.darkTheme=document.querySelector("html").classList.contains("dark")||!1}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.updateCountries.bind(this))}updated(t){t.get("query")&&(this.loading=!0,this.countries=void 0,this.fetchCountries())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this.resizeMap)}firstUpdated(){this.fetchCountries(),window.addEventListener("resize",this.resizeMap)}getDataset(){const t={};if(this.countries){var e=this.countries.map((function(t){return t.visitors})),r=Math.max.apply(null,e);const i=Ds().domain([0,r]).range([this.darkTheme?"#2e3954":"#f3ebff",this.darkTheme?"#6366f1":"#a779e9"]);this.countries.forEach((function(e){t[e.alpha_3]={numberOfThings:e.visitors,fillColor:i(e.visitors)}}))}return t}updateCountries(){this.fetchCountries().then((()=>{const t=this.getDataset();Pr(this.$$("#map-container")).selectAll("path.country").attr("fill",(e=>{const r=t[e.id];return r?r.fillColor:this.defaultFill}))}))}fetchCountries(){return U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/countries`,this.query,{limit:300}).then((async t=>{this.loading=!1,this.countries=t,await this.updateComplete,this.drawMap()}))}resizeMap(){this.map&&this.map.resize()}drawMap(){const t=this.getDataset();"realtime"===this.query.period?this.t("Current visitors"):this.t("Visitors");const e=this.darkTheme?"#2d3747":"#f8fafc",r=this.darkTheme?"#374151":"#F5F5F5",i=this.darkTheme?"#1f2937":"#dae1e7",n=this.darkTheme?"#4f46e5":"#a779e9";(function(t,e){return fetch(t,e).then(Rn)})("/topo/world.json").then((o=>{const a=function(t,e){return"string"==typeof e&&(e=t.objects[e]),"GeometryCollection"===e.type?{type:"FeatureCollection",features:e.geometries.map((function(e){return Ts(t,e)}))}:Ts(t,e)}(o,o.objects.countries).features,s=ms(),l=function(t,e){let r,i,n=3,o=4.5;function a(t){return t&&("function"==typeof o&&i.pointRadius(+o.apply(this,arguments)),So(t,r(i))),i.result()}return a.area=function(t){return So(t,r(ca)),ca.result()},a.measure=function(t){return So(t,r(Ka)),Ka.result()},a.bounds=function(t){return So(t,r(va)),va.result()},a.centroid=function(t){return So(t,r(Oa)),Oa.result()},a.projection=function(e){return arguments.length?(r=null==e?(t=null,aa):(t=e).stream,a):t},a.context=function(t){return arguments.length?(i=null==t?(e=null,new rs(n)):new za(e=t),"function"!=typeof o&&i.pointRadius(o),a):e},a.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(i.pointRadius(+t),+t),a):o},a.digits=function(t){if(!arguments.length)return n;if(null==t)n=null;else{const e=Math.floor(t);if(!(e>=0))throw new RangeError(`invalid digits: ${t}`);n=e}return null===e&&(i=new rs(n)),a},a.projection(t).digits(n).context(e)}().communityion(s);Pr(this.$$("#map-container")).append("svg").selectAll("path").data(a).enter().append("path").attr("d",(t=>l(t))).attr("class","country").attr("fill",(r=>t[r.id]?.fillColor??e)).attr("stroke",i).on("mouseover",((e,i)=>{Pr(e.target).attr("fill",t[i.id]?.fillColor??r).attr("stroke",n)})).on("mouseout",((r,n)=>{Pr(r.target).attr("fill",t[n.id]?.fillColor??e).attr("stroke",i)})).on("click",(t=>{const e=this.countries?.find((e=>e.alpha_3===t.id));e&&(this.onClick(),rt(this.history,this.query,{country:e.code,country_name:e.name}))}))}))}onClick(){}geolocationDbNotice(){return this.site.isDbip?o`
        <span class="text-xs text-gray-500 absolute bottom-4 right-3"
          >IP Geolocation by
          <a
            target="_blank"
            href="https://db-ip.com"
            rel="noreferrer"
            class="text-indigo-600"
            >DB-IP</a
          ></span
        >
      `:null}renderBody(){return this.countries?o`
        <div
          class="mx-auto mt-4"
          style="overflow: hidden; width: 100%; max-width: 475px; height: 335px"
          id="map-container"
        ></div>
        <pl-more-link
          .site=${this.site}
          .list=${this.countries}
          endpoint="countries"
        ></pl-more-link>
        ${this.geolocationDbNotice()}
      `:null}render(){return o`
      ${this.loading?o`<div class="mx-auto my-32 loading"><div></div></div>`:a}
      <pl-fade-in .show=${!this.loading}> ${this.renderBody()} </pl-fade-in>
    `}};Es([r({type:Array})],As.prototype,"countries",void 0),Es([r({type:Boolean})],As.prototype,"loading",void 0),Es([r({type:Boolean})],As.prototype,"darkTheme",void 0),Es([r({type:Object})],As.prototype,"history",void 0),Es([r({type:Object})],As.prototype,"map",void 0),As=Es([n("pl-countries-map")],As);var Os=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Is=class extends dt{connectedCallback(){super.connectedCallback(),this.tabKey=`pageTab__${this.site.domain}`,this.mode=this.storedTab||"map",this.timer&&this.timer.onTick(this.renderCountries.bind(this))}setMode(t){B(this.tabKey,t),this.mode=t}updated(t){if(t.get("query")){const e=e=>t.get("query").filters[e]&&!this.query.filters[e];"cities"===this.mode&&e("region")&&this.setMode("regions"),"regions"===this.mode&&e("country")&&this.setMode(this.countriesRestoreMode||"countries")}}onCountryFilter(t){this.countriesRestoreMode=t,this.setMode("regions")}onRegionFilter(){this.setMode("cities")}renderCountries(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/countries"),this.query,{limit:9}).then((t=>t.map((t=>Object.assign({},t,{percentage:void 0})))))}
        .filter=${{country:"code",country_name:"name"}}
        @click=${()=>this.onCountryFilter("countries")}
        .keyLabel=${this.t("Country")}
        .detailsLink=${st(this.site,"/countries")}
        .query=${this.query}
        .timer=${this.timer}
        .renderIcon=${t=>o`<span class="mr-1">${t.flag}</span>`}
        color="bg-orange-50"
      ></pl-list-report>
    `}renderRegions(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/regions"),this.query,{limit:9})}
        .filter=${{region:"code",region_name:"name"}}
        @click=${this.onRegionFilter}
        .keyLabel=${this.t("Region")}
        .detailsLink=${st(this.site,"/regions")}
        .query=${this.query}
        .renderIcon=${t=>o`<span class="mr-1">export${t.country_flag}</span>`}
        color="bg-orange-50"
      ></pl-list-report>
    `}renderCities(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>U(this.proxyUrl,at(this.site,"/cities"),this.query,{limit:9})}
        .filter=${{city:"code",city_name:"name"}}
        .keyLabel=${this.t("City")}
        .detailsLink=${st(this.site,"/cities")}
        .query=${this.query}
        .renderIcon=${t=>o`<span class="mr-1">{city.country_flag}</span>`}
        color="bg-orange-50"
      ></pl-list-report>
    `}get labelFor(){return{countries:"Countries",regions:"Regions",cities:"Cities"}}renderContent(){switch(this.mode){case"cities":return this.renderCities();case"regions":return this.renderRegions();case"countries":return this.renderCountries();default:return o`<pl-countries-map
          @click=${()=>this.onCountryFilter("map")}
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl=${this.proxyUrl}
        ></pl-countries-map>`}}renderPill(t,e){return this.mode===e?o`
        <li
          class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading"
        >
          ${this.t(t)}
        </li>
      `:o`
        <li
          class="hover:text-indigo-600 cursor-pointer"
          @click=${()=>this.setMode(e)}
        >
          ${this.t(t)}
        </li>
      `}render(){return o`
      <div class="stats-item flex flex-col w-full mt-6 stats-item--has-header">
        <div
          class="stats-item-header flex flex-col flex-grow bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
        >
          <div class="w-full flex justify-between">
            <h3 class="font-bold dark:text-gray-100">
              ${this.t(this.labelFor[this.mode])||this.t("Locations")}
            </h3>
            <ul
              class="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2"
            >
              ${this.renderPill("Map","map")}
              ${this.renderPill("Countries","countries")}
              ${this.renderPill("Regions","regions")}
              ${this.renderPill("Cities","cities")}
            </ul>
          </div>
          ${this.renderContent()}
        </div>
      </div>
    `}};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function Ps(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}Os([r({type:String})],Is.prototype,"tabKey",void 0),Os([r({type:String})],Is.prototype,"storedTab",void 0),Os([r({type:String})],Is.prototype,"mode",void 0),Is=Os([n("pl-locations")],Is);const js=window,qs=js.ShadowRoot&&(void 0===js.ShadyCSS||js.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ns=Symbol(),Ls=new WeakMap;let Rs=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Ns)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(qs&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=Ls.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Ls.set(e,t))}return t}toString(){return this.cssText}};const Us=(t,...e)=>{const r=1===t.length?t[0]:e.reduce(((e,r,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1]),t[0]);return new Rs(r,t,Ns)},Fs=qs?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new Rs("string"==typeof t?t:t+"",void 0,Ns))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var zs;const Bs=window,Hs=Bs.trustedTypes,Ys=Hs?Hs.emptyScript:"",Ws=Bs.reactiveElementPolyfillSupport,Vs={toAttribute(t,e){switch(e){case Boolean:t=t?Ys:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},Gs=(t,e)=>e!==t&&(e==e||t==t),Ks={attribute:!0,type:String,converter:Vs,reflect:!1,hasChanged:Gs},Xs="finalized";let Js=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,r)=>{const i=this._$Ep(r,e);void 0!==i&&(this._$Ev.set(i,r),t.push(i))})),t}static createProperty(t,e=Ks){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const r="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,r,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){return{get(){return this[e]},set(i){const n=this[t];this[e]=i,this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Ks}static finalize(){if(this.hasOwnProperty(Xs))return!1;this[Xs]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const r of e)this.createProperty(r,t[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(Fs(t))}else void 0!==t&&e.push(Fs(t));return e}static _$Ep(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,r;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(r=t.hostConnected)||void 0===r||r.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{qs?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const r=document.createElement("style"),i=js.litNonce;void 0!==i&&r.setAttribute("nonce",i),r.textContent=e.cssText,t.appendChild(r)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EO(t,e,r=Ks){var i;const n=this.constructor._$Ep(t,r);if(void 0!==n&&!0===r.reflect){const o=(void 0!==(null===(i=r.converter)||void 0===i?void 0:i.toAttribute)?r.converter:Vs).toAttribute(e,r.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var r;const i=this.constructor,n=i._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=i.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(r=t.converter)||void 0===r?void 0:r.fromAttribute)?t.converter:Vs;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,r){let i=!0;void 0!==t&&(((r=r||this.constructor.getPropertyOptions(t)).hasChanged||Gs)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===r.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,r))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(r)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Zs;Js[Xs]=!0,Js.elementProperties=new Map,Js.elementStyles=[],Js.shadowRootOptions={mode:"open"},null==Ws||Ws({ReactiveElement:Js}),(null!==(zs=Bs.reactiveElementVersions)&&void 0!==zs?zs:Bs.reactiveElementVersions=[]).push("1.6.3");const Qs=window,tl=Qs.trustedTypes,el=tl?tl.createPolicy("lit-html",{createHTML:t=>t}):void 0,rl="$lit$",il=`lit$${(Math.random()+"").slice(9)}$`,nl="?"+il,ol=`<${nl}>`,al=document,sl=()=>al.createComment(""),ll=t=>null===t||"object"!=typeof t&&"function"!=typeof t,cl=Array.isArray,dl="[ \t\n\f\r]",pl=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hl=/-->/g,ul=/>/g,gl=RegExp(`>|${dl}(?:([^\\s"'>=/]+)(${dl}*=${dl}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),ml=/'/g,fl=/"/g,yl=/^(?:script|style|textarea|title)$/i,vl=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),bl=Symbol.for("lit-noChange"),wl=Symbol.for("lit-nothing"),xl=new WeakMap,kl=al.createTreeWalker(al,129,null,!1);function $l(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==el?el.createHTML(e):e}const Cl=(t,e)=>{const r=t.length-1,i=[];let n,o=2===e?"<svg>":"",a=pl;for(let e=0;e<r;e++){const r=t[e];let s,l,c=-1,d=0;for(;d<r.length&&(a.lastIndex=d,l=a.exec(r),null!==l);)d=a.lastIndex,a===pl?"!--"===l[1]?a=hl:void 0!==l[1]?a=ul:void 0!==l[2]?(yl.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=gl):void 0!==l[3]&&(a=gl):a===gl?">"===l[0]?(a=null!=n?n:pl,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,s=l[1],a=void 0===l[3]?gl:'"'===l[3]?fl:ml):a===fl||a===ml?a=gl:a===hl||a===ul?a=pl:(a=gl,n=void 0);const p=a===gl&&t[e+1].startsWith("/>")?" ":"";o+=a===pl?r+ol:c>=0?(i.push(s),r.slice(0,c)+rl+r.slice(c)+il+p):r+il+(-2===c?(i.push(void 0),e):p)}return[$l(t,o+(t[r]||"<?>")+(2===e?"</svg>":"")),i]};class _l{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let n=0,o=0;const a=t.length-1,s=this.parts,[l,c]=Cl(t,e);if(this.el=_l.createElement(l,r),kl.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=kl.nextNode())&&s.length<a;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith(rl)||e.startsWith(il)){const r=c[o++];if(t.push(e),void 0!==r){const t=i.getAttribute(r.toLowerCase()+rl).split(il),e=/([.?@])?(.*)/.exec(r);s.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?El:"?"===e[1]?Ol:"@"===e[1]?Il:Tl})}else s.push({type:6,index:n})}for(const e of t)i.removeAttribute(e)}if(yl.test(i.tagName)){const t=i.textContent.split(il),e=t.length-1;if(e>0){i.textContent=tl?tl.emptyScript:"";for(let r=0;r<e;r++)i.append(t[r],sl()),kl.nextNode(),s.push({type:2,index:++n});i.append(t[e],sl())}}}else if(8===i.nodeType)if(i.data===nl)s.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(il,t+1));)s.push({type:7,index:n}),t+=il.length-1}n++}}static createElement(t,e){const r=al.createElement("template");return r.innerHTML=t,r}}function Dl(t,e,r=t,i){var n,o,a,s;if(e===bl)return e;let l=void 0!==i?null===(n=r._$Co)||void 0===n?void 0:n[i]:r._$Cl;const c=ll(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,r,i)),void 0!==i?(null!==(a=(s=r)._$Co)&&void 0!==a?a:s._$Co=[])[i]=l:r._$Cl=l),void 0!==l&&(e=Dl(t,l._$AS(t,e.values),l,i)),e}class Sl{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:r},parts:i}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:al).importNode(r,!0);kl.currentNode=n;let o=kl.nextNode(),a=0,s=0,l=i[0];for(;void 0!==l;){if(a===l.index){let e;2===l.type?e=new Ml(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Pl(o,this,t)),this._$AV.push(e),l=i[++s]}a!==(null==l?void 0:l.index)&&(o=kl.nextNode(),a++)}return kl.currentNode=al,n}v(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Ml{constructor(t,e,r,i){var n;this.type=2,this._$AH=wl,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cp=null===(n=null==i?void 0:i.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Dl(this,t,e),ll(t)?t===wl||null==t||""===t?(this._$AH!==wl&&this._$AR(),this._$AH=wl):t!==this._$AH&&t!==bl&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>cl(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==wl&&ll(this._$AH)?this._$AA.nextSibling.data=t:this.$(al.createTextNode(t)),this._$AH=t}g(t){var e;const{values:r,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=_l.createElement($l(i.h,i.h[0]),this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(r);else{const t=new Sl(n,this),e=t.u(this.options);t.v(r),this.$(e),this._$AH=t}}_$AC(t){let e=xl.get(t.strings);return void 0===e&&xl.set(t.strings,e=new _l(t)),e}T(t){cl(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const n of t)i===e.length?e.push(r=new Ml(this.k(sl()),this.k(sl()),this,this.options)):r=e[i],r._$AI(n),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Tl{constructor(t,e,r,i,n){this.type=1,this._$AH=wl,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=wl}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,r,i){const n=this.strings;let o=!1;if(void 0===n)t=Dl(this,t,e,0),o=!ll(t)||t!==this._$AH&&t!==bl,o&&(this._$AH=t);else{const i=t;let a,s;for(t=n[0],a=0;a<n.length-1;a++)s=Dl(this,i[r+a],e,a),s===bl&&(s=this._$AH[a]),o||(o=!ll(s)||s!==this._$AH[a]),s===wl?t=wl:t!==wl&&(t+=(null!=s?s:"")+n[a+1]),this._$AH[a]=s}o&&!i&&this.j(t)}j(t){t===wl?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class El extends Tl{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===wl?void 0:t}}const Al=tl?tl.emptyScript:"";class Ol extends Tl{constructor(){super(...arguments),this.type=4}j(t){t&&t!==wl?this.element.setAttribute(this.name,Al):this.element.removeAttribute(this.name)}}class Il extends Tl{constructor(t,e,r,i,n){super(t,e,r,i,n),this.type=5}_$AI(t,e=this){var r;if((t=null!==(r=Dl(this,t,e,0))&&void 0!==r?r:wl)===bl)return;const i=this._$AH,n=t===wl&&i!==wl||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==wl&&(i===wl||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==r?r:this.element,t):this._$AH.handleEvent(t)}}class Pl{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Dl(this,t)}}const jl=Qs.litHtmlPolyfillSupport;null==jl||jl(_l,Ml),(null!==(Zs=Qs.litHtmlVersions)&&void 0!==Zs?Zs:Qs.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var ql,Nl;class Ll extends Js{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const r=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=r.firstChild),r}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{var i,n;const o=null!==(i=null==r?void 0:r.renderBefore)&&void 0!==i?i:e;let a=o._$litPart$;if(void 0===a){const t=null!==(n=null==r?void 0:r.renderBefore)&&void 0!==n?n:null;o._$litPart$=a=new Ml(e.insertBefore(sl(),t),t,void 0,null!=r?r:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return bl}}Ll.finalized=!0,Ll._$litElement$=!0,null===(ql=globalThis.litElementHydrateSupport)||void 0===ql||ql.call(globalThis,{LitElement:Ll});const Rl=globalThis.litElementPolyfillSupport;null==Rl||Rl({LitElement:Ll}),(null!==(Nl=globalThis.litElementVersions)&&void 0!==Nl?Nl:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ul=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(r){r.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(r){r.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Fl(t){return(e,r)=>void 0!==r?((t,e,r)=>{e.constructor.createProperty(r,t)})(t,e,r):Ul(t,e)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var zl;null===(zl=window.HTMLSlotElement)||void 0===zl||zl.prototype.assignedElements;var Bl=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Hl={_disable:[],allowInput:!1,allowInvalidPreload:!1,altFormat:"F j, Y",altInput:!1,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:!0,clickOpens:!0,closeOnSelect:!0,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:!1,enableSeconds:!1,enableTime:!1,errorHandler:function(t){return"undefined"!=typeof console&&console.warn(t)},getWeek:function(t){var e=new Date(t.getTime());e.setHours(0,0,0,0),e.setDate(e.getDate()+3-(e.getDay()+6)%7);var r=new Date(e.getFullYear(),0,4);return 1+Math.round(((e.getTime()-r.getTime())/864e5-3+(r.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:!1,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:!1,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:!1,showMonths:1,static:!1,time_24hr:!1,weekNumbers:!1,wrap:!1},Yl={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(t){var e=t%100;if(e>3&&e<21)return"th";switch(e%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:!1},Wl=function(t,e){return void 0===e&&(e=2),("000"+t).slice(-1*e)},Vl=function(t){return!0===t?1:0};function Gl(t,e){var r;return function(){var i=this,n=arguments;clearTimeout(r),r=setTimeout((function(){return t.apply(i,n)}),e)}}var Kl=function(t){return t instanceof Array?t:[t]};function Xl(t,e,r){if(!0===r)return t.classList.add(e);t.classList.remove(e)}function Jl(t,e,r){var i=window.document.createElement(t);return e=e||"",r=r||"",i.className=e,void 0!==r&&(i.textContent=r),i}function Zl(t){for(;t.firstChild;)t.removeChild(t.firstChild)}function Ql(t,e){return e(t)?t:t.parentNode?Ql(t.parentNode,e):void 0}function tc(t,e){var r=Jl("div","numInputWrapper"),i=Jl("input","numInput "+t),n=Jl("span","arrowUp"),o=Jl("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?i.type="number":(i.type="text",i.pattern="\\d*"),void 0!==e)for(var a in e)i.setAttribute(a,e[a]);return r.appendChild(i),r.appendChild(n),r.appendChild(o),r}function ec(t){try{return"function"==typeof t.composedPath?t.composedPath()[0]:t.target}catch(e){return t.target}}var rc=function(){},ic=function(t,e,r){return r.months[e?"shorthand":"longhand"][t]},nc={D:rc,F:function(t,e,r){t.setMonth(r.months.longhand.indexOf(e))},G:function(t,e){t.setHours((t.getHours()>=12?12:0)+parseFloat(e))},H:function(t,e){t.setHours(parseFloat(e))},J:function(t,e){t.setDate(parseFloat(e))},K:function(t,e,r){t.setHours(t.getHours()%12+12*Vl(new RegExp(r.amPM[1],"i").test(e)))},M:function(t,e,r){t.setMonth(r.months.shorthand.indexOf(e))},S:function(t,e){t.setSeconds(parseFloat(e))},U:function(t,e){return new Date(1e3*parseFloat(e))},W:function(t,e,r){var i=parseInt(e),n=new Date(t.getFullYear(),0,2+7*(i-1),0,0,0,0);return n.setDate(n.getDate()-n.getDay()+r.firstDayOfWeek),n},Y:function(t,e){t.setFullYear(parseFloat(e))},Z:function(t,e){return new Date(e)},d:function(t,e){t.setDate(parseFloat(e))},h:function(t,e){t.setHours((t.getHours()>=12?12:0)+parseFloat(e))},i:function(t,e){t.setMinutes(parseFloat(e))},j:function(t,e){t.setDate(parseFloat(e))},l:rc,m:function(t,e){t.setMonth(parseFloat(e)-1)},n:function(t,e){t.setMonth(parseFloat(e)-1)},s:function(t,e){t.setSeconds(parseFloat(e))},u:function(t,e){return new Date(parseFloat(e))},w:rc,y:function(t,e){t.setFullYear(2e3+parseFloat(e))}},oc={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},ac={Z:function(t){return t.toISOString()},D:function(t,e,r){return e.weekdays.shorthand[ac.w(t,e,r)]},F:function(t,e,r){return ic(ac.n(t,e,r)-1,!1,e)},G:function(t,e,r){return Wl(ac.h(t,e,r))},H:function(t){return Wl(t.getHours())},J:function(t,e){return void 0!==e.ordinal?t.getDate()+e.ordinal(t.getDate()):t.getDate()},K:function(t,e){return e.amPM[Vl(t.getHours()>11)]},M:function(t,e){return ic(t.getMonth(),!0,e)},S:function(t){return Wl(t.getSeconds())},U:function(t){return t.getTime()/1e3},W:function(t,e,r){return r.getWeek(t)},Y:function(t){return Wl(t.getFullYear(),4)},d:function(t){return Wl(t.getDate())},h:function(t){return t.getHours()%12?t.getHours()%12:12},i:function(t){return Wl(t.getMinutes())},j:function(t){return t.getDate()},l:function(t,e){return e.weekdays.longhand[t.getDay()]},m:function(t){return Wl(t.getMonth()+1)},n:function(t){return t.getMonth()+1},s:function(t){return t.getSeconds()},u:function(t){return t.getTime()},w:function(t){return t.getDay()},y:function(t){return String(t.getFullYear()).substring(2)}},sc=function(t){var e=t.config,r=void 0===e?Hl:e,i=t.l10n,n=void 0===i?Yl:i,o=t.isMobile,a=void 0!==o&&o;return function(t,e,i){var o=i||n;return void 0===r.formatDate||a?e.split("").map((function(e,i,n){return ac[e]&&"\\"!==n[i-1]?ac[e](t,o,r):"\\"!==e?e:""})).join(""):r.formatDate(t,e,o)}},lc=function(t){var e=t.config,r=void 0===e?Hl:e,i=t.l10n,n=void 0===i?Yl:i;return function(t,e,i,o){if(0===t||t){var a,s=o||n,l=t;if(t instanceof Date)a=new Date(t.getTime());else if("string"!=typeof t&&void 0!==t.toFixed)a=new Date(t);else if("string"==typeof t){var c=e||(r||Hl).dateFormat,d=String(t).trim();if("today"===d)a=new Date,i=!0;else if(r&&r.parseDate)a=r.parseDate(t,c);else if(/Z$/.test(d)||/GMT$/.test(d))a=new Date(t);else{for(var p=void 0,h=[],u=0,g=0,m="";u<c.length;u++){var f=c[u],y="\\"===f,v="\\"===c[u-1]||y;if(oc[f]&&!v){m+=oc[f];var b=new RegExp(m).exec(t);b&&(p=!0)&&h["Y"!==f?"push":"unshift"]({fn:nc[f],val:b[++g]})}else y||(m+=".")}a=r&&r.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),h.forEach((function(t){var e=t.fn,r=t.val;return a=e(a,r,s)||a})),a=p?a:void 0}}if(a instanceof Date&&!isNaN(a.getTime()))return!0===i&&a.setHours(0,0,0,0),a;r.errorHandler(new Error("Invalid date provided: "+l))}}};function cc(t,e,r){return void 0===r&&(r=!0),!1!==r?new Date(t.getTime()).setHours(0,0,0,0)-new Date(e.getTime()).setHours(0,0,0,0):t.getTime()-e.getTime()}var dc=function(t,e,r){return t>Math.min(e,r)&&t<Math.max(e,r)},pc=function(t,e,r){return 3600*t+60*e+r},hc=function(t){var e=Math.floor(t/3600),r=(t-3600*e)/60;return[e,r,t-3600*e-60*r]},uc={DAY:864e5};function gc(t){var e=t.defaultHour,r=t.defaultMinute,i=t.defaultSeconds;if(void 0!==t.minDate){var n=t.minDate.getHours(),o=t.minDate.getMinutes(),a=t.minDate.getSeconds();e<n&&(e=n),e===n&&r<o&&(r=o),e===n&&r===o&&i<a&&(i=t.minDate.getSeconds())}if(void 0!==t.maxDate){var s=t.maxDate.getHours(),l=t.maxDate.getMinutes();(e=Math.min(e,s))===s&&(r=Math.min(l,r)),e===s&&r===l&&(i=t.maxDate.getSeconds())}return{hours:e,minutes:r,seconds:i}}"function"!=typeof Object.assign&&(Object.assign=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(!t)throw TypeError("Cannot convert undefined or null to object");for(var i=function(e){e&&Object.keys(e).forEach((function(r){return t[r]=e[r]}))},n=0,o=e;n<o.length;n++){i(o[n])}return t});var mc=function(){return mc=Object.assign||function(t){for(var e,r=1,i=arguments.length;r<i;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t},mc.apply(this,arguments)},fc=function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var i=Array(t),n=0;for(e=0;e<r;e++)for(var o=arguments[e],a=0,s=o.length;a<s;a++,n++)i[n]=o[a];return i},yc=300;function vc(t,e){var r={config:mc(mc({},Hl),wc.defaultConfig),l10n:Yl};function i(){var t;return(null===(t=r.calendarContainer)||void 0===t?void 0:t.getRootNode()).activeElement||document.activeElement}function n(t){return t.bind(r)}function o(){var t=r.config;!1===t.weekNumbers&&1===t.showMonths||!0!==t.noCalendar&&window.requestAnimationFrame((function(){if(void 0!==r.calendarContainer&&(r.calendarContainer.style.visibility="hidden",r.calendarContainer.style.display="block"),void 0!==r.daysContainer){var e=(r.days.offsetWidth+1)*t.showMonths;r.daysContainer.style.width=e+"px",r.calendarContainer.style.width=e+(void 0!==r.weekWrapper?r.weekWrapper.offsetWidth:0)+"px",r.calendarContainer.style.removeProperty("visibility"),r.calendarContainer.style.removeProperty("display")}}))}function a(t){if(0===r.selectedDates.length){var e=void 0===r.config.minDate||cc(new Date,r.config.minDate)>=0?new Date:new Date(r.config.minDate.getTime()),i=gc(r.config);e.setHours(i.hours,i.minutes,i.seconds,e.getMilliseconds()),r.selectedDates=[e],r.latestSelectedDateObj=e}void 0!==t&&"blur"!==t.type&&function(t){t.preventDefault();var e="keydown"===t.type,i=ec(t),n=i;void 0!==r.amPM&&i===r.amPM&&(r.amPM.textContent=r.l10n.amPM[Vl(r.amPM.textContent===r.l10n.amPM[0])]);var o=parseFloat(n.getAttribute("min")),a=parseFloat(n.getAttribute("max")),s=parseFloat(n.getAttribute("step")),l=parseInt(n.value,10),c=t.delta||(e?38===t.which?1:-1:0),d=l+s*c;if(void 0!==n.value&&2===n.value.length){var p=n===r.hourElement,h=n===r.minuteElement;d<o?(d=a+d+Vl(!p)+(Vl(p)&&Vl(!r.amPM)),h&&m(void 0,-1,r.hourElement)):d>a&&(d=n===r.hourElement?d-a-Vl(!r.amPM):o,h&&m(void 0,1,r.hourElement)),r.amPM&&p&&(1===s?d+l===23:Math.abs(d-l)>s)&&(r.amPM.textContent=r.l10n.amPM[Vl(r.amPM.textContent===r.l10n.amPM[0])]),n.value=Wl(d)}}(t);var n=r._input.value;s(),Q(),r._input.value!==n&&r._debouncedChange()}function s(){if(void 0!==r.hourElement&&void 0!==r.minuteElement){var t,e,i=(parseInt(r.hourElement.value.slice(-2),10)||0)%24,n=(parseInt(r.minuteElement.value,10)||0)%60,o=void 0!==r.secondElement?(parseInt(r.secondElement.value,10)||0)%60:0;void 0!==r.amPM&&(t=i,e=r.amPM.textContent,i=t%12+12*Vl(e===r.l10n.amPM[1]));var a=void 0!==r.config.minTime||r.config.minDate&&r.minDateHasTime&&r.latestSelectedDateObj&&0===cc(r.latestSelectedDateObj,r.config.minDate,!0),s=void 0!==r.config.maxTime||r.config.maxDate&&r.maxDateHasTime&&r.latestSelectedDateObj&&0===cc(r.latestSelectedDateObj,r.config.maxDate,!0);if(void 0!==r.config.maxTime&&void 0!==r.config.minTime&&r.config.minTime>r.config.maxTime){var l=pc(r.config.minTime.getHours(),r.config.minTime.getMinutes(),r.config.minTime.getSeconds()),d=pc(r.config.maxTime.getHours(),r.config.maxTime.getMinutes(),r.config.maxTime.getSeconds()),p=pc(i,n,o);if(p>d&&p<l){var h=hc(l);i=h[0],n=h[1],o=h[2]}}else{if(s){var u=void 0!==r.config.maxTime?r.config.maxTime:r.config.maxDate;(i=Math.min(i,u.getHours()))===u.getHours()&&(n=Math.min(n,u.getMinutes())),n===u.getMinutes()&&(o=Math.min(o,u.getSeconds()))}if(a){var g=void 0!==r.config.minTime?r.config.minTime:r.config.minDate;(i=Math.max(i,g.getHours()))===g.getHours()&&n<g.getMinutes()&&(n=g.getMinutes()),n===g.getMinutes()&&(o=Math.max(o,g.getSeconds()))}}c(i,n,o)}}function l(t){var e=t||r.latestSelectedDateObj;e&&e instanceof Date&&c(e.getHours(),e.getMinutes(),e.getSeconds())}function c(t,e,i){void 0!==r.latestSelectedDateObj&&r.latestSelectedDateObj.setHours(t%24,e,i||0,0),r.hourElement&&r.minuteElement&&!r.isMobile&&(r.hourElement.value=Wl(r.config.time_24hr?t:(12+t)%12+12*Vl(t%12==0)),r.minuteElement.value=Wl(e),void 0!==r.amPM&&(r.amPM.textContent=r.l10n.amPM[Vl(t>=12)]),void 0!==r.secondElement&&(r.secondElement.value=Wl(i)))}function d(t){var e=ec(t),r=parseInt(e.value)+(t.delta||0);(r/1e3>1||"Enter"===t.key&&!/[^\d]/.test(r.toString()))&&E(r)}function p(t,e,i,n){return e instanceof Array?e.forEach((function(e){return p(t,e,i,n)})):t instanceof Array?t.forEach((function(t){return p(t,e,i,n)})):(t.addEventListener(e,i,n),void r._handlers.push({remove:function(){return t.removeEventListener(e,i,n)}}))}function h(){G("onChange")}function u(t,e){var i=void 0!==t?r.parseDate(t):r.latestSelectedDateObj||(r.config.minDate&&r.config.minDate>r.now?r.config.minDate:r.config.maxDate&&r.config.maxDate<r.now?r.config.maxDate:r.now),n=r.currentYear,o=r.currentMonth;try{void 0!==i&&(r.currentYear=i.getFullYear(),r.currentMonth=i.getMonth())}catch(t){t.message="Invalid date supplied: "+i,r.config.errorHandler(t)}e&&r.currentYear!==n&&(G("onYearChange"),k()),!e||r.currentYear===n&&r.currentMonth===o||G("onMonthChange"),r.redraw()}function g(t){var e=ec(t);~e.className.indexOf("arrow")&&m(t,e.classList.contains("arrowUp")?1:-1)}function m(t,e,r){var i=t&&ec(t),n=r||i&&i.parentNode&&i.parentNode.firstChild,o=K("increment");o.delta=e,n&&n.dispatchEvent(o)}function f(t,e,i,n){var o=A(e,!0),a=Jl("span",t,e.getDate().toString());return a.dateObj=e,a.$i=n,a.setAttribute("aria-label",r.formatDate(e,r.config.ariaDateFormat)),-1===t.indexOf("hidden")&&0===cc(e,r.now)&&(r.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),o?(a.tabIndex=-1,X(e)&&(a.classList.add("selected"),r.selectedDateElem=a,"range"===r.config.mode&&(Xl(a,"startRange",r.selectedDates[0]&&0===cc(e,r.selectedDates[0],!0)),Xl(a,"endRange",r.selectedDates[1]&&0===cc(e,r.selectedDates[1],!0)),"nextMonthDay"===t&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===r.config.mode&&function(t){return!("range"!==r.config.mode||r.selectedDates.length<2)&&(cc(t,r.selectedDates[0])>=0&&cc(t,r.selectedDates[1])<=0)}(e)&&!X(e)&&a.classList.add("inRange"),r.weekNumbers&&1===r.config.showMonths&&"prevMonthDay"!==t&&n%7==6&&r.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+r.config.getWeek(e)+"</span>"),G("onDayCreate",a),a}function y(t){t.focus(),"range"===r.config.mode&&j(t)}function v(t){for(var e=t>0?0:r.config.showMonths-1,i=t>0?r.config.showMonths:-1,n=e;n!=i;n+=t)for(var o=r.daysContainer.children[n],a=t>0?0:o.children.length-1,s=t>0?o.children.length:-1,l=a;l!=s;l+=t){var c=o.children[l];if(-1===c.className.indexOf("hidden")&&A(c.dateObj))return c}}function b(t,e){var n=i(),o=O(n||document.body),a=void 0!==t?t:o?n:void 0!==r.selectedDateElem&&O(r.selectedDateElem)?r.selectedDateElem:void 0!==r.todayDateElem&&O(r.todayDateElem)?r.todayDateElem:v(e>0?1:-1);void 0===a?r._input.focus():o?function(t,e){for(var i=-1===t.className.indexOf("Month")?t.dateObj.getMonth():r.currentMonth,n=e>0?r.config.showMonths:-1,o=e>0?1:-1,a=i-r.currentMonth;a!=n;a+=o)for(var s=r.daysContainer.children[a],l=i-r.currentMonth===a?t.$i+e:e<0?s.children.length-1:0,c=s.children.length,d=l;d>=0&&d<c&&d!=(e>0?c:-1);d+=o){var p=s.children[d];if(-1===p.className.indexOf("hidden")&&A(p.dateObj)&&Math.abs(t.$i-d)>=Math.abs(e))return y(p)}r.changeMonth(o),b(v(o),0)}(a,e):y(a)}function w(t,e){for(var i=(new Date(t,e,1).getDay()-r.l10n.firstDayOfWeek+7)%7,n=r.utils.getDaysInMonth((e-1+12)%12,t),o=r.utils.getDaysInMonth(e,t),a=window.document.createDocumentFragment(),s=r.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",d=n+1-i,p=0;d<=n;d++,p++)a.appendChild(f("flatpickr-day "+l,new Date(t,e-1,d),0,p));for(d=1;d<=o;d++,p++)a.appendChild(f("flatpickr-day",new Date(t,e,d),0,p));for(var h=o+1;h<=42-i&&(1===r.config.showMonths||p%7!=0);h++,p++)a.appendChild(f("flatpickr-day "+c,new Date(t,e+1,h%o),0,p));var u=Jl("div","dayContainer");return u.appendChild(a),u}function x(){if(void 0!==r.daysContainer){Zl(r.daysContainer),r.weekNumbers&&Zl(r.weekNumbers);for(var t=document.createDocumentFragment(),e=0;e<r.config.showMonths;e++){var i=new Date(r.currentYear,r.currentMonth,1);i.setMonth(r.currentMonth+e),t.appendChild(w(i.getFullYear(),i.getMonth()))}r.daysContainer.appendChild(t),r.days=r.daysContainer.firstChild,"range"===r.config.mode&&1===r.selectedDates.length&&j()}}function k(){if(!(r.config.showMonths>1||"dropdown"!==r.config.monthSelectorType)){var t=function(t){return!(void 0!==r.config.minDate&&r.currentYear===r.config.minDate.getFullYear()&&t<r.config.minDate.getMonth())&&!(void 0!==r.config.maxDate&&r.currentYear===r.config.maxDate.getFullYear()&&t>r.config.maxDate.getMonth())};r.monthsDropdownContainer.tabIndex=-1,r.monthsDropdownContainer.innerHTML="";for(var e=0;e<12;e++)if(t(e)){var i=Jl("option","flatpickr-monthDropdown-month");i.value=new Date(r.currentYear,e).getMonth().toString(),i.textContent=ic(e,r.config.shorthandCurrentMonth,r.l10n),i.tabIndex=-1,r.currentMonth===e&&(i.selected=!0),r.monthsDropdownContainer.appendChild(i)}}}function $(){var t,e=Jl("div","flatpickr-month"),i=window.document.createDocumentFragment();r.config.showMonths>1||"static"===r.config.monthSelectorType?t=Jl("span","cur-month"):(r.monthsDropdownContainer=Jl("select","flatpickr-monthDropdown-months"),r.monthsDropdownContainer.setAttribute("aria-label",r.l10n.monthAriaLabel),p(r.monthsDropdownContainer,"change",(function(t){var e=ec(t),i=parseInt(e.value,10);r.changeMonth(i-r.currentMonth),G("onMonthChange")})),k(),t=r.monthsDropdownContainer);var n=tc("cur-year",{tabindex:"-1"}),o=n.getElementsByTagName("input")[0];o.setAttribute("aria-label",r.l10n.yearAriaLabel),r.config.minDate&&o.setAttribute("min",r.config.minDate.getFullYear().toString()),r.config.maxDate&&(o.setAttribute("max",r.config.maxDate.getFullYear().toString()),o.disabled=!!r.config.minDate&&r.config.minDate.getFullYear()===r.config.maxDate.getFullYear());var a=Jl("div","flatpickr-current-month");return a.appendChild(t),a.appendChild(n),i.appendChild(a),e.appendChild(i),{container:e,yearElement:o,monthElement:t}}function C(){Zl(r.monthNav),r.monthNav.appendChild(r.prevMonthNav),r.config.showMonths&&(r.yearElements=[],r.monthElements=[]);for(var t=r.config.showMonths;t--;){var e=$();r.yearElements.push(e.yearElement),r.monthElements.push(e.monthElement),r.monthNav.appendChild(e.container)}r.monthNav.appendChild(r.nextMonthNav)}function _(){r.weekdayContainer?Zl(r.weekdayContainer):r.weekdayContainer=Jl("div","flatpickr-weekdays");for(var t=r.config.showMonths;t--;){var e=Jl("div","flatpickr-weekdaycontainer");r.weekdayContainer.appendChild(e)}return D(),r.weekdayContainer}function D(){if(r.weekdayContainer){var t=r.l10n.firstDayOfWeek,e=fc(r.l10n.weekdays.shorthand);t>0&&t<e.length&&(e=fc(e.splice(t,e.length),e.splice(0,t)));for(var i=r.config.showMonths;i--;)r.weekdayContainer.children[i].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+e.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      "}}function S(t,e){void 0===e&&(e=!0);var i=e?t:t-r.currentMonth;i<0&&!0===r._hidePrevMonthArrow||i>0&&!0===r._hideNextMonthArrow||(r.currentMonth+=i,(r.currentMonth<0||r.currentMonth>11)&&(r.currentYear+=r.currentMonth>11?1:-1,r.currentMonth=(r.currentMonth+12)%12,G("onYearChange"),k()),x(),G("onMonthChange"),J())}function M(t){return r.calendarContainer.contains(t)}function T(t){if(r.isOpen&&!r.config.inline){var e=ec(t),i=M(e),n=!(e===r.input||e===r.altInput||r.element.contains(e)||t.path&&t.path.indexOf&&(~t.path.indexOf(r.input)||~t.path.indexOf(r.altInput)))&&!i&&!M(t.relatedTarget),o=!r.config.ignoredFocusElements.some((function(t){return t.contains(e)}));n&&o&&(r.config.allowInput&&r.setDate(r._input.value,!1,r.config.altInput?r.config.altFormat:r.config.dateFormat),void 0!==r.timeContainer&&void 0!==r.minuteElement&&void 0!==r.hourElement&&""!==r.input.value&&void 0!==r.input.value&&a(),r.close(),r.config&&"range"===r.config.mode&&1===r.selectedDates.length&&r.clear(!1))}}function E(t){if(!(!t||r.config.minDate&&t<r.config.minDate.getFullYear()||r.config.maxDate&&t>r.config.maxDate.getFullYear())){var e=t,i=r.currentYear!==e;r.currentYear=e||r.currentYear,r.config.maxDate&&r.currentYear===r.config.maxDate.getFullYear()?r.currentMonth=Math.min(r.config.maxDate.getMonth(),r.currentMonth):r.config.minDate&&r.currentYear===r.config.minDate.getFullYear()&&(r.currentMonth=Math.max(r.config.minDate.getMonth(),r.currentMonth)),i&&(r.redraw(),G("onYearChange"),k())}}function A(t,e){var i;void 0===e&&(e=!0);var n=r.parseDate(t,void 0,e);if(r.config.minDate&&n&&cc(n,r.config.minDate,void 0!==e?e:!r.minDateHasTime)<0||r.config.maxDate&&n&&cc(n,r.config.maxDate,void 0!==e?e:!r.maxDateHasTime)>0)return!1;if(!r.config.enable&&0===r.config.disable.length)return!0;if(void 0===n)return!1;for(var o=!!r.config.enable,a=null!==(i=r.config.enable)&&void 0!==i?i:r.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(n))return o;if(l instanceof Date&&void 0!==n&&l.getTime()===n.getTime())return o;if("string"==typeof l){var c=r.parseDate(l,void 0,!0);return c&&c.getTime()===n.getTime()?o:!o}if("object"==typeof l&&void 0!==n&&l.from&&l.to&&n.getTime()>=l.from.getTime()&&n.getTime()<=l.to.getTime())return o}return!o}function O(t){return void 0!==r.daysContainer&&(-1===t.className.indexOf("hidden")&&-1===t.className.indexOf("flatpickr-disabled")&&r.daysContainer.contains(t))}function I(t){var e=t.target===r._input,i=r._input.value.trimEnd()!==Z();!e||!i||t.relatedTarget&&M(t.relatedTarget)||r.setDate(r._input.value,!0,t.target===r.altInput?r.config.altFormat:r.config.dateFormat)}function P(e){var n=ec(e),o=r.config.wrap?t.contains(n):n===r._input,l=r.config.allowInput,c=r.isOpen&&(!l||!o),d=r.config.inline&&o&&!l;if(13===e.keyCode&&o){if(l)return r.setDate(r._input.value,!0,n===r.altInput?r.config.altFormat:r.config.dateFormat),r.close(),n.blur();r.open()}else if(M(n)||c||d){var p=!!r.timeContainer&&r.timeContainer.contains(n);switch(e.keyCode){case 13:p?(e.preventDefault(),a(),z()):B(e);break;case 27:e.preventDefault(),z();break;case 8:case 46:o&&!r.config.allowInput&&(e.preventDefault(),r.clear());break;case 37:case 39:if(p||o)r.hourElement&&r.hourElement.focus();else{e.preventDefault();var h=i();if(void 0!==r.daysContainer&&(!1===l||h&&O(h))){var u=39===e.keyCode?1:-1;e.ctrlKey?(e.stopPropagation(),S(u),b(v(1),0)):b(void 0,u)}}break;case 38:case 40:e.preventDefault();var g=40===e.keyCode?1:-1;r.daysContainer&&void 0!==n.$i||n===r.input||n===r.altInput?e.ctrlKey?(e.stopPropagation(),E(r.currentYear-g),b(v(1),0)):p||b(void 0,7*g):n===r.currentYearElement?E(r.currentYear-g):r.config.enableTime&&(!p&&r.hourElement&&r.hourElement.focus(),a(e),r._debouncedChange());break;case 9:if(p){var m=[r.hourElement,r.minuteElement,r.secondElement,r.amPM].concat(r.pluginElements).filter((function(t){return t})),f=m.indexOf(n);if(-1!==f){var y=m[f+(e.shiftKey?-1:1)];e.preventDefault(),(y||r._input).focus()}}else!r.config.noCalendar&&r.daysContainer&&r.daysContainer.contains(n)&&e.shiftKey&&(e.preventDefault(),r._input.focus())}}if(void 0!==r.amPM&&n===r.amPM)switch(e.key){case r.l10n.amPM[0].charAt(0):case r.l10n.amPM[0].charAt(0).toLowerCase():r.amPM.textContent=r.l10n.amPM[0],s(),Q();break;case r.l10n.amPM[1].charAt(0):case r.l10n.amPM[1].charAt(0).toLowerCase():r.amPM.textContent=r.l10n.amPM[1],s(),Q()}(o||M(n))&&G("onKeyDown",e)}function j(t,e){if(void 0===e&&(e="flatpickr-day"),1===r.selectedDates.length&&(!t||t.classList.contains(e)&&!t.classList.contains("flatpickr-disabled"))){for(var i=t?t.dateObj.getTime():r.days.firstElementChild.dateObj.getTime(),n=r.parseDate(r.selectedDates[0],void 0,!0).getTime(),o=Math.min(i,r.selectedDates[0].getTime()),a=Math.max(i,r.selectedDates[0].getTime()),s=!1,l=0,c=0,d=o;d<a;d+=uc.DAY)A(new Date(d),!0)||(s=s||d>o&&d<a,d<n&&(!l||d>l)?l=d:d>n&&(!c||d<c)&&(c=d));Array.from(r.rContainer.querySelectorAll("*:nth-child(-n+"+r.config.showMonths+") > ."+e)).forEach((function(e){var o=e.dateObj.getTime(),a=l>0&&o<l||c>0&&o>c;if(a)return e.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach((function(t){e.classList.remove(t)}));s&&!a||(["startRange","inRange","endRange","notAllowed"].forEach((function(t){e.classList.remove(t)})),void 0!==t&&(t.classList.add(i<=r.selectedDates[0].getTime()?"startRange":"endRange"),n<i&&o===n?e.classList.add("startRange"):n>i&&o===n&&e.classList.add("endRange"),o>=l&&(0===c||o<=c)&&dc(o,n,i)&&e.classList.add("inRange")))}))}}function q(){!r.isOpen||r.config.static||r.config.inline||U()}function N(t){return function(e){var i=r.config["_"+t+"Date"]=r.parseDate(e,r.config.dateFormat),n=r.config["_"+("min"===t?"max":"min")+"Date"];void 0!==i&&(r["min"===t?"minDateHasTime":"maxDateHasTime"]=i.getHours()>0||i.getMinutes()>0||i.getSeconds()>0),r.selectedDates&&(r.selectedDates=r.selectedDates.filter((function(t){return A(t)})),r.selectedDates.length||"min"!==t||l(i),Q()),r.daysContainer&&(F(),void 0!==i?r.currentYearElement[t]=i.getFullYear().toString():r.currentYearElement.removeAttribute(t),r.currentYearElement.disabled=!!n&&void 0!==i&&n.getFullYear()===i.getFullYear())}}function L(){return r.config.wrap?t.querySelector("[data-input]"):t}function R(){"object"!=typeof r.config.locale&&void 0===wc.l10ns[r.config.locale]&&r.config.errorHandler(new Error("flatpickr: invalid locale "+r.config.locale)),r.l10n=mc(mc({},wc.l10ns.default),"object"==typeof r.config.locale?r.config.locale:"default"!==r.config.locale?wc.l10ns[r.config.locale]:void 0),oc.D="("+r.l10n.weekdays.shorthand.join("|")+")",oc.l="("+r.l10n.weekdays.longhand.join("|")+")",oc.M="("+r.l10n.months.shorthand.join("|")+")",oc.F="("+r.l10n.months.longhand.join("|")+")",oc.K="("+r.l10n.amPM[0]+"|"+r.l10n.amPM[1]+"|"+r.l10n.amPM[0].toLowerCase()+"|"+r.l10n.amPM[1].toLowerCase()+")",void 0===mc(mc({},e),JSON.parse(JSON.stringify(t.dataset||{}))).time_24hr&&void 0===wc.defaultConfig.time_24hr&&(r.config.time_24hr=r.l10n.time_24hr),r.formatDate=sc(r),r.parseDate=lc({config:r.config,l10n:r.l10n})}function U(t){if("function"!=typeof r.config.position){if(void 0!==r.calendarContainer){G("onPreCalendarPosition");var e=t||r._positionElement,i=Array.prototype.reduce.call(r.calendarContainer.children,(function(t,e){return t+e.offsetHeight}),0),n=r.calendarContainer.offsetWidth,o=r.config.position.split(" "),a=o[0],s=o.length>1?o[1]:null,l=e.getBoundingClientRect(),c=window.innerHeight-l.bottom,d="above"===a||"below"!==a&&c<i&&l.top>i,p=window.pageYOffset+l.top+(d?-i-2:e.offsetHeight+2);if(Xl(r.calendarContainer,"arrowTop",!d),Xl(r.calendarContainer,"arrowBottom",d),!r.config.inline){var h=window.pageXOffset+l.left,u=!1,g=!1;"center"===s?(h-=(n-l.width)/2,u=!0):"right"===s&&(h-=n-l.width,g=!0),Xl(r.calendarContainer,"arrowLeft",!u&&!g),Xl(r.calendarContainer,"arrowCenter",u),Xl(r.calendarContainer,"arrowRight",g);var m=window.document.body.offsetWidth-(window.pageXOffset+l.right),f=h+n>window.document.body.offsetWidth,y=m+n>window.document.body.offsetWidth;if(Xl(r.calendarContainer,"rightMost",f),!r.config.static)if(r.calendarContainer.style.top=p+"px",f)if(y){var v=function(){for(var t=null,e=0;e<document.styleSheets.length;e++){var r=document.styleSheets[e];if(r.cssRules){try{r.cssRules}catch(t){continue}t=r;break}}return null!=t?t:(i=document.createElement("style"),document.head.appendChild(i),i.sheet);var i}();if(void 0===v)return;var b=window.document.body.offsetWidth,w=Math.max(0,b/2-n/2),x=v.cssRules.length,k="{left:"+l.left+"px;right:auto;}";Xl(r.calendarContainer,"rightMost",!1),Xl(r.calendarContainer,"centerMost",!0),v.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+k,x),r.calendarContainer.style.left=w+"px",r.calendarContainer.style.right="auto"}else r.calendarContainer.style.left="auto",r.calendarContainer.style.right=m+"px";else r.calendarContainer.style.left=h+"px",r.calendarContainer.style.right="auto"}}}else r.config.position(r,t)}function F(){r.config.noCalendar||r.isMobile||(k(),J(),x())}function z(){r._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(r.close,0):r.close()}function B(t){t.preventDefault(),t.stopPropagation();var e=Ql(ec(t),(function(t){return t.classList&&t.classList.contains("flatpickr-day")&&!t.classList.contains("flatpickr-disabled")&&!t.classList.contains("notAllowed")}));if(void 0!==e){var i=e,n=r.latestSelectedDateObj=new Date(i.dateObj.getTime()),o=(n.getMonth()<r.currentMonth||n.getMonth()>r.currentMonth+r.config.showMonths-1)&&"range"!==r.config.mode;if(r.selectedDateElem=i,"single"===r.config.mode)r.selectedDates=[n];else if("multiple"===r.config.mode){var a=X(n);a?r.selectedDates.splice(parseInt(a),1):r.selectedDates.push(n)}else"range"===r.config.mode&&(2===r.selectedDates.length&&r.clear(!1,!1),r.latestSelectedDateObj=n,r.selectedDates.push(n),0!==cc(n,r.selectedDates[0],!0)&&r.selectedDates.sort((function(t,e){return t.getTime()-e.getTime()})));if(s(),o){var l=r.currentYear!==n.getFullYear();r.currentYear=n.getFullYear(),r.currentMonth=n.getMonth(),l&&(G("onYearChange"),k()),G("onMonthChange")}if(J(),x(),Q(),o||"range"===r.config.mode||1!==r.config.showMonths?void 0!==r.selectedDateElem&&void 0===r.hourElement&&r.selectedDateElem&&r.selectedDateElem.focus():y(i),void 0!==r.hourElement&&void 0!==r.hourElement&&r.hourElement.focus(),r.config.closeOnSelect){var c="single"===r.config.mode&&!r.config.enableTime,d="range"===r.config.mode&&2===r.selectedDates.length&&!r.config.enableTime;(c||d)&&z()}h()}}r.parseDate=lc({config:r.config,l10n:r.l10n}),r._handlers=[],r.pluginElements=[],r.loadedPlugins=[],r._bind=p,r._setHoursFromDate=l,r._positionCalendar=U,r.changeMonth=S,r.changeYear=E,r.clear=function(t,e){void 0===t&&(t=!0);void 0===e&&(e=!0);r.input.value="",void 0!==r.altInput&&(r.altInput.value="");void 0!==r.mobileInput&&(r.mobileInput.value="");r.selectedDates=[],r.latestSelectedDateObj=void 0,!0===e&&(r.currentYear=r._initialDate.getFullYear(),r.currentMonth=r._initialDate.getMonth());if(!0===r.config.enableTime){var i=gc(r.config);c(i.hours,i.minutes,i.seconds)}r.redraw(),t&&G("onChange")},r.close=function(){r.isOpen=!1,r.isMobile||(void 0!==r.calendarContainer&&r.calendarContainer.classList.remove("open"),void 0!==r._input&&r._input.classList.remove("active"));G("onClose")},r.onMouseOver=j,r._createElement=Jl,r.createDay=f,r.destroy=function(){void 0!==r.config&&G("onDestroy");for(var t=r._handlers.length;t--;)r._handlers[t].remove();if(r._handlers=[],r.mobileInput)r.mobileInput.parentNode&&r.mobileInput.parentNode.removeChild(r.mobileInput),r.mobileInput=void 0;else if(r.calendarContainer&&r.calendarContainer.parentNode)if(r.config.static&&r.calendarContainer.parentNode){var e=r.calendarContainer.parentNode;if(e.lastChild&&e.removeChild(e.lastChild),e.parentNode){for(;e.firstChild;)e.parentNode.insertBefore(e.firstChild,e);e.parentNode.removeChild(e)}}else r.calendarContainer.parentNode.removeChild(r.calendarContainer);r.altInput&&(r.input.type="text",r.altInput.parentNode&&r.altInput.parentNode.removeChild(r.altInput),delete r.altInput);r.input&&(r.input.type=r.input._type,r.input.classList.remove("flatpickr-input"),r.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach((function(t){try{delete r[t]}catch(t){}}))},r.isEnabled=A,r.jumpToDate=u,r.updateValue=Q,r.open=function(t,e){void 0===e&&(e=r._positionElement);if(!0===r.isMobile){if(t){t.preventDefault();var i=ec(t);i&&i.blur()}return void 0!==r.mobileInput&&(r.mobileInput.focus(),r.mobileInput.click()),void G("onOpen")}if(r._input.disabled||r.config.inline)return;var n=r.isOpen;r.isOpen=!0,n||(r.calendarContainer.classList.add("open"),r._input.classList.add("active"),G("onOpen"),U(e));!0===r.config.enableTime&&!0===r.config.noCalendar&&(!1!==r.config.allowInput||void 0!==t&&r.timeContainer.contains(t.relatedTarget)||setTimeout((function(){return r.hourElement.select()}),50))},r.redraw=F,r.set=function(t,e){if(null!==t&&"object"==typeof t)for(var i in Object.assign(r.config,t),t)void 0!==H[i]&&H[i].forEach((function(t){return t()}));else r.config[t]=e,void 0!==H[t]?H[t].forEach((function(t){return t()})):Bl.indexOf(t)>-1&&(r.config[t]=Kl(e));r.redraw(),Q(!0)},r.setDate=function(t,e,i){void 0===e&&(e=!1);void 0===i&&(i=r.config.dateFormat);if(0!==t&&!t||t instanceof Array&&0===t.length)return r.clear(e);Y(t,i),r.latestSelectedDateObj=r.selectedDates[r.selectedDates.length-1],r.redraw(),u(void 0,e),l(),0===r.selectedDates.length&&r.clear(!1);Q(e),e&&G("onChange")},r.toggle=function(t){if(!0===r.isOpen)return r.close();r.open(t)};var H={locale:[R,D],showMonths:[C,o,_],minDate:[u],maxDate:[u],positionElement:[V],clickOpens:[function(){!0===r.config.clickOpens?(p(r._input,"focus",r.open),p(r._input,"click",r.open)):(r._input.removeEventListener("focus",r.open),r._input.removeEventListener("click",r.open))}]};function Y(t,e){var i=[];if(t instanceof Array)i=t.map((function(t){return r.parseDate(t,e)}));else if(t instanceof Date||"number"==typeof t)i=[r.parseDate(t,e)];else if("string"==typeof t)switch(r.config.mode){case"single":case"time":i=[r.parseDate(t,e)];break;case"multiple":i=t.split(r.config.conjunction).map((function(t){return r.parseDate(t,e)}));break;case"range":i=t.split(r.l10n.rangeSeparator).map((function(t){return r.parseDate(t,e)}))}else r.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(t)));r.selectedDates=r.config.allowInvalidPreload?i:i.filter((function(t){return t instanceof Date&&A(t,!1)})),"range"===r.config.mode&&r.selectedDates.sort((function(t,e){return t.getTime()-e.getTime()}))}function W(t){return t.slice().map((function(t){return"string"==typeof t||"number"==typeof t||t instanceof Date?r.parseDate(t,void 0,!0):t&&"object"==typeof t&&t.from&&t.to?{from:r.parseDate(t.from,void 0),to:r.parseDate(t.to,void 0)}:t})).filter((function(t){return t}))}function V(){r._positionElement=r.config.positionElement||r._input}function G(t,e){if(void 0!==r.config){var i=r.config[t];if(void 0!==i&&i.length>0)for(var n=0;i[n]&&n<i.length;n++)i[n](r.selectedDates,r.input.value,r,e);"onChange"===t&&(r.input.dispatchEvent(K("change")),r.input.dispatchEvent(K("input")))}}function K(t){var e=document.createEvent("Event");return e.initEvent(t,!0,!0),e}function X(t){for(var e=0;e<r.selectedDates.length;e++){var i=r.selectedDates[e];if(i instanceof Date&&0===cc(i,t))return""+e}return!1}function J(){r.config.noCalendar||r.isMobile||!r.monthNav||(r.yearElements.forEach((function(t,e){var i=new Date(r.currentYear,r.currentMonth,1);i.setMonth(r.currentMonth+e),r.config.showMonths>1||"static"===r.config.monthSelectorType?r.monthElements[e].textContent=ic(i.getMonth(),r.config.shorthandCurrentMonth,r.l10n)+" ":r.monthsDropdownContainer.value=i.getMonth().toString(),t.value=i.getFullYear().toString()})),r._hidePrevMonthArrow=void 0!==r.config.minDate&&(r.currentYear===r.config.minDate.getFullYear()?r.currentMonth<=r.config.minDate.getMonth():r.currentYear<r.config.minDate.getFullYear()),r._hideNextMonthArrow=void 0!==r.config.maxDate&&(r.currentYear===r.config.maxDate.getFullYear()?r.currentMonth+1>r.config.maxDate.getMonth():r.currentYear>r.config.maxDate.getFullYear()))}function Z(t){var e=t||(r.config.altInput?r.config.altFormat:r.config.dateFormat);return r.selectedDates.map((function(t){return r.formatDate(t,e)})).filter((function(t,e,i){return"range"!==r.config.mode||r.config.enableTime||i.indexOf(t)===e})).join("range"!==r.config.mode?r.config.conjunction:r.l10n.rangeSeparator)}function Q(t){void 0===t&&(t=!0),void 0!==r.mobileInput&&r.mobileFormatStr&&(r.mobileInput.value=void 0!==r.latestSelectedDateObj?r.formatDate(r.latestSelectedDateObj,r.mobileFormatStr):""),r.input.value=Z(r.config.dateFormat),void 0!==r.altInput&&(r.altInput.value=Z(r.config.altFormat)),!1!==t&&G("onValueUpdate")}function tt(t){var e=ec(t),i=r.prevMonthNav.contains(e),n=r.nextMonthNav.contains(e);i||n?S(i?-1:1):r.yearElements.indexOf(e)>=0?e.select():e.classList.contains("arrowUp")?r.changeYear(r.currentYear+1):e.classList.contains("arrowDown")&&r.changeYear(r.currentYear-1)}return function(){r.element=r.input=t,r.isOpen=!1,function(){var i=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],o=mc(mc({},JSON.parse(JSON.stringify(t.dataset||{}))),e),a={};r.config.parseDate=o.parseDate,r.config.formatDate=o.formatDate,Object.defineProperty(r.config,"enable",{get:function(){return r.config._enable},set:function(t){r.config._enable=W(t)}}),Object.defineProperty(r.config,"disable",{get:function(){return r.config._disable},set:function(t){r.config._disable=W(t)}});var s="time"===o.mode;if(!o.dateFormat&&(o.enableTime||s)){var l=wc.defaultConfig.dateFormat||Hl.dateFormat;a.dateFormat=o.noCalendar||s?"H:i"+(o.enableSeconds?":S":""):l+" H:i"+(o.enableSeconds?":S":"")}if(o.altInput&&(o.enableTime||s)&&!o.altFormat){var c=wc.defaultConfig.altFormat||Hl.altFormat;a.altFormat=o.noCalendar||s?"h:i"+(o.enableSeconds?":S K":" K"):c+" h:i"+(o.enableSeconds?":S":"")+" K"}Object.defineProperty(r.config,"minDate",{get:function(){return r.config._minDate},set:N("min")}),Object.defineProperty(r.config,"maxDate",{get:function(){return r.config._maxDate},set:N("max")});var d=function(t){return function(e){r.config["min"===t?"_minTime":"_maxTime"]=r.parseDate(e,"H:i:S")}};Object.defineProperty(r.config,"minTime",{get:function(){return r.config._minTime},set:d("min")}),Object.defineProperty(r.config,"maxTime",{get:function(){return r.config._maxTime},set:d("max")}),"time"===o.mode&&(r.config.noCalendar=!0,r.config.enableTime=!0);Object.assign(r.config,a,o);for(var p=0;p<i.length;p++)r.config[i[p]]=!0===r.config[i[p]]||"true"===r.config[i[p]];Bl.filter((function(t){return void 0!==r.config[t]})).forEach((function(t){r.config[t]=Kl(r.config[t]||[]).map(n)})),r.isMobile=!r.config.disableMobile&&!r.config.inline&&"single"===r.config.mode&&!r.config.disable.length&&!r.config.enable&&!r.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(p=0;p<r.config.plugins.length;p++){var h=r.config.plugins[p](r)||{};for(var u in h)Bl.indexOf(u)>-1?r.config[u]=Kl(h[u]).map(n).concat(r.config[u]):void 0===o[u]&&(r.config[u]=h[u])}o.altInputClass||(r.config.altInputClass=L().className+" "+r.config.altInputClass);G("onParseConfig")}(),R(),function(){if(r.input=L(),!r.input)return void r.config.errorHandler(new Error("Invalid input element specified"));r.input._type=r.input.type,r.input.type="text",r.input.classList.add("flatpickr-input"),r._input=r.input,r.config.altInput&&(r.altInput=Jl(r.input.nodeName,r.config.altInputClass),r._input=r.altInput,r.altInput.placeholder=r.input.placeholder,r.altInput.disabled=r.input.disabled,r.altInput.required=r.input.required,r.altInput.tabIndex=r.input.tabIndex,r.altInput.type="text",r.input.setAttribute("type","hidden"),!r.config.static&&r.input.parentNode&&r.input.parentNode.insertBefore(r.altInput,r.input.nextSibling));r.config.allowInput||r._input.setAttribute("readonly","readonly");V()}(),function(){r.selectedDates=[],r.now=r.parseDate(r.config.now)||new Date;var t=r.config.defaultDate||("INPUT"!==r.input.nodeName&&"TEXTAREA"!==r.input.nodeName||!r.input.placeholder||r.input.value!==r.input.placeholder?r.input.value:null);t&&Y(t,r.config.dateFormat);r._initialDate=r.selectedDates.length>0?r.selectedDates[0]:r.config.minDate&&r.config.minDate.getTime()>r.now.getTime()?r.config.minDate:r.config.maxDate&&r.config.maxDate.getTime()<r.now.getTime()?r.config.maxDate:r.now,r.currentYear=r._initialDate.getFullYear(),r.currentMonth=r._initialDate.getMonth(),r.selectedDates.length>0&&(r.latestSelectedDateObj=r.selectedDates[0]);void 0!==r.config.minTime&&(r.config.minTime=r.parseDate(r.config.minTime,"H:i"));void 0!==r.config.maxTime&&(r.config.maxTime=r.parseDate(r.config.maxTime,"H:i"));r.minDateHasTime=!!r.config.minDate&&(r.config.minDate.getHours()>0||r.config.minDate.getMinutes()>0||r.config.minDate.getSeconds()>0),r.maxDateHasTime=!!r.config.maxDate&&(r.config.maxDate.getHours()>0||r.config.maxDate.getMinutes()>0||r.config.maxDate.getSeconds()>0)}(),r.utils={getDaysInMonth:function(t,e){return void 0===t&&(t=r.currentMonth),void 0===e&&(e=r.currentYear),1===t&&(e%4==0&&e%100!=0||e%400==0)?29:r.l10n.daysInMonth[t]}},r.isMobile||function(){var t=window.document.createDocumentFragment();if(r.calendarContainer=Jl("div","flatpickr-calendar"),r.calendarContainer.tabIndex=-1,!r.config.noCalendar){if(t.appendChild((r.monthNav=Jl("div","flatpickr-months"),r.yearElements=[],r.monthElements=[],r.prevMonthNav=Jl("span","flatpickr-prev-month"),r.prevMonthNav.innerHTML=r.config.prevArrow,r.nextMonthNav=Jl("span","flatpickr-next-month"),r.nextMonthNav.innerHTML=r.config.nextArrow,C(),Object.defineProperty(r,"_hidePrevMonthArrow",{get:function(){return r.__hidePrevMonthArrow},set:function(t){r.__hidePrevMonthArrow!==t&&(Xl(r.prevMonthNav,"flatpickr-disabled",t),r.__hidePrevMonthArrow=t)}}),Object.defineProperty(r,"_hideNextMonthArrow",{get:function(){return r.__hideNextMonthArrow},set:function(t){r.__hideNextMonthArrow!==t&&(Xl(r.nextMonthNav,"flatpickr-disabled",t),r.__hideNextMonthArrow=t)}}),r.currentYearElement=r.yearElements[0],J(),r.monthNav)),r.innerContainer=Jl("div","flatpickr-innerContainer"),r.config.weekNumbers){var e=function(){r.calendarContainer.classList.add("hasWeeks");var t=Jl("div","flatpickr-weekwrapper");t.appendChild(Jl("span","flatpickr-weekday",r.l10n.weekAbbreviation));var e=Jl("div","flatpickr-weeks");return t.appendChild(e),{weekWrapper:t,weekNumbers:e}}(),i=e.weekWrapper,n=e.weekNumbers;r.innerContainer.appendChild(i),r.weekNumbers=n,r.weekWrapper=i}r.rContainer=Jl("div","flatpickr-rContainer"),r.rContainer.appendChild(_()),r.daysContainer||(r.daysContainer=Jl("div","flatpickr-days"),r.daysContainer.tabIndex=-1),x(),r.rContainer.appendChild(r.daysContainer),r.innerContainer.appendChild(r.rContainer),t.appendChild(r.innerContainer)}r.config.enableTime&&t.appendChild(function(){r.calendarContainer.classList.add("hasTime"),r.config.noCalendar&&r.calendarContainer.classList.add("noCalendar");var t=gc(r.config);r.timeContainer=Jl("div","flatpickr-time"),r.timeContainer.tabIndex=-1;var e=Jl("span","flatpickr-time-separator",":"),i=tc("flatpickr-hour",{"aria-label":r.l10n.hourAriaLabel});r.hourElement=i.getElementsByTagName("input")[0];var n=tc("flatpickr-minute",{"aria-label":r.l10n.minuteAriaLabel});r.minuteElement=n.getElementsByTagName("input")[0],r.hourElement.tabIndex=r.minuteElement.tabIndex=-1,r.hourElement.value=Wl(r.latestSelectedDateObj?r.latestSelectedDateObj.getHours():r.config.time_24hr?t.hours:function(t){switch(t%24){case 0:case 12:return 12;default:return t%12}}(t.hours)),r.minuteElement.value=Wl(r.latestSelectedDateObj?r.latestSelectedDateObj.getMinutes():t.minutes),r.hourElement.setAttribute("step",r.config.hourIncrement.toString()),r.minuteElement.setAttribute("step",r.config.minuteIncrement.toString()),r.hourElement.setAttribute("min",r.config.time_24hr?"0":"1"),r.hourElement.setAttribute("max",r.config.time_24hr?"23":"12"),r.hourElement.setAttribute("maxlength","2"),r.minuteElement.setAttribute("min","0"),r.minuteElement.setAttribute("max","59"),r.minuteElement.setAttribute("maxlength","2"),r.timeContainer.appendChild(i),r.timeContainer.appendChild(e),r.timeContainer.appendChild(n),r.config.time_24hr&&r.timeContainer.classList.add("time24hr");if(r.config.enableSeconds){r.timeContainer.classList.add("hasSeconds");var o=tc("flatpickr-second");r.secondElement=o.getElementsByTagName("input")[0],r.secondElement.value=Wl(r.latestSelectedDateObj?r.latestSelectedDateObj.getSeconds():t.seconds),r.secondElement.setAttribute("step",r.minuteElement.getAttribute("step")),r.secondElement.setAttribute("min","0"),r.secondElement.setAttribute("max","59"),r.secondElement.setAttribute("maxlength","2"),r.timeContainer.appendChild(Jl("span","flatpickr-time-separator",":")),r.timeContainer.appendChild(o)}r.config.time_24hr||(r.amPM=Jl("span","flatpickr-am-pm",r.l10n.amPM[Vl((r.latestSelectedDateObj?r.hourElement.value:r.config.defaultHour)>11)]),r.amPM.title=r.l10n.toggleTitle,r.amPM.tabIndex=-1,r.timeContainer.appendChild(r.amPM));return r.timeContainer}());Xl(r.calendarContainer,"rangeMode","range"===r.config.mode),Xl(r.calendarContainer,"animate",!0===r.config.animate),Xl(r.calendarContainer,"multiMonth",r.config.showMonths>1),r.calendarContainer.appendChild(t);var o=void 0!==r.config.appendTo&&void 0!==r.config.appendTo.nodeType;if((r.config.inline||r.config.static)&&(r.calendarContainer.classList.add(r.config.inline?"inline":"static"),r.config.inline&&(!o&&r.element.parentNode?r.element.parentNode.insertBefore(r.calendarContainer,r._input.nextSibling):void 0!==r.config.appendTo&&r.config.appendTo.appendChild(r.calendarContainer)),r.config.static)){var a=Jl("div","flatpickr-wrapper");r.element.parentNode&&r.element.parentNode.insertBefore(a,r.element),a.appendChild(r.element),r.altInput&&a.appendChild(r.altInput),a.appendChild(r.calendarContainer)}r.config.static||r.config.inline||(void 0!==r.config.appendTo?r.config.appendTo:window.document.body).appendChild(r.calendarContainer)}(),function(){r.config.wrap&&["open","close","toggle","clear"].forEach((function(t){Array.prototype.forEach.call(r.element.querySelectorAll("[data-"+t+"]"),(function(e){return p(e,"click",r[t])}))}));if(r.isMobile)return void function(){var t=r.config.enableTime?r.config.noCalendar?"time":"datetime-local":"date";r.mobileInput=Jl("input",r.input.className+" flatpickr-mobile"),r.mobileInput.tabIndex=1,r.mobileInput.type=t,r.mobileInput.disabled=r.input.disabled,r.mobileInput.required=r.input.required,r.mobileInput.placeholder=r.input.placeholder,r.mobileFormatStr="datetime-local"===t?"Y-m-d\\TH:i:S":"date"===t?"Y-m-d":"H:i:S",r.selectedDates.length>0&&(r.mobileInput.defaultValue=r.mobileInput.value=r.formatDate(r.selectedDates[0],r.mobileFormatStr));r.config.minDate&&(r.mobileInput.min=r.formatDate(r.config.minDate,"Y-m-d"));r.config.maxDate&&(r.mobileInput.max=r.formatDate(r.config.maxDate,"Y-m-d"));r.input.getAttribute("step")&&(r.mobileInput.step=String(r.input.getAttribute("step")));r.input.type="hidden",void 0!==r.altInput&&(r.altInput.type="hidden");try{r.input.parentNode&&r.input.parentNode.insertBefore(r.mobileInput,r.input.nextSibling)}catch(t){}p(r.mobileInput,"change",(function(t){r.setDate(ec(t).value,!1,r.mobileFormatStr),G("onChange"),G("onClose")}))}();var t=Gl(q,50);r._debouncedChange=Gl(h,yc),r.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&p(r.daysContainer,"mouseover",(function(t){"range"===r.config.mode&&j(ec(t))}));p(r._input,"keydown",P),void 0!==r.calendarContainer&&p(r.calendarContainer,"keydown",P);r.config.inline||r.config.static||p(window,"resize",t);void 0!==window.ontouchstart?p(window.document,"touchstart",T):p(window.document,"mousedown",T);p(window.document,"focus",T,{capture:!0}),!0===r.config.clickOpens&&(p(r._input,"focus",r.open),p(r._input,"click",r.open));void 0!==r.daysContainer&&(p(r.monthNav,"click",tt),p(r.monthNav,["keyup","increment"],d),p(r.daysContainer,"click",B));if(void 0!==r.timeContainer&&void 0!==r.minuteElement&&void 0!==r.hourElement){var e=function(t){return ec(t).select()};p(r.timeContainer,["increment"],a),p(r.timeContainer,"blur",a,{capture:!0}),p(r.timeContainer,"click",g),p([r.hourElement,r.minuteElement],["focus","click"],e),void 0!==r.secondElement&&p(r.secondElement,"focus",(function(){return r.secondElement&&r.secondElement.select()})),void 0!==r.amPM&&p(r.amPM,"click",(function(t){a(t)}))}r.config.allowInput&&p(r._input,"blur",I)}(),(r.selectedDates.length||r.config.noCalendar)&&(r.config.enableTime&&l(r.config.noCalendar?r.latestSelectedDateObj:void 0),Q(!1)),o();var i=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!r.isMobile&&i&&U(),G("onReady")}(),r}function bc(t,e){for(var r=Array.prototype.slice.call(t).filter((function(t){return t instanceof HTMLElement})),i=[],n=0;n<r.length;n++){var o=r[n];try{if(null!==o.getAttribute("data-fp-omit"))continue;void 0!==o._flatpickr&&(o._flatpickr.destroy(),o._flatpickr=void 0),o._flatpickr=vc(o,e||{}),i.push(o._flatpickr)}catch(t){console.error(t)}}return 1===i.length?i[0]:i}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(t){return bc(this,t)},HTMLElement.prototype.flatpickr=function(t){return bc([this],t)});var wc=function(t,e){return"string"==typeof t?bc(window.document.querySelectorAll(t),e):t instanceof Node?bc([t],e):bc(t,e)};wc.defaultConfig={},wc.l10ns={en:mc({},Yl),default:mc({},Yl)},wc.localize=function(t){wc.l10ns.default=mc(mc({},wc.l10ns.default),t)},wc.setDefaults=function(t){wc.defaultConfig=mc(mc({},wc.defaultConfig),t)},wc.parseDate=lc({}),wc.formatDate=sc({}),wc.compareDates=cc,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(t){return bc(this,t)}),Date.prototype.fp_incr=function(t){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof t?parseInt(t,10):t))},"undefined"!=typeof window&&(window.flatpickr=wc);var xc;!function(t){t.light="light",t.dark="dark",t.materialBlue="material_blue",t.materialGreen="material_green",t.materialOrange="material_orange",t.materialRed="material_red",t.airbnb="airbnb",t.confetti="confetti",t.none="none"}(xc||(xc={}));class kc{constructor(t){this.theme=t,this.theme=t}async initStyles(){const t=`https://npmcdn.com/flatpickr@4.6.9/dist/themes/${this.theme}.css`;this.isThemeLoaded()||(this.appendThemeStyles(t),await this.waitForStyleToLoad((()=>this.isThemeLoaded())))}waitForStyleToLoad(t){return new Promise(((e,r)=>{const i=(r=0)=>{if(t())return e();if(r>10)throw Error("Styles took too long to load, or were not able to be loaded");setTimeout((()=>i(r++)),100)};i()}))}isThemeLoaded(){if(this.theme===xc.none)return!0;return Array.from(document.styleSheets).map((t=>t.href)).some((t=>null!=t&&new RegExp("https://npmcdn.com/flatpickr@4.6.9/dist/themes").test(t)))}appendThemeStyles(t){const e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.href=t,document.head.append(e)}}const $c="https://npmcdn.com/flatpickr@4.6.9/dist";let Cc=class extends Ll{constructor(){super(...arguments),this.placeholder="",this.altFormat="F j, Y",this.altInput=!1,this.altInputClass="",this.allowInput=!1,this.ariaDateFormat="F j, Y",this.clickOpens=!0,this.dateFormat="Y-m-d",this.defaultHour=12,this.defaultMinute=0,this.disable=[],this.disableMobile=!1,this.enable=void 0,this.enableTime=!1,this.enableSeconds=!1,this.hourIncrement=1,this.minuteIncrement=5,this.inline=!1,this.mode="single",this.nextArrow=">",this.prevArrow="<",this.noCalendar=!1,this.position="auto",this.shorthandCurrentMonth=!1,this.showMonths=1,this.static=!1,this.time_24hr=!1,this.weekNumbers=!1,this.wrap=!1,this.theme="light",this.firstDayOfWeek=1,this.defaultToToday=!1,this.weekSelect=!1,this.monthSelect=!1,this.confirmDate=!1,this._hasSlottedElement=!1}static get styles(){return[Us`
        :host {
          width: fit-content;
          display: block;
          cursor: pointer;
          background: #fff;
          color: #000;
          overflow: hidden;
        }

        ::slotted(*) {
          cursor: pointer;
        }

        input {
          width: 100%;
          height: 100%;
          font-size: inherit;
          cursor: pointer;
          background: inherit;
          box-sizing: border-box;
          outline: none;
          color: inherit;
          border: none;
        }
      `]}firstUpdated(){this._hasSlottedElement=this.checkForSlottedElement()}updated(){this.init()}getToday(){const t=new Date;return`${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`}checkForSlottedElement(){var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("slot"),r=e?e.assignedNodes().filter(this.removeTextNodes):[];return null!=e&&r&&r.length>0}getSlottedElement(){var t;if(!this._hasSlottedElement)return;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("slot"),r=null==e?void 0:e.assignedNodes().filter(this.removeTextNodes);return!r||r.length<1?void 0:r[0]}removeTextNodes(t){return"#text"!==t.nodeName}async init(){const t=new kc(this.theme);await t.initStyles(),this.locale&&await async function(t){const e="https://npmcdn.com/flatpickr@4.6.9/dist/l10n/"+t+".js";await import(e)}(this.locale),await this.initializeComponent()}async getOptions(){let t={altFormat:this.altFormat,altInput:this.altInput,altInputClass:this.altInputClass,allowInput:this.allowInput,ariaDateFormat:this.ariaDateFormat,clickOpens:this.clickOpens,dateFormat:this.dateFormat,defaultDate:this.defaultToToday?this.getToday():this.defaultDate,defaultHour:this.defaultHour,defaultMinute:this.defaultMinute,disable:this.disable,disableMobile:this.disableMobile,enable:this.enable,enableTime:this.enableTime,enableSeconds:this.enableSeconds,formatDate:this.formatDateFn,hourIncrement:this.hourIncrement,inline:this.inline,maxDate:this.maxDate,minDate:this.minDate,minuteIncrement:this.minuteIncrement,mode:this.mode,nextArrow:this.nextArrow,prevArrow:this.prevArrow,noCalendar:this.noCalendar,onChange:this.onChange,onClose:this.onClose,onOpen:this.onOpen,onReady:this.onReady,onMonthChange:this.onMonthChange,onYearChange:this.onYearChange,onValueUpdate:this.onValueUpdate,parseDate:this.parseDateFn,position:this.position,shorthandCurrentMonth:this.shorthandCurrentMonth,showMonths:this.showMonths,static:this.static,time_24hr:this.time_24hr,weekNumbers:this.weekNumbers,wrap:this.wrap,locale:this.locale,plugins:[]};return t=await async function(t,e){if(t.weekSelect){const t=(await import($c+"/esm/plugins/weekSelect/weekSelect.js")).default;e={...e,plugins:[...e.plugins,t()],onChange:function(){const t=this.selectedDates[0]?this.config.getWeek(this.selectedDates[0]):null;this.input.value=t}}}if(t.monthSelect){const r=(await import($c+"/esm/plugins/monthSelect/index.js")).default;e={...e,plugins:[...e.plugins,r({shorthand:!1,dateFormat:t.dateFormat,altFormat:t.altFormat})]};const i=document.createElement("link");i.rel="stylesheet",i.href=$c+"/plugins/monthSelect/style.css",document.head.appendChild(i)}return e}(this,t),Object.keys(t).forEach((e=>{void 0===t[e]&&delete t[e]})),t}async initializeComponent(){var t;let e;if(this._instance&&Object.prototype.hasOwnProperty.call(this,"destroy")&&this._instance.destroy(),e=this._hasSlottedElement?this.findInputField():null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("input"),e){this._inputElement=e,flatpickr.l10ns.default.firstDayOfWeek=this.firstDayOfWeek;const t=await this.getOptions();this._instance=flatpickr(e,t)}}findInputField(){let t=null;if(t=this.querySelector("input"),t)return t;const e=this.getSlottedElement();return void 0!==typeof e&&(t=this.searchWebComponentForInputElement(e)),t||null}searchWebComponentForInputElement(t){let e=this.getInputFieldInElement(t);if(e)return e;const r=this.getWebComponentsInsideElement(t);for(let t=0;t<r.length&&(e=this.searchWebComponentForInputElement(r[t]),!e);t++);return e}getInputFieldInElement(t){let e=null;return e=t.shadowRoot?t.shadowRoot.querySelector("input"):t.querySelector("input"),e}getWebComponentsInsideElement(t){return t.shadowRoot?[...Array.from(t.querySelectorAll("*")),...Array.from(t.shadowRoot.querySelectorAll("*"))].filter((t=>t.shadowRoot)):Array.from(t.querySelectorAll("*")).filter((t=>t.shadowRoot))}changeMonth(t,e=!0){this._instance&&this._instance.changeMonth(t,e)}clear(){this._instance&&this._instance.clear()}close(){this._instance&&this._instance.close()}destroy(){this._instance&&this._instance.destroy()}formatDate(t,e){return this._instance?this._instance.formatDate(t,e):""}jumpToDate(t,e){this._instance&&this._instance.jumpToDate(t,e)}open(){this._instance&&this._instance.open()}parseDate(t,e){if(this._instance)return this._instance.parseDate(t,e)}redraw(){this._instance&&this._instance.redraw()}set(t,e){this._instance&&this._instance.set(t,e)}setDate(t,e,r){this._instance&&this._instance.setDate(t,e,r)}toggle(){this._instance}getSelectedDates(){return this._instance?this._instance.selectedDates:[]}getCurrentYear(){return this._instance?this._instance.currentYear:-1}getCurrentMonth(){return this._instance?this._instance.currentMonth:-1}getConfig(){return this._instance?this._instance.config:{}}getValue(){return this._inputElement?this._inputElement.value:""}render(){return vl`
      ${this._hasSlottedElement?vl``:vl`<input class="lit-flatpickr flatpickr flatpickr-input" placeholder=${this.placeholder} />`}
      <slot></slot>
    `}};Ps([Fl({type:String})],Cc.prototype,"placeholder",void 0),Ps([Fl({type:String})],Cc.prototype,"altFormat",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"altInput",void 0),Ps([Fl({type:String})],Cc.prototype,"altInputClass",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"allowInput",void 0),Ps([Fl({type:String})],Cc.prototype,"ariaDateFormat",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"clickOpens",void 0),Ps([Fl({type:String})],Cc.prototype,"dateFormat",void 0),Ps([Fl({type:Object})],Cc.prototype,"defaultDate",void 0),Ps([Fl({type:Number})],Cc.prototype,"defaultHour",void 0),Ps([Fl({type:Number})],Cc.prototype,"defaultMinute",void 0),Ps([Fl({type:Array})],Cc.prototype,"disable",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"disableMobile",void 0),Ps([Fl({type:Array})],Cc.prototype,"enable",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"enableTime",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"enableSeconds",void 0),Ps([Fl({type:Function})],Cc.prototype,"formatDateFn",void 0),Ps([Fl({type:Number})],Cc.prototype,"hourIncrement",void 0),Ps([Fl({type:Number})],Cc.prototype,"minuteIncrement",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"inline",void 0),Ps([Fl({type:String})],Cc.prototype,"maxDate",void 0),Ps([Fl({type:String})],Cc.prototype,"minDate",void 0),Ps([Fl({type:String})],Cc.prototype,"mode",void 0),Ps([Fl({type:String})],Cc.prototype,"nextArrow",void 0),Ps([Fl({type:String})],Cc.prototype,"prevArrow",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"noCalendar",void 0),Ps([Fl({type:Function})],Cc.prototype,"onChange",void 0),Ps([Fl({type:Function})],Cc.prototype,"onClose",void 0),Ps([Fl({type:Function})],Cc.prototype,"onOpen",void 0),Ps([Fl({type:Function})],Cc.prototype,"onReady",void 0),Ps([Fl({type:Function})],Cc.prototype,"onMonthChange",void 0),Ps([Fl({type:Function})],Cc.prototype,"onYearChange",void 0),Ps([Fl({type:Function})],Cc.prototype,"onValueUpdate",void 0),Ps([Fl({type:Function})],Cc.prototype,"parseDateFn",void 0),Ps([Fl({type:String})],Cc.prototype,"position",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"shorthandCurrentMonth",void 0),Ps([Fl({type:Number})],Cc.prototype,"showMonths",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"static",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"time_24hr",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"weekNumbers",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"wrap",void 0),Ps([Fl({type:String})],Cc.prototype,"theme",void 0),Ps([Fl({type:Number})],Cc.prototype,"firstDayOfWeek",void 0),Ps([Fl({type:String})],Cc.prototype,"locale",void 0),Ps([Fl({type:Boolean,attribute:"default-to-today"})],Cc.prototype,"defaultToToday",void 0),Ps([Fl({type:Boolean,attribute:"week-select"})],Cc.prototype,"weekSelect",void 0),Ps([Fl({type:Boolean,attribute:"month-select"})],Cc.prototype,"monthSelect",void 0),Ps([Fl({type:Boolean,attribute:"confirm-date"})],Cc.prototype,"confirmDate",void 0),Ps([Fl({type:Boolean})],Cc.prototype,"_hasSlottedElement",void 0),Cc=Ps([(t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:r,elements:i}=e;return{kind:r,elements:i,finisher(e){customElements.define(t,e)}}})(t,e))("lit-flatpickr")],Cc);var _c=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Dc=class extends V{constructor(){super(...arguments),this.disabled=!1}static get styles(){return[...super.styles]}render(){return o`
      <button
        class="${this.className}"
        @click=${t=>{t.preventDefault(),rt(this.history,this.query,this.to),this.onClick&&this.onClick(t),this.history.push({pathname:window.location.pathname,search:et(this.to)})}}
        type="button"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `}};_c([r({type:Boolean})],Dc.prototype,"disabled",void 0),_c([r({type:Object})],Dc.prototype,"query",void 0),_c([r({type:Object})],Dc.prototype,"onClick",void 0),_c([r({type:Object})],Dc.prototype,"history",void 0),_c([r({type:Object})],Dc.prototype,"to",void 0),Dc=_c([n("pl-query-button")],Dc);var Sc=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Mc=class extends V{constructor(){super(),this.onClickFunction=this.onClick.bind(this)}onClick(t){t.preventDefault(),rt(this.history,this.query,this.to),this.onClickFunction&&this.onClickFunction(t)}static get styles(){return[...super.styles]}render(){return o`
      <pl-link
        .history=${this.history}
        .query=${this.query}
        .to=${{pathname:window.location.pathname,search:et(this.to)}}
        ><slot></slot></pl-link>
    `}};Sc([r({type:Object})],Mc.prototype,"onClickFunction",void 0),Sc([r({type:Object})],Mc.prototype,"query",void 0),Sc([r({type:Object})],Mc.prototype,"to",void 0),Sc([r({type:Object})],Mc.prototype,"history",void 0),Mc=Sc([n("pl-query-link")],Mc);var Tc=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Ec=class extends dt{constructor(){super(),this.mode="menu",this.open=!1,this.handleKeydown=this.handleKeydown.bind(this),this.handleClick=this.handleClick.bind(this),this.setCustomDate=this.setCustomDate.bind(this),this.openCalendar=this.openCalendar.bind(this),this.close=this.close.bind(this),this.toggle=this.toggle.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.handleKeydown),document.addEventListener("mousedown",this.handleClick,!1);const t=new Date(this.site.statsBegin);this.dayBeforeCreation=t.getTime()-864e5}disconnectedCallback(){document.removeEventListener("keydown",this.handleKeydown),document.removeEventListener("mousedown",this.handleClick,!1)}static get styles(){return[...super.styles,e`
        .pointer {
          cursor: pointer;
        }
      `]}updated(t){super.updated(t),t.has("query")&&this.close()}renderArrow(t,e,r){const i=A(this.site.statsBegin),n=P(A(e),i,t),a=j(A(r),O(this.site),t),s="flex items-center px-1 sm:px-2 border-r border-gray-300 rounded-l\n        dark:border-gray-500 dark:text-gray-100 "+(n?"bg-gray-300 dark:bg-gray-950":"hover:bg-gray-100 dark:hover:bg-gray-900"),l="flex items-center px-1 sm:px-2 rounded-r dark:text-gray-100 "+(a?"bg-gray-300 dark:bg-gray-950":"hover:bg-gray-100 dark:hover:bg-gray-900");return o`
      <div
        class="flex rounded shadow bg-white mr-2 sm:mr-4 cursor-pointer dark:bg-gray-800"
      >
        <pl-query-button
          .to=${{date:e}}
          .query=${this.query}
          class="${s}"
          ?disabled=${n}
        >
          <svg
            class="feather h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </pl-query-button>
        <pl-query-button
          .to=${{date:r}}
          .query=${this.query}
          class=${l}
          ?disabled=${a}
        >
          <svg
            class="feather h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </pl-query-button>
      </div>
    `}datePickerArrows(){if("year"===this.query.period){const t=$(C(this.query.date,-12)),e=$(C(this.query.date,12));return this.renderArrow("year",t,e)}if("month"===this.query.period){const t=$(C(this.query.date,-1)),e=$(C(this.query.date,1));return this.renderArrow("month",t,e)}if("day"===this.query.period){const t=$(_(this.query.date,-1)),e=$(_(this.query.date,1));return this.renderArrow("day",t,e)}return a}handleKeydown(t){if("INPUT"===t.target.tagName)return!0;if(t.ctrlKey||t.metaKey||t.altKey||t.isComposing||229===t.keyCode)return!0;const e={period:"",from:"",to:"",date:""},r=A(this.site.statsBegin);if("ArrowLeft"===t.key){const t=$(_(this.query.date,-1)),i=$(C(this.query.date,-1)),n=$(C(this.query.date,-12));"day"!==this.query.period||P(A(t),r,this.query.period)?"month"!==this.query.period||P(A(i),r,this.query.period)?"year"!==this.query.period||P(A(n),r,this.query.period)||(e.period="year",e.date=n):(e.period="month",e.date=i):(e.period="day",e.date=t)}else if("ArrowRight"===t.key){const t=O(this.site),r=$(_(this.query.date,1)),i=$(C(this.query.date,1)),n=$(C(this.query.date,12));"day"!==this.query.period||j(A(r),t,this.query.period)?"month"!==this.query.period||j(A(i),t,this.query.period)?"year"!==this.query.period||j(A(n),t,this.query.period)||(e.period="year",e.date=n):(e.period="month",e.date=i):(e.period="day",e.date=r)}this.open=!1;const i=["d","e","r","w","m","y","t","s","l","a"],n=[{date:!1,period:"day"},{date:$(_(O(this.site),-1)),period:"day"},{period:"realtime"},{date:!1,period:"7d"},{date:!1,period:"month"},{date:!1,period:"year"},{date:!1,period:"30d"},{date:!1,period:"6mo"},{date:!1,period:"12mo"},{date:!1,period:"all"}];return i.includes(t.key.toLowerCase())?rt(this.history,this.query,{...e,...n[i.indexOf(t.key.toLowerCase())]}):"c"===t.key.toLowerCase()?this.openCalendar():e.date&&rt(this.history,this.query,e),!1}handleClick(t){!this.dropdownNode||this.dropdownNode.contains(t.target)}setCustomDate(t){if(2===t.length){const[e,r]=t;$(e)===$(r)?rt(this.history,this.query,{period:"day",date:$(e),from:"",to:""}):rt(this.history,this.query,{period:"custom",date:"",from:$(e),to:$(r)}),this.close()}}timeFrameText(){return"day"===this.query.period?I(this.site,this.query.date)?this.t("Today"):T(this.query.date):"7d"===this.query.period?this.t("Last 7 days"):"30d"===this.query.period?this.t("Last 30 days"):"month"===this.query.period?function(t,e){return M(e)===M(O(t))}(this.site,this.query.date)?this.t("Month to Date"):M(this.query.date):"6mo"===this.query.period?this.t("Last 6 months"):"12mo"===this.query.period?this.t("Last 12 months"):"year"===this.query.period?function(t,e){return e.getFullYear()===O(t).getFullYear()}(this.site,this.query.date)?this.t("Year to Date"):function(t){return`Year of ${t.getFullYear()}`}(this.query.date):"all"===this.query.period?this.t("All time"):"custom"===this.query.period?`${E(this.query.from)} - ${E(this.query.to)}`:this.t("Realtime")}toggle(){const t="calendar"!==this.mode||this.open?this.mode:"menu";this.mode=t,this.open=!this.open,this.requestUpdate()}close(){this.open=!1}async openCalendar(){this.mode="calendar",this.open=!0;(await this.calendar).open()}renderLink(t,e,r={}){let i;if("day"===this.query.period&&"day"===t)i=I(this.site,this.query.date)?"font-bold":"";else if("month"===this.query.period&&"month"===t){const t=r.date||O(this.site);n=t,a=this.query.date,i=M(n)===M(a)?"font-bold":""}else i=this.query.period===t?"font-bold":"";var n,a;r.date=!!r.date&&$(r.date);return o`
      <pl-query-link
        .to=${{from:!1,to:!1,period:t,...r}}
        .onClick=${this.close}
        .history="${this.history}"
        .query=${this.query}
        class=${`${i} px-4 py-2 text-sm leading-tight hover:bg-gray-100 hover:text-gray-900\n          dark:hover:bg-gray-900 dark:hover:text-gray-100 flex items-center justify-between`}
      >
        ${e}
        <span class="font-normal">${{Today:"D",Realtime:"R","Last 7 days":"W","Month to Date":"M","Year to Date":"Y","Last 12 months":"L","Last 30 days":"T","All time":"A"}[e]}</span>
      </pl-query-link>
    `}renderDropDownContent(){return"menu"===this.mode?o`
        <div
          id="datemenu"
          class="absolute w-full md:w-56 md:absolute md:top-auto md:left-auto md:right-0 mt-2 origin-top-right z-10"
        >
          <div
            class="rounded-md shadow-lg  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5
            font-medium text-gray-800 dark:text-gray-200 date-options"
          >
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink("day",this.t("Today"))}
              ${this.renderLink("realtime",this.t("Realtime"))}
            </div>
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink("7d",this.t("Last 7 days"))}
              ${this.renderLink("30d",this.t("Last 30 days"))}
            </div>
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink("month",this.t("Month to Date"))}
              ${this.renderLink("month",this.t("Last month"),{date:(t=this.site,C(O(t),-1))})}
            </div>
            <div
              class="py-1 border-b border-gray-200 dark:border-gray-500 date-option-group"
            >
              ${this.renderLink("year",this.t("Year to Date"))}
              ${this.renderLink("12mo",this.t("Last 12 months"))}
            </div>
            <div class="py-1 date-option-group">
              ${this.renderLink("all",this.t("All time"))}
              <span
                @click="${()=>{this.openCalendar()}}"
                class="px-4 py-2 text-sm leading-tight hover:bg-gray-100
                  dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100
                  cursor-pointer flex items-center justify-between"
                tabIndex="0"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="calendar"
              >
                ${this.t("Custom range")}
                <span class="font-normal">C</span>
              </span>
            </div>
          </div>
        </div>
      `:(this.mode,a);var t}renderPicker(){return o`
      <div id="dropdownNode" class="sm:w-36 md:w-48 md:relative">
        <div
          @click=${this.toggle}
          @keyPress=${this.toggle}
          class="flex items-center justify-between rounded bg-white dark:bg-gray-800 shadow px-2 md:px-3
          py-2 leading-tight cursor-pointer text-xs md:text-sm text-gray-800
          dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-900"
          style="width: 192px"
          tabindex="0"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="datemenu"
        >
          <span class="truncate mr-1 md:mr-2">
            ${this.leadingText}
            <span class="font-medium">${this.timeFrameText()}</span>
          </span>
          <div class=" sm:inline-block h-4 w-4 md:h-5 md:w-5 text-gray-500">
            ${zt}
          </div>
        </div>

        ${this.open?this.renderDropDownContent():a}
        <lit-flatpickr
          id="calendar"
          mode="range"
          style="height: 0; width: 0;"
          maxDate="today"
          .minDate=${this.dayBeforeCreation}
          showMonths="1"
          animate="true"
          .onValueUpdate="${this.setCustomDate}"
        >
        </lit-flatpickr>
      </div>
    `}render(){return o`
      <div class="flex ml-auto pl-2 pointer">
        ${this.datePickerArrows()} ${this.renderPicker()}
      </div>
    `}};Tc([r({type:Object})],Ec.prototype,"history",void 0),Tc([l("#dropdownNode")],Ec.prototype,"dropdownNode",void 0),Tc([function(e){return(r,i)=>t(r,i,{async get(){return await this.updateComplete,this.renderRoot?.querySelector(e)??null}})}("#calendar")],Ec.prototype,"calendar",void 0),Tc([r({type:String})],Ec.prototype,"leadingText",void 0),Tc([r({type:String})],Ec.prototype,"mode",void 0),Tc([r({type:Boolean})],Ec.prototype,"open",void 0),Ec=Tc([n("pl-date-picker")],Ec);const Ac={page:["page","entry_page","exit_page"],source:["source","referrer"],location:["country","region","city"],screen:["screen"],browser:["browser","browser_version"],os:["os","os_version"],utm:["utm_medium","utm_source","utm_campaign","utm_term","utm_content"],goal:["goal"],props:["prop_key","prop_value"]},Oc={isNot:"is not",contains:"contains",is:"is"},Ic={[Oc.isNot]:"!",[Oc.contains]:"~",[Oc.is]:""};function Pc(t){return Object.keys(Ic).find((e=>Ic[e]===t[0]))||Oc.is}function jc(t){return[Oc.isNot,Oc.contains].includes(Pc(t))?t.substring(1):t}function qc(t){return Object.entries(Ac).reduce(((t,[e,r])=>{const i={};return r.forEach((t=>{i[t]=e})),{...t,...i}}),{})[t]||t}var Nc=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Lc=class extends dt{constructor(){super(...arguments),this.viewport=1080,this.wrapped=1,this.addingFilter=!1,this.menuOpen=!1}connectedCallback(){super.connectedCallback(),this.renderDropDown=this.renderDropDown.bind(this),this.handleResize=this.handleResize.bind(this),this.handleKeyup=this.handleKeyup.bind(this),document.addEventListener("mousedown",this.handleClick,!1),window.addEventListener("resize",this.handleResize,!1),document.addEventListener("keyup",this.handleKeyup)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keyup",this.handleKeyup),document.removeEventListener("mousedown",this.handleClick,!1),window.removeEventListener("resize",this.handleResize,!1)}updated(t){(t.get("query")||t.get("viewport"))&&(this.wrapped=1),t.get("wrapped")&&1===this.wrapped&&-1!==t.get("wrapped")&&this.rewrapFilters(),this.rewrapFilters()}firstUpdated(){this.handleResize(),this.rewrapFilters()}static get styles(){return[...super.styles,e`
        .filterMain {
          margin-right: 0px;
          font-size: 14px;
          color: #444;
        }

        .filterKeys {
          padding-top: 8px;
        }

        .filterContainer {
          padding-top: 0px;
          padding-bottom: 0px;
          height: 32px;
          font-size: 12px;
        }
      `]}handleClick(t){this.menuOpen&&!this.contains(t.target)&&(this.menuOpen=!1),this.menuOpen=!1}removeFilter(t){const e={[t]:!1};"country"===t&&(e.country_name=!1),"region"===t&&(e.region_name=!1),"city"===t&&(e.city_name=!1),this.menuOpen=!1,rt(this.history,this.query,e)}clearAllFilters(){const t=Object.keys(this.query.filters).reduce(((t,e)=>({...t,[e]:!1})),{});rt(this.history,this.query,t),this.menuOpen=!1}filterText(t,e){const r=Pc(e),i=this.t(r),n=jc(e);if("goal"===t)return o`${this.t("Completed goal")}: <b>${this.t(n)}</b>`;if("props"===t){const[t,e]=Object.entries(n)[0],r=this.query.filters.goal?this.query.filters.goal:"event";return o`${r}.${t} ${Pc(e)}
        <b>${jc(e)}</b>`}if("browser_version"===t){const t=this.query.filters.browser?this.query.filters.browser:this.t("Browser");return o`${t}.Version ${i} <b>${n}</b>`}if("os_version"===t){const t=this.query.filters.os?this.query.filters.os:"OS";return o`${t}.Version ${i} <b>${n}</b>`}if("country"===t){const t=new URLSearchParams(window.location.search).get("country_name");return o`${this.t("Country")} ${i} <b>${t}</b>`}if("region"===t){const t=new URLSearchParams(window.location.search).get("region_name");return o`${this.t("Region")} ${i} <b>${t}</b>`}if("city"===t){const t=new URLSearchParams(window.location.search).get("city_name");return o`${this.t("City")} ${i} <b>${t}</b>`}const a=it[t];if(a)return o`${this.t(a)} ${i} <b>${n}</b>`;throw new Error(`Unknown filter: ${t}`)}renderDropdownFilter(t){const e=t[0],r=t[1];return o`
      <div key=${e}>
        <div
          class="px-3 md:px-4 sm:py-2 py-3 text-sm leading-tight flex items-center justify-between"
          key="{key"
          +
          value}
        >
          <pl-link
            title=${`Edit filter: ${it[e]}`}
            .to=${{pathname:`/${encodeURIComponent(this.site.domain)}/filter/${qc(e)}`,search:window.location.search}}
            class="group flex w-full justify-between items-center"
            .style=${{width:"calc(100% - 1.5rem)"}}
          >
            <span class="inline-block w-full truncate"
              >${this.filterText(e,r)}</span
            >
            <div hidden
              class="w-4 h-4 ml-1 cursor-pointer group-hover:text-indigo-700 dark:group-hover:text-indigo-500"
            >
              ${Ft}
            </div>
          </pl-link>
          <b
            title=${`Remove filter: ${it[e]}`}
            class="ml-2 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-500"
            @click=${()=>this.removeFilter(e)}
          >
            <div class="w-4 h-4">${Ut}</div>
          </b>
        </div>
      </div>
    `}filterDropdownOption(t){return o`
      <div key=${t}>
        <pl-link
          .to=${{pathname:`/${encodeURIComponent(this.site.domain)}/filter/${t}`,search:window.location.search}}
          class="${"bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"} block px-4 py-2 text-sm font-medium"
        >
          ${function(t){return"utm"===t?"UTM tags":"location"===t?"Location":"props"===t?"Property":this.t(it[t])}(t)}
        </pl-link>
      </div>
    `}renderDropdownContentOriginal(){return 0===this.wrapped||this.addingFilter?Object.keys(Ac).filter((t=>"props"!==t||this.site.flags.custom_dimension_filter)).map((t=>this.filterDropdownOption(t))):o`
        <div
          class="border-b border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
          @click=${()=>this.addingFilter=!0}
        >
          + Add filter
        </div>
        ${tt(this.query).map((t=>this.renderDropdownFilter(t)))}
        <div key="clear">
          <div
            class="border-t border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
            @click=${()=>this.clearAllFilters()}
          >
           ${this.t("Clear All Filters")}
          </div>
        </div>
      `}renderDropdownContent(){return 0===this.wrapped||this.addingFilter?a:o`
        ${tt(this.query).map((t=>this.renderDropdownFilter(t)))}
        <div key="clear">
          <div
            class="pointer border-t border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
            @click=${()=>this.clearAllFilters()}
          >
            ${this.t("Clear All Filters")}
          </div>
        </div>
      `}handleKeyup(t){t.ctrlKey||t.metaKey||t.altKey||"Escape"===t.key&&this.clearAllFilters()}handleResize(){this.viewport=window.innerWidth||639}rewrapFilters(){const t=this.$$("#filters");if(tt(this.query).length>0&&this.viewport<=768)return void(this.wrapped=2);if(1!==this.wrapped||!t||1===tt(this.query).length)return;let e;[...t.childNodes].forEach((t=>{if("function"==typeof t.getBoundingClientRect){const r=t.getBoundingClientRect();e&&e.top<r.top&&(this.wrapped=2),e=r}}))}renderListFilter(t){const e=t[0],r=t[1];return o`
      <div
        .key=${e}
        .title=${r}
        class="flex bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow text-sm rounded mr-2 items-center filterContainer"
      >
        <pl-link
          .title=${`Edit filter: ${it[e]}`}
          class="flex w-full h-full items-center py-2 pl-3"
          .to=${{pathname:`/${encodeURIComponent(this.site.domain)}/filter/${qc(e)}`,search:window.location.search}}
        >
          <span class="filterKeys inline-block max-w-2xs md:max-w-xs truncate"
            >${this.filterText(e,r)}</span
          >
        </pl-link>
        <span
          .title=${`Remove filter: ${it[e]}`}
          class="flex h-full w-full px-2 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-500 items-center"
          @click=${()=>this.removeFilter(e)}
        >
          <div class="w-4 h-4">${Ut}</div>
        </span>
      </div>
    `}renderDropdownButton(){if(2===this.wrapped){const t=tt(this.query).length;return o`
        <div class="flex">
          <div class="-ml-1 mr-1 h-4 w-4 layout horizontal" aria-hidden="true">
            ${Lt}
          </div>
          <div>${t} Filter${1===t?"":"s"}</div>
        </div>
      `}return 1===this.wrapped?a:o`
        <div class="flex">
          <div class="ml-1 mr-1 h-4 w-4 h-4 w-4" aria-hidden="true">
            ${Rt}
          </div>
          <!-- This would have been a good use-case for JSX! But in the interest of keeping the breakpoint width logic with TailwindCSS, this is a better long-term way to deal with it. -->
          <span class="">Filter</span>
        </div>
      `}toggleMenu(){this.menuOpen=!this.menuOpen}renderDropDown(){return o`
      <div class="flex">
        <div class="flex"></div>
        <button @click="${this.toggleMenu}">
          ${this.renderDropdownButton()}
        </button>
      </div>

      ${this.menuOpen?o`
            <div class="md:relative ml-auto">
              <div
                static
                class="absolute w-full left-0 right-0 md:w-72 md:absolute md:top-auto md:left-auto md:right-0 mt-2 origin-top-right z-10"
              >
                <div
                  class="rounded-md shadow-lg  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5
              font-medium text-gray-800 dark:text-gray-200"
                >
                  ${this.renderDropdownContent()}
                </div>
              </div>
            </div>
          `:a}
    `}renderFilterList(){return 2!==this.wrapped?o`
        <div id="filters" class="flex flex-wrap">
          ${tt(this.query).map((t=>this.renderListFilter(t)))}
        </div>
      `:a}render(){return o`
      <div class="flex ml-auto pl-2 filterMain">
        ${this.renderFilterList()} ${this.renderDropDown()}
      </div>
    `}};Nc([r({type:String})],Lc.prototype,"url",void 0),Nc([r({type:Number})],Lc.prototype,"viewport",void 0),Nc([r({type:Number})],Lc.prototype,"wrapped",void 0),Nc([r({type:Object})],Lc.prototype,"history",void 0),Nc([r({type:Boolean})],Lc.prototype,"addingFilter",void 0),Nc([r({type:Boolean})],Lc.prototype,"menuOpen",void 0),Lc=Nc([n("pl-filters")],Lc);var Rc=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Uc=class extends dt{constructor(){super(...arguments),this.stuck=!1}updated(t){super.updated(t)}static get styles(){return[...super.styles,e`
        @media (max-width: 768px) {
          .mb-12 {
            max-width: calc(100vw - 32px);
          }
        }
      `]}render(){const t=this.site.embedded?"relative":"sticky";return o`
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${t} top-0 sm:py-3 py-2 z-10 ${this.stuck&&!this.site.embedded?"fullwidth-shadow bg-gray-50 dark:bg-gray-850":""}`}
        >
          <div class="items-center w-full flex">
            <div class="flex items-center w-full">
              <pl-siteswitcher
                .site="${this.site}"
                .currentUserRole="${this.currentUserRole}"
              ></pl-siteswitcher>
              <div class="flex w-full"></div>
              <pl-filters
                class="flex flex-grow"
                style="text-align: right;display: inline;"
                .site=${this.site}
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-date-picker
              .site="${this.site}"
              .query="${this.query}"
              .history="${this.history}"
            ></pl-date-picker>
          </div>
        </div>
        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .timer="${this.timer}"
          .proxyUrl="${this.proxyUrl}"
          useTopStatsForCurrentVisitors
        ></pl-visitors-graph>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex flex flex-wrap">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `}renderConversions(){return this.site.hasGoals?o`
        <div class="items-start justify-between block w-full mt-6 md:flex flex-wrap">
          <pl-conversions
            .site=${this.site}
            .query=${this.query}
            .timer=${this.timer}
            .title="${this.t("goalConversionsLast30Min")}"
            .proxyUrl=${this.proxyUrl}
            .highlightedGoals=${this.highlightedGoals}
          ></pl-conversions>
        </div>
      `:a}};Rc([r({type:Object})],Uc.prototype,"history",void 0),Rc([r({type:Boolean})],Uc.prototype,"stuck",void 0),Rc([r({type:Array})],Uc.prototype,"highlightedGoals",void 0),Uc=Rc([n("pl-realtime")],Uc);const Fc="object"==typeof self?self:globalThis,zc=t=>((t,e)=>{const r=(e,r)=>(t.set(r,e),e),i=n=>{if(t.has(n))return t.get(n);const[o,a]=e[n];switch(o){case 0:case-1:return r(a,n);case 1:{const t=r([],n);for(const e of a)t.push(i(e));return t}case 2:{const t=r({},n);for(const[e,r]of a)t[i(e)]=i(r);return t}case 3:return r(new Date(a),n);case 4:{const{source:t,flags:e}=a;return r(new RegExp(t,e),n)}case 5:{const t=r(new Map,n);for(const[e,r]of a)t.set(i(e),i(r));return t}case 6:{const t=r(new Set,n);for(const e of a)t.add(i(e));return t}case 7:{const{name:t,message:e}=a;return r(new Fc[t](e),n)}case 8:return r(BigInt(a),n);case"BigInt":return r(Object(BigInt(a)),n)}return r(new Fc[o](a),n)};return i})(new Map,t)(0),Bc="",{toString:Hc}={},{keys:Yc}=Object,Wc=t=>{const e=typeof t;if("object"!==e||!t)return[0,e];const r=Hc.call(t).slice(8,-1);switch(r){case"Array":return[1,Bc];case"Object":return[2,Bc];case"Date":return[3,Bc];case"RegExp":return[4,Bc];case"Map":return[5,Bc];case"Set":return[6,Bc]}return r.includes("Array")?[1,r]:r.includes("Error")?[7,r]:[2,r]},Vc=([t,e])=>0===t&&("function"===e||"symbol"===e),Gc=(t,{json:e,lossy:r}={})=>{const i=[];return((t,e,r,i)=>{const n=(t,e)=>{const n=i.push(t)-1;return r.set(e,n),n},o=i=>{if(r.has(i))return r.get(i);let[a,s]=Wc(i);switch(a){case 0:{let e=i;switch(s){case"bigint":a=8,e=i.toString();break;case"function":case"symbol":if(t)throw new TypeError("unable to serialize "+s);e=null;break;case"undefined":return n([-1],i)}return n([a,e],i)}case 1:{if(s)return n([s,[...i]],i);const t=[],e=n([a,t],i);for(const e of i)t.push(o(e));return e}case 2:{if(s)switch(s){case"BigInt":return n([s,i.toString()],i);case"Boolean":case"Number":case"String":return n([s,i.valueOf()],i)}if(e&&"toJSON"in i)return o(i.toJSON());const r=[],l=n([a,r],i);for(const e of Yc(i))!t&&Vc(Wc(i[e]))||r.push([o(e),o(i[e])]);return l}case 3:return n([a,i.toISOString()],i);case 4:{const{source:t,flags:e}=i;return n([a,{source:t,flags:e}],i)}case 5:{const e=[],r=n([a,e],i);for(const[r,n]of i)(t||!Vc(Wc(r))&&!Vc(Wc(n)))&&e.push([o(r),o(n)]);return r}case 6:{const e=[],r=n([a,e],i);for(const r of i)!t&&Vc(Wc(r))||e.push(o(r));return r}}const{message:l}=i;return n([a,{name:s,message:l}],i)};return o})(!(e||r),!!e,new Map,i)(t),i};var Kc="function"==typeof structuredClone?(t,e)=>e&&("json"in e||"lossy"in e)?zc(Gc(t,e)):structuredClone(t):(t,e)=>zc(Gc(t,e)),Xc=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Jc=class extends dt{constructor(){super(...arguments),this.useTopStatsForCurrentVisitors=!1}connectedCallback(){super.connectedCallback(),this.timer.onTick(this.updateCount.bind(this)),this.updateCount()}static get styles(){return[...super.styles,e`
        pl-link {
          width: 100%;
        }

        [hidden] {
          display: none !important;
        }
      `]}updateCount(){if(this.useTopStatsForCurrentVisitors){const t=Kc(this.query);return t.period="realtime",U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`,t).then((t=>{this.currentVisitors=t.top_stats[1].value})).catch((t=>(console.error(t),null)))}return U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/current-visitors`,{}).then((t=>{this.currentVisitors=t})).catch((t=>(console.error(t),null)))}render(){return tt(this.query).length>=1?null:null!==this.currentVisitors?o`
        <pl-link
          .to=${{search:lt("period","realtime")}}
          class="block ml-1 md:ml-2 mr-auto text-xs md:text-sm font-bold text-gray-500 dark:text-gray-300"
        >
          <svg
            class="inline w-2 mr-1 md:mr-2 text-green-500 fill-current"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" />
          </svg>
          ${this.currentVisitors}
          <span ?hidden="${!this.wide}" class=" sm:inline-block"
            >${1===this.currentVisitors?this.t("current visitor"):this.t("current visitors")}</span
          >
        </pl-link>
      `:a}};Xc([r({type:Number})],Jc.prototype,"currentVisitors",void 0),Xc([r({type:Boolean})],Jc.prototype,"useTopStatsForCurrentVisitors",void 0),Jc=Xc([n("pl-current-visitors")],Jc);var Zc=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Qc=class extends dt{constructor(){super(...arguments),this.stuck=!1}static get styles(){return[...super.styles,e`
        @media (max-width: 768px) {
          .mb-12 {
            max-width: calc(100vw - 32px);
          }
        }
      `]}render(){const t=this.site.embedded?"relative":"sticky";return o`
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${t} top-0 sm:py-3 py-2 z-10 ${this.stuck&&!this.site.embedded?"fullwidth-shadow bg-gray-50 dark:bg-gray-850":""}`}
        >
          <div class="items-center w-full flex">
            <div class="flex items-center w-full">
              <pl-siteswitcher
                .site="${this.site}"
                .currentUserRole="${this.currentUserRole}"
              ></pl-siteswitcher>
              <pl-current-visitors
                .timer=${this.timer}
                .site=${this.site}
                .query=${this.query}
                .proxyUrl="${this.proxyUrl}"
              ></pl-current-visitors>
              <div class="flex w-full"></div>
              <pl-filters
                class="flex"
                .site=${this.site}
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-date-picker
              .site="${this.site}"
              .query="${this.query}"
              .history="${this.history}"
            ></pl-date-picker>
          </div>
        </div>
        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
        ></pl-visitors-graph>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex flex flex-wrap">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `}renderConversions(){return this.site.hasGoals?o`
        <div class="items-start justify-between block w-full mt-6 md:flex flex-wrap">
          <pl-conversions
            .site=${this.site}
            .query=${this.query}
            .proxyUrl=${this.proxyUrl}
            .highlightedGoals=${this.highlightedGoals}
          ></pl-conversions>
        </div>
      `:a}};var td;Zc([r({type:Object})],Qc.prototype,"history",void 0),Zc([r({type:Boolean})],Qc.prototype,"stuck",void 0),Zc([r({type:Array})],Qc.prototype,"highlightedGoals",void 0),Qc=Zc([n("pl-historical")],Qc),function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"}(td||(td={}));const ed="beforeunload";function rd(t={}){let{window:e=document.defaultView}=t,r=e.history;function i(){let{pathname:t,search:i,hash:n}=e.location,o=r.state||{};return[o.idx,{pathname:t,search:i,hash:n,state:o.usr||null,key:o.key||"default"}]}let n=null;e.addEventListener("popstate",(function(){if(n)c.call(n),n=null;else{let t=td.Pop,[e,r]=i();if(c.length)if(null!=e){let i=a-e;i&&(n={action:t,location:r,retry(){m(-1*i)}},m(i))}else!function(t,e){"undefined"!=typeof console&&console.warn(e);try{throw new Error(e)}catch(t){}}(0,"You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");else g(t)}}));let o=td.Pop,[a,s]=i(),l=nd(),c=nd();function d(t){return"string"==typeof t?t:function({pathname:t="/",search:e="",hash:r=""}){e&&"?"!==e&&(t+="?"===e.charAt(0)?e:"?"+e);r&&"#"!==r&&(t+="#"===r.charAt(0)?r:"#"+r);return t}(t)}function p(t,e=null){return{pathname:s.pathname,hash:"",search:"",..."string"==typeof t?od(t):t,state:e,key:Math.random().toString(36).substr(2,8)}}function h(t,e){return[{usr:t.state,key:t.key,idx:e},d(t)]}function u(t,e,r){return!c.length||(c.call({action:t,location:e,retry:r}),!1)}function g(t){o=t,[a,s]=i(),l.call({action:o,location:s})}function m(t){r.go(t)}null==a&&(a=0,r.replaceState({...r.state,idx:a},""));let f={get action(){return o},get location(){return s},createHref:d,push:function t(i,n){let o=td.Push,s=p(i,n);if(u(o,s,(function(){t(i,n)}))){let[t,i]=h(s,a+1);try{r.pushState(t,"",i)}catch(t){e.location.assign(i)}g(o)}},replace:function t(e,i){let n=td.Replace,o=p(e,i);if(u(n,o,(function(){t(e,i)}))){let[t,e]=h(o,a);r.replaceState(t,"",e),g(n)}},go:m,back(){m(-1)},forward(){m(1)},listen:t=>l.push(t),block(t){let r=c.push(t);return 1===c.length&&e.addEventListener(ed,id),function(){r(),c.length||e.removeEventListener(ed,id)}}};return f}function id(t){t.preventDefault(),t.returnValue=""}function nd(){let t=[];return{get length(){return t.length},push:e=>(t.push(e),function(){t=t.filter((t=>t!==e))}),call(e){t.forEach((t=>t&&t(e)))}}}function od(t){let e={};if(t){let r=t.indexOf("#");r>=0&&(e.hash=t.substr(r),t=t.substr(0,r));let i=t.indexOf("?");i>=0&&(e.search=t.substr(i),t=t.substr(0,i)),t&&(e.pathname=t)}return e}var ad=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};class sd{constructor(){this.listeners=[],this.intervalId=setInterval(this.dispatchTick.bind(this),3e4)}onTick(t){this.listeners.push(t)}dispatchTick(){for(const t of this.listeners)t()}}let ld=class extends dt{constructor(){super(),this.metric="visitors"}resetState(){}connectedCallback(){super.connectedCallback(),this.timer=new sd,this.history=rd(),this.query=Q(location.search,this.site),window.addEventListener("popstate",(()=>{this.query=Q(location.search,this.site)}))}static get styles(){return[...super.styles]}updated(t){super.updated(t),t.has("query")&&(N.abort(),N=new AbortController,this.resetState())}render(){return this.site&&this.query?"realtime"===this.query.period?o`
          <pl-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .history="${this.history}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-realtime>
        `:o`
          <pl-historical
            .timer="${this.timer}"
            .site="${this.site}"
            .history="${this.history}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-historical>
        `:a}};ad([r({type:Object})],ld.prototype,"history",void 0),ad([r({type:String})],ld.prototype,"metric",void 0),ld=ad([n("pl-dashboard")],ld);var cd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};class dd extends dt{regenerateChart(){}fetchGraphData(){}constructor(){super(),this.darkTheme=!1,this.exported=!1,this.gradientColorStop1="rgba(101,116,205, 0.2)",this.gradientColorStop2="rgba(101,116,205, 0.2)",this.prevGradientColorStop1="rgba(101,116,205, 0.075)",this.prevGradientColorStop2="rgba(101,116,205, 0)",this.borderColor="rgba(101,116,205)",this.pointBackgroundColor="rgba(101,116,205)",this.pointHoverBackgroundColor="rgba(71, 87, 193)",this.prevPointHoverBackgroundColor="rgba(166,187,210,0.8)",this.prevBorderColor="rgba(166,187,210,0.5)",this.chartHeigh=342,this.chartWidth=1054,this.metrics="visitors",this.method="timeseries",this.repositionTooltip=this.repositionTooltip.bind(this)}static get styles(){return[...super.styles,e`.mainContainer{
      margin-top: 24px;
    }`]}connectedCallback(){super.connectedCallback(),window.addEventListener("mousemove",this.repositionTooltip),this.fetchGraphData=this.fetchGraphData.bind(this)}firstUpdated(t){this.fetchGraphData(),this.timer&&this.timer.onTick(this.fetchGraphData),this.graphData&&(this.chart=this.regenerateChart()),this.timer&&this.timer.onTick(this.fetchGraphData)}updated(t){super.updated(t),t.get("query")&&this.fetchGraphData();const e=this.$$("#chartjs-tooltip");this.graphData&&(t.has("graphData")||t.has("darkTheme"))&&(this.chart&&this.chart.destroy(),this.chart=this.regenerateChart(),this.chart.update(),e&&(e.style.display="none")),this.graphData||(this.chart&&this.chart.destroy(),e&&(e.style.display="none"))}disconnectedCallback(){super.disconnectedCallback();const t=document.getElementById("chartjs-tooltip");t&&(t.style.opacity="0",t.style.display="none"),window.removeEventListener("mousemove",this.repositionTooltip)}buildDataSet(t,e,r,i=!1){var n=r.createLinearGradient(0,0,0,300),o=r.createLinearGradient(0,0,0,300);if(n.addColorStop(0,this.gradientColorStop1),n.addColorStop(1,this.gradientColorStop2),o.addColorStop(0,this.prevGradientColorStop1),o.addColorStop(1,this.prevGradientColorStop2),i)return[{label:this.label,data:t,borderWidth:2,borderColor:this.prevBorderColor,pointHoverBackgroundColor:this.prevPointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0}];if(e){var a=t.slice(e-1,e+1),s=new Array(e-1).concat(a);const r=[...t];for(var l=e;l<r.length;l++)r[l]=void 0;return[{label:this.label,data:r,borderWidth:3,borderColor:this.borderColor,pointBackgroundColor:this.pointBackgroundColor,pointHoverBackgroundColor:this.pointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:n,fill:!0},{label:this.label,data:s,borderWidth:3,borderDash:[3,3],borderColor:this.borderColor,pointHoverBackgroundColor:this.pointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:n,fill:!0}]}return[{label:this.label,data:t,borderWidth:3,borderColor:this.borderColor,pointHoverBackgroundColor:this.pointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:n,fill:!0}]}transformCustomDateForStatsQuery(t){return"custom"==t.period?(t.date=`${$(t.from)},${$(t.to)}`,t.from=void 0,t.to=void 0,t):t}repositionTooltip(t){const e=this.$$("#chartjs-tooltip");e&&window.innerWidth>=768&&(t.clientX>.66*window.innerWidth?(e.style.right=window.innerWidth-t.clientX+window.pageXOffset+"px",e.style.left=""):(e.style.right="",e.style.left=t.clientX+window.pageXOffset+"px"),e.style.top=t.clientY+window.pageYOffset+"px",e.style.opacity="1")}updateWindowDimensions(t,e){t.options.scales.x.ticks.maxTicksLimit=e.width<720?5:8,t.options.scales.y.ticks.maxTicksLimit=e.height<233?3:8}pollExportReady(){document.cookie.includes("exporting")?setTimeout(this.pollExportReady.bind(this),1e3):this.exported=!1}downloadSpinner(){this.exported=!0,document.cookie="exporting=",setTimeout(this.pollExportReady.bind(this),1e3)}graphTooltip(t,e,r){return i=>{const n=i.tooltip,o=e.getBoundingClientRect();let a=r;if(a||(a=document.createElement("div"),a.id="chartjs-tooltip",a.style.display="none",a.style.opacity=0,document.body.appendChild(a)),a&&o&&window.innerWidth<768&&(a.style.top=o.y+o.height+window.scrollY+15+"px",a.style.left=o.x+"px",a.style.right=null,a.style.opacity=1),0!==n.opacity){if(n.body){var s=n.body.map((function(t){return t.lines}));3===s.length&&(s[1]=!1);const e=n.dataPoints[0],r=t.labels[e.dataIndex],i=e.raw||0;let o=`\n        <div class='text-gray-100 flex flex-col'>\n          <div class='flex justify-between items-center'>\n              <span class='font-bold mr-4 text-lg'>${this.label}</span>\n          </div>\n          <div class='flex flex-col'>\n            <div class='flex flex-row justify-between items-center'>\n              <span class='flex items-center mr-4'>\n                <div class='w-3 h-3 mr-1 rounded-full' style='background-color: rgba(101,116,205)'></div>\n                <span>${function(e,r){const i=nt(t.interval,!0)(e),n=r&&nt(t.interval,!0)(r);return"month"===t.interval||"date"===t.interval?r?n:i:"hour"===t.interval?r?`${nt("date",!0)(r)}, ${nt(t.interval,!0)(r)}`:`${nt("date",!0)(e)}, ${i}`:r?n:i}(r)}</span>\n              </span>\n              <span>${x(i)}</span>\n            </div>\n          </div>\n          <span class='font-bold text-'>${"month"===t.interval?"Click to view month":"date"===t.interval?"Click to view day":""}</span>\n        </div>\n        `;a.innerHTML=o}a.style.display=null}else a.style.display="none"}}onClick(t){const e=this.chart.getElementsAtEventForMode(t,"index",{intersect:!1},!1)[0],r=this.chart.data.labels[e.index];"month"===this.graphData.interval?rt(this.history,this.query,{period:"month",date:r}):"date"===this.graphData.interval&&rt(this.history,this.query,{period:"day",date:r})}downloadLink(){if("realtime"!==this.query.period){if(this.exported)return o`
          <div class="w-4 h-4 mx-2">
            <svg
              class="animate-spin h-4 w-4 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        `;{const t=`/${encodeURIComponent(this.site.domain)}/export${R(this.query)}`;return o`
          <a
            hidden
            class="w-4 h-4 mx-2"
            href="${t}"
            download
            @click="${this.downloadSpinner.bind(this)}"
          >
            <svg
              style="max-width: 50px;max-height: 50px;"
              class="absolute text-gray-700 feather dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        `}}return a}renderHeader(){}render(){if(this.graphData){const t=this.graphData&&"hour"===this.graphData.interval?"":"cursor-pointer";return o`
        <div class="mainContainer w-full p-4 bg-white rounded shadow-xl dark:bg-gray-825">
          ${this.renderHeader()}
          <div class="relative px-2">
            <div class="absolute right-4 -top-10 flex">
              ${this.downloadLink()}
            </div>
            <canvas
              id="main-graph-canvas"
              class=${"mt-4 select-none "+t}
              width="${this.chartWidth}"
              height="${this.chartHeigh}"
            ></canvas>
          </div>
        </div>
      `}return a}}cd([r({type:Object})],dd.prototype,"graphData",void 0),cd([r({type:Object})],dd.prototype,"ctx",void 0),cd([r({type:Boolean})],dd.prototype,"darkTheme",void 0),cd([r({type:Object})],dd.prototype,"chart",void 0),cd([l("canvas")],dd.prototype,"canvasElement",void 0),cd([r({type:Boolean})],dd.prototype,"exported",void 0),cd([r({type:Object})],dd.prototype,"history",void 0),cd([r({type:String})],dd.prototype,"chartTitle",void 0),cd([r({type:String})],dd.prototype,"label",void 0),cd([r({type:String})],dd.prototype,"gradientColorStop1",void 0),cd([r({type:String})],dd.prototype,"gradientColorStop2",void 0),cd([r({type:String})],dd.prototype,"prevGradientColorStop1",void 0),cd([r({type:String})],dd.prototype,"prevGradientColorStop2",void 0),cd([r({type:String})],dd.prototype,"borderColor",void 0),cd([r({type:String})],dd.prototype,"pointBackgroundColor",void 0),cd([r({type:String})],dd.prototype,"pointHoverBackgroundColor",void 0),cd([r({type:String})],dd.prototype,"prevPointHoverBackgroundColor",void 0),cd([r({type:String})],dd.prototype,"prevBorderColor",void 0),cd([r({type:Number})],dd.prototype,"chartHeigh",void 0),cd([r({type:Number})],dd.prototype,"chartWidth",void 0),cd([r({type:String})],dd.prototype,"metrics",void 0),cd([r({type:String})],dd.prototype,"method",void 0);var pd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let hd=class extends dd{static get styles(){return[...super.styles,e`
        .topContainer {
          margin-top: 24px;
        }
      `]}get filterInStatsFormat(){let t="",e=[];return Object.keys(this.query.filters).map((r=>{this.query.filters[r]&&("page"==this.query.filters[r]?t+=`${r}==${this.query.filters[r]};`:"goal"==r?e.push(this.query.filters[r]):t+=`visit:${r}==${this.query.filters[r]};`)})),t&&(t=`;${t}`,t=t.slice(0,-1)),e.length>0?`|${e.join("|")}`+t:t}async fetchGraphData(){return new Promise(((t,e)=>{if("realtime"!=this.query.period){let r=structuredClone(this.query);r=this.transformCustomDateForStatsQuery(r),U(this.proxyUrl,`/api/v1/stats/${this.method}`,r,{metrics:this.metrics,statsBegin:this.site.statsBegin,site_id:encodeURIComponent(this.site.domain),filters:`event:name==${this.events.join("|")}${this.filterInStatsFormat}`}).then((e=>{this.setGraphData(e),t(e)})).catch((t=>e(t)))}else t([])}))}setGraphData(t){const e={labels:[],plot:[],interval:"day"==this.query.period?"hour":"date"};for(let r=0;t.results.length>r;r++)e.labels.push(t.results[r].date),e.plot.push(t.results[r][this.metrics]);this.graphData=e}regenerateChart(){let t=this.$$("canvas");t||(t=this.canvasElement),this.ctx=t.getContext("2d");const e=this.buildDataSet(this.graphData.plot,this.graphData.present_index,this.ctx),r=this.graphData;return new y(this.ctx,{type:"line",data:{labels:this.graphData.labels,datasets:e},options:{animation:!1,plugins:{legend:{display:!1},tooltip:{enabled:!1,mode:"index",intersect:!1,position:"average",external:this.graphTooltip(this.graphData,t,this.$$("#chartjs-tooltip"))}},responsive:!0,onResize:this.updateWindowDimensions,elements:{line:{tension:0},point:{radius:0}},onClick:this.onClick.bind(this),scales:{y:{beginAtZero:!0,ticks:{callback:x,maxTicksLimit:8,color:this.darkTheme?"rgb(243, 244, 246)":void 0},grid:{zeroLineColor:"transparent",drawBorder:!1}},x:{grid:{display:!1},ticks:{maxTicksLimit:8,callback:function(t,e,i){return nt(r.interval)(this.getLabelForValue(t))},color:this.darkTheme?"rgb(243, 244, 246)":void 0}}},interaction:{mode:"index",intersect:!1}}})}renderHeader(){return o` <h1>${this.t(this.chartTitle)}</h1>`}};pd([r({type:Array})],hd.prototype,"events",void 0),hd=pd([n("pl-goal-graph")],hd);const ud=["newPost - completed","newPost - started","pointHelpful - completed","endorse_down - completed","endorse_up - completed","Login and Signup - Signup Fail","Login and Signup - Signup/Login Opened","newPointFor - completed","newPointAgainst - completed","Login and Signup - Login Success","Login and Signup - Signup Success","pages - open","pointNotHelpful - completed","startTranslation - click","video - completed","audio - completed","videoUpload - complete","audioUpload - complete","imageUpload - complete","mediaUpload - error","twitter - pointShareOpen","point.report - open","email - pointShareOpen","post.report - open","whatsapp - pointShareOpen","twitter - postShareCardOpen","facebook - postShareCardOpen","email - postShareCardOpen","whatsapp - postShareCardOpen","filter - click","search - click","marker - clicked","newUserImage","filter - change","newPost - open","post.ratings - completed","post.ratings.dialog - open","recommendations - goForward","recommendations - goBack","setEmail - cancel","setEmail - logout","forgotPasswordFromSetEmail - open","linkAccountsAjax - confirm","setEmail - confirm","registrationAnswers - submit","evaluated - point toxicity low","evaluated - point toxicity medium","evaluated - point toxicity high","evaluated - post toxicity low","evaluated - post toxicity medium","evaluated - post toxicity high","open - share dialog options","open - share dialog - brand:whatsapp","open - share dialog - brand:facebook","open - share dialog - brand:twitter","open - share dialog - clipboard"];var gd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let md=class extends Uc{static get styles(){return[...super.styles,e``]}constructor(){super(),this.highlightedGoals=ud}render(){const t=this.site.embedded?"relative":"sticky";return o`
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${t} top-0 sm:py-3 py-2 z-10 ${this.stuck&&!this.site.embedded?"fullwidth-shadow bg-gray-50 dark:bg-gray-850":""}`}
        >
          <div class="items-center w-full flex">
            <div class="flex w-full"></div>
            <div class="flex">
              <pl-filters
                class="flex"
                .site=${this.site}
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-date-picker
              .site="${this.site}"
              .query="${this.query}"
              .history="${this.history}"
            ></pl-date-picker>
          </div>
        </div>
        ${this.wide?a:o`
              <md-icon-button
                icon="close"
                @click="${()=>this.fire("exit-to-app")}"
              ></md-icon-button>
            `}

        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .timer="${this.timer}"
          useTopStatsForCurrentVisitors
          .proxyUrl="${this.proxyUrl}"
        ></pl-visitors-graph>
        <yp-campaigns-analytics
          .site="${this.site}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .timer="${this.timer}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"
        ></yp-campaigns-analytics>
        <pl-goal-graph
          .events="${["newPost - completed","newPointAgainst - completed","newPointFor - completed"]}"
          .chartTitle="${this.t("Users who added content")}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .timer="${this.timer}"
          .site="${this.site}"
          gradientColorStop1="rgba(205,116,101, 0.2)"
          gradientColorStop2="rgba(205,116,101, 0.2)"
          prevGradientColorStop1="rgba(205,116,101, 0.075)"
          prevGradientColorStop2="rgba(205,116,101, 0)"
          borderColor="rgba(205,116,101)"
          pointBackgroundColor="rgba(205,116,101)"
          pointHoverBackgroundColor="rgba(193, 87, 71)"
          prevPointHoverBackgroundColor="rgba(166,187,210,0.8)"
          prevBorderColor="rgba(210,187,166,0.5)"
          .chartHeigh="${this.wide?200:300}"
        >
        </pl-goal-graph>
        <pl-goal-graph
          .events="${["endorse_up - completed","endorse_down - completed","pointHelpful - completed","pointNotHelpful - completed","post.ratings - add"]}"
          .chartTitle="${this.t("Users who rated content")}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .timer="${this.timer}"
          .site="${this.site}"
          .chartHeigh="${this.wide?200:300}"
        >
        </pl-goal-graph>
        <div
          class="items-start justify-between block w-full md:flex flex flex-wrap"
        >
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            ?hidden="${"post"==this.collectionType&&!this.wide}"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div
          class="items-start justify-between block w-full md:flex flex flex-wrap"
        >
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `}};gd([r({type:Object})],md.prototype,"collection",void 0),gd([r({type:String})],md.prototype,"collectionType",void 0),gd([r({type:Number})],md.prototype,"collectionId",void 0),md=gd([n("yp-realtime")],md);class fd extends d{createCampaign(t,e,r){return this.fetchWrapper(this.baseUrlPath+`/${fd.transformCollectionTypeToApi(t)}/${e}/create_campaign`,{method:"POST",body:JSON.stringify(r)},!1)}updateCampaign(t,e,r,i){return this.fetchWrapper(this.baseUrlPath+`/${fd.transformCollectionTypeToApi(t)}/${e}/${r}/update_campaign`,{method:"PUT",body:JSON.stringify(i)},!1)}deleteCampaign(t,e,r){return this.fetchWrapper(this.baseUrlPath+`/${fd.transformCollectionTypeToApi(t)}/${e}/${r}/delete_campaign`,{method:"DELETE",body:JSON.stringify({})},!1)}getCampaigns(t,e){return this.fetchWrapper(this.baseUrlPath+`/${fd.transformCollectionTypeToApi(t)}/${e}/get_campaigns`)}}var yd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let vd=class extends p{constructor(){super(...arguments),this.confirmedActive=!1,this.haveCopied=!1}async deleteCampaign(){this.fire("deleteCampaign",this.campaign.id)}static get styles(){return[super.styles,e`
        md-dialog {
          --mdc-shape-medium: 24px !important;
          --mdc-theme-surface: var(--md-sys-color-surface);
          --mdc-dialog-heading-ink-color: var(--md-sys-color-on-surface);
          --mdc-dialog-box-shadow: none;
        }

        .campaignName {
          font-weight: bold;
          margin-bottom: 16px;
          font-size: 20px;
        }

        .mainContainer {
          width: 960px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          padding: 24px;
          border-radius: 16px;
          margin-top: 16px;
          overflow-y: scroll;
          position: relative;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
          }
        }

        .mediumCard {
          width: 100px;
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          margin-right: 8px;
          margin-left: 8px;
          padding: 16px;
          border-radius: 16px;
        }

        .mediumInnerCard {
          width: 100px;
        }

        .disabledCard {
          background-color: var(--md-sys-color-surface-variant) !important;
          color: var(--md-sys-color-on-surface-variant) !important;
        }

        .mediumsContainer {
          height: 200px;
          width: 100%;
        }

        .mediumImage {
          width: 80px;
          height: 80px;
          margin-top: 24px;
          margin-bottom: 24px;
        }

        md-icon-button {
          position: absolute;
          top: 2px;
          right: 2px;
        }

        .mediumActivationImage {
          width: 40px;
          height: 40px;
        }

        .activationInfo {
          font-weight: bold;
          margin-bottom: 24px;
          margin-top: 24px;
        }

        .url {
          font-style: italic;
        }

        .textWithLink {
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          overflow-wrap: break-word;
        }

        .copyButton {
          margin-bottom: 32px;
        }

        .mediumShowImage {
          margin-bottom: 24px;
        }
      `]}get configuration(){return this.campaign.configuration}getMediumImageUrl(t){switch(t){case"facebook":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/facebook.png";case"adwords":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/adwords.png";case"snapchat":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/snapchat.png";case"instagram":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/instagram.png";case"twitter":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/twitter.png";case"youtube":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/youtube.png";case"linkedin":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/linkedin.png";case"email":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/email.png";case"tiktok":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/tiktok.png";case"whatsapp":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/whatsapp.png";default:return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/other.png"}}async activate(t){this.mediumToActivate=t,this.confirmedActive=!1,this.haveCopied=!1,await this.updateComplete,this.$$("#activateDialog").show()}async showMedium(t){this.mediumToShow=t,await this.updateComplete,this.$$("#showMediumDialog").show()}cancelActivation(){this.mediumToActivate=void 0}reallyActivate(){this.mediumToActivate?(this.mediumToActivate.active=!0,this.fire("configurationUpdated",{campaignId:this.campaign.id,configuration:this.configuration}),this.mediumToActivate=void 0):console.error("No medium to activate")}activeCheckboxChanged(t){this.confirmedActive=t.currentTarget.checked}copyCurrentTextWithLink(t){const e=`${this.configuration.promotionText} ${t.finaUrl}`;navigator.clipboard.writeText(e),this.haveCopied=!0;let r=this.t(t.utm_medium);this.fire("display-snackbar",this.t("promotionWithLinksCopiedToClipboard")+` ${r}`)}copyCurrentText(t){navigator.clipboard.writeText(this.configuration.promotionText),this.haveCopied=!0;let e=this.t(t.utm_medium);this.fire("display-snackbar",this.t("promotionTextCopiedToClipboard")+` ${e}`)}copyCurrentLink(t){navigator.clipboard.writeText(t.finaUrl),this.haveCopied=!0;let e=this.t(t.utm_medium);this.fire("display-snackbar",this.t("promotionLinkCopiedToClipboard")+` ${e}`)}closeShowMedium(){this.mediumToShow=void 0}renderTextWithLink(t){const e=this.t(t.utm_medium);return["facebook","twitter","linkedin"].includes(t.utm_medium)?o`
        <div class="textWithLink layout vertical">
          <div>
            ${this.configuration.promotionText}
            <span class="url">${t.finaUrl}</span>
          </div>
        </div>
        <div class="layout vertical center-center">
          <md-filled-button
            class="copyButton"
            @click="${()=>this.copyCurrentTextWithLink(t)}"
            .label="${this.t("copyTextAndLinkTo")+` ${e.toUpperCase()}`}"
          ></md-filled-button>
          <md-filled-button
            class="copyButton"
            @click="${()=>this.copyCurrentLink(t)}"
            .label="${this.t("copyLinkTo")+` ${e.toUpperCase()}`}"
          ></md-filled-button>
        </div>
      `:o`
        <div class="textWithLink layout vertical">
          <div>${this.configuration.promotionText}</div>
        </div>
        <div class="layout horizontal center-center">
          <md-filled-button
            class="copyButton"
            @click="${()=>this.copyCurrentText(t)}"
            .label="${this.t("copyTextTo")+` ${e.toUpperCase()}`}"
          ></md-filled-button>
        </div>
        <div class="textWithLink layout vertical">
          <div>
            <span class="url">${t.finaUrl}</span>
          </div>
        </div>
        <div class="layout horizontal center-center">
          <md-filled-button
            class="copyButton"
            @click="${()=>this.copyCurrentLink(t)}"
            .label="${this.t("copyLinkTo")+` ${e.toUpperCase()}`}"
          ></md-filled-button>
        </div>
      `}renderActivateDialog(){let t=this.t(this.mediumToActivate.utm_medium);return o`
      <md-dialog
        id="activateDialog"
        scrimClickAction=""
        escapeKeyAction=""
        modal
      >
        <div slot="heading">${this.t("activateMedium")}</div>
        <div class="layout vertical" slot="content">
          <div class="layout horizontal center-center">
            <yp-image
              sizing="cover"
              class="mediumActivationImage"
              .src="${this.getMediumImageUrl(this.mediumToActivate.utm_medium)}"
            >
            </yp-image>
          </div>
          <div class="activationInfo">
            ${this.t("activationInformation_1")} ${t}.
            ${this.t("activationInformation_2")}
          </div>
          ${this.renderTextWithLink(this.mediumToActivate)}
          <label
            >${this.t("confirmYouHavePastedTheTextAndLink")+` ${t}`}
            <md-checkbox
              ?disabled="${!this.haveCopied}"
              name="activeConfirmed"
              @change="${this.activeCheckboxChanged}"
            ></md-checkbox>
          </label>
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          @click="${this.cancelActivation}"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          ?disabled="${!this.confirmedActive}"
          class="button okButton"
          .label="${this.t("activate")}"
          @click="${this.reallyActivate}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
    `}renderShowDialog(){return o`
      <md-dialog id="showMediumDialog">
        <div slot="heading">${this.t("textAndLinkDetails")}</div>
        <div class="layout vertical" slot="content">
          <div class="layout horizontal center-center">
            <yp-image
              sizing="cover"
              class="mediumActivationImage mediumShowImage"
              .src="${this.getMediumImageUrl(this.mediumToShow.utm_medium)}"
            >
            </yp-image>
          </div>
          ${this.renderTextWithLink(this.mediumToShow)}
        </div>
        <md-text-button
          .label="${this.t("close")}"
          class="button"
          @click="${this.closeShowMedium}"
          slot="actions"
        >
        </md-text-button>
      </md-dialog>
    `}renderMedium(t){return o`
      <div class="mediumCard ${t.active?"":"disabledCard"}">
        <div
          class="layout vertical center-center mediumInnerCard ${t.active?"":"disabledCard"}"
        >
          <div>${this.t(t.utm_medium)}</div>
          <yp-image
            class="mediumImage"
            sizing="contain"
            .src="${this.getMediumImageUrl(t.utm_medium)}"
          >
          </yp-image>

          ${t.active?o`
                <md-text-button
                  class="mediumButtons"
                  .label="${this.t("show")}"
                  @click="${()=>this.showMedium(t)}"
                ></md-text-button>
              `:o`
                <md-elevated-button
                  .label="${this.t("activate")}"
                  class="mediumButtons"
                  @click="${()=>this.activate(t)}"
                ></md-elevated-button>
              `}
        </div>
      </div>
    `}render(){return o`
      <div class="layout vertical mainContainer">
        <md-icon-button @click="${this.deleteCampaign}"
          ><md-icon>delete</md-icon></md-icon-button
        >
        <div class="layout horizontal">
          <div class="campaignName">
            ${this.campaign.configuration.utm_campaign}
          </div>
        </div>
        <div class="layout horizontal mediumsContainer">
          ${this.campaign.configuration.mediums.map((t=>this.renderMedium(t)))}
        </div>
      </div>
      ${this.mediumToActivate?this.renderActivateDialog():a}
      ${this.mediumToShow?this.renderShowDialog():a}
    `}};yd([r({type:String})],vd.prototype,"collectionType",void 0),yd([r({type:Number})],vd.prototype,"collectionId",void 0),yd([r({type:Object})],vd.prototype,"collection",void 0),yd([r({type:Object})],vd.prototype,"campaign",void 0),yd([r({type:Object})],vd.prototype,"campaignApi",void 0),yd([r({type:Object})],vd.prototype,"mediumToActivate",void 0),yd([r({type:Object})],vd.prototype,"mediumToShow",void 0),yd([r({type:Boolean})],vd.prototype,"confirmedActive",void 0),yd([r({type:Boolean})],vd.prototype,"haveCopied",void 0),vd=yd([n("yp-campaign")],vd);var bd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let wd=class extends vd{static get styles(){return[super.styles,e`
        .mediumImage {
          width: 42px;
          height: 42px;
          margin-top: 12px;
          margin-bottom: 16px;
        }

        .mainContainer {
          width: 1050px;
          height: 200px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        .mediumTopStats {
          font-size: 14px;
          text-align: left;
          width: 150px;
        }

        .mediumCard {
          width: 150px;
        }

        .mediumInnerCard {
          width: 150px;
        }

        .statValue {
          text-align: right;
          margin-bottom: 2px;
          color: var(--md-sys-color-on-secondary-container);
        }

        .statLabel {
          text-align: left;
          margin-bottom: 2px;
          color: var(--md-sys-color-on-secondary-container);
        }

        .mediumsContainer {
          height: 220px;
        }
      `]}renderMediumTopStats(t){return o`
      <div class="layout vertical mediumTopStats">
        ${t.topStats.map((t=>o`
            <div class="layout horizontal">
              <div class="column self-start">
                <div class="statLabel">${this.t(t.name)}</div>
              </div>
              <div class="flex"></div>
              <div class="column self-end">
                <div class="statValue">${t.value}${"Bounce rate"===t.name?"%":""}</div>
              </div>
            </div>
          `))}
      </div>
    `}renderMedium(t){return o`
      <div class="mediumCard ${t.active?"":"disabledCard"}">
        <div class="layout vertical center-center mediumInnerCard">
          <div>${this.t(t.utm_medium)}</div>
          <yp-image
            class="mediumImage"
            sizing="contain"
            .src="${this.getMediumImageUrl(t.utm_medium)}"
          >
          </yp-image>

          ${this.renderMediumTopStats(t)}
        </div>
      </div>
    `}get orderedMedium(){return this.campaign.configuration.mediums.sort(((t,e)=>e.topStats[0].value-t.topStats[0].value))}render(){return o`
      <div class="layout vertical mainContainer">
        <div class="layout horizontal">
          <div class="campaignName">
            ${this.campaign.configuration.utm_campaign}
          </div>
        </div>
        <div class="layout horizontal mediumsContainer">
          ${this.orderedMedium.map((t=>this.renderMedium(t)))}
        </div>
      </div>
    `}};wd=bd([n("yp-campaign-analysis")],wd);var xd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let kd=class extends dt{constructor(){super(...arguments),this.noData=!1,this.campaignApi=new fd}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.getCampaigns.bind(this))}static get styles(){return[e`
        .mainContainer {
          width: 1000px;
          margin-top: 32px;
          min-height: 310px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        .textInfo {
          margin-top: 32px;
          text-align: center;
          padding: 16px;
        }

        .smallContainer {
          min-height: 60px;
          height: 60px;
        }
      `]}updated(t){super.updated(t),t.has("query")&&(this.foundCampaigns=void 0,this.getCampaigns())}async getCampaigns(){this.campaigns=await this.campaignApi.getCampaigns(this.collectionType,this.collectionId);const t=await U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/utm_contents`,this.query);if(t&&t.length>0){const e=t.map((t=>isNaN(t.name)?t.name||"":parseInt(t.name)));if(e.length>0){const t=await U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/utm_mediums`,this.query);if(t&&t.length>0){const r=this.campaigns?.filter((t=>e.includes(t.id)));if(r&&r.length>0)for(let e=0;e<r.length;e++)r[e]=await this.getSourceData(r[e],t);this.foundCampaigns=r}}}this.foundCampaigns||(this.foundCampaigns=[])}async getSourceData(t,e){const r=Kc(this.query),i=e.map((t=>t.name.toLowerCase())),n=t.configuration.mediums.filter((t=>i.includes(t.utm_medium)));r.filters.utm_content=`${t.id}`;for(let t=0;t<n.length;t++){const e=n[t];r.filters.utm_medium=e.utm_medium;const i=await U(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`,r);e.topStats=[i.top_stats[0],i.top_stats[1]]}return t.configuration.mediums=n,t}renderCampaign(t){return o`<yp-campaign-analysis
      .campaignApi="${this.campaignApi}"
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .campaign="${t}"
    ></yp-campaign-analysis>`}render(){return this.foundCampaigns&&this.foundCampaigns.length>0?o`
        <div class="layout vertical start mainContainer">
          <div class="layout vertical">
            ${this.foundCampaigns?.map((t=>this.renderCampaign(t)))}
          </div>
        </div>
      `:this.foundCampaigns?o`
        <div
          class="layout horizontal center-center mainContainer smallContainer"
        >
          <div class="textInfo">${this.t("No campaigns found")}</div>
        </div>
      `:o` <div class="layout horizontal center-center mainContainer">
        <div class="layout horizontal center-center">
          <div class="textInfo">${this.t("Loading...")}</div>
        </div>
      </div>`}};xd([r({type:String})],kd.prototype,"collectionType",void 0),xd([r({type:Number})],kd.prototype,"collectionId",void 0),xd([r({type:Object})],kd.prototype,"collection",void 0),xd([r({type:Array})],kd.prototype,"campaigns",void 0),xd([r({type:Array})],kd.prototype,"foundCampaigns",void 0),xd([r({type:Boolean})],kd.prototype,"noData",void 0),kd=xd([n("yp-campaigns-analytics")],kd);var $d=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Cd=class extends Qc{static get styles(){return[...super.styles,e``]}constructor(){super(),this.highlightedGoals=ud}render(){const t=this.site.embedded?"relative":"sticky";return o`
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${t} top-0 sm:py-3 py-2 z-10 ${this.stuck&&!this.site.embedded?"fullwidth-shadow bg-gray-50 dark:bg-gray-850":""}`}
        >
          <div class="items-center w-full flex">
            <div class="flex items-center w-full">
              ${this.wide?a:o`
                    <md-icon-button
                      icon="close"
                      @click="${()=>this.fire("exit-to-app")}"
                    ></md-icon-button>
                  `}
              <pl-current-visitors
                .timer=${this.timer}
                .site=${this.site}
                .query=${this.query}
                useTopStatsForCurrentVisitors
                class="w-full"
                .proxyUrl="${this.proxyUrl}"
              ></pl-current-visitors>
              <div class="flex w-full"></div>
              <pl-filters
                class="flex"
                .site=${this.site}
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-date-picker
              .site="${this.site}"
              .query="${this.query}"
              .history="${this.history}"
            ></pl-date-picker>
          </div>
        </div>
        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          useTopStatsForCurrentVisitors
        ></pl-visitors-graph>
        <yp-campaigns-analytics
          .site="${this.site}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"
        ></yp-campaigns-analytics>
        <pl-goal-graph
          .events="${["newPost - completed","newPointAgainst - completed","newPointFor - completed"]}"
          .chartTitle="${this.t("Users who added content")}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .site="${this.site}"
          gradientColorStop1="rgba(205,116,101, 0.2)"
          gradientColorStop2="rgba(205,116,101, 0.2)"
          prevGradientColorStop1="rgba(205,116,101, 0.075)"
          prevGradientColorStop2="rgba(205,116,101, 0)"
          borderColor="rgba(205,116,101)"
          pointBackgroundColor="rgba(205,116,101)"
          pointHoverBackgroundColor="rgba(193, 87, 71)"
          prevPointHoverBackgroundColor="rgba(166,187,210,0.8)"
          prevBorderColor="rgba(210,187,166,0.5)"
          .chartHeigh="${this.wide?200:300}"
        >
        </pl-goal-graph>
        <pl-goal-graph
          .events="${["endorse_up - completed","endorse_down - completed","pointHelpful - completed","pointNotHelpful - completed","post.ratings - add"]}"
          .chartTitle="${this.t("Users who rated content")}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .site="${this.site}"
          .chartHeigh="${this.wide?200:300}"
        >
        </pl-goal-graph>

        <div
          class="items-start justify-between block w-full md:flex flex flex-wrap"
        >
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            alwaysShowNoRef
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            ?hidden="${"post"==this.collectionType&&!this.wide}"
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div
          class="items-start justify-between block w-full md:flex flex flex-wrap"
        >
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `}};$d([r({type:Object})],Cd.prototype,"collection",void 0),$d([r({type:String})],Cd.prototype,"collectionType",void 0),$d([r({type:Number})],Cd.prototype,"collectionId",void 0),Cd=$d([n("yp-historical")],Cd);var _d=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Dd=class extends ld{connectedCallback(){try{fetch("/api/users/has/PlausibleSiteName",{headers:{"Content-Type":"application/json"}}).then((t=>t.json())).then((t=>{this.plausibleSiteName=t.plausibleSiteName,this.site={domain:this.plausibleSiteName,hasGoals:!0,embedded:!1,offset:1,statsBegin:this.collection.created_at,isDbip:!1,flags:{custom_dimension_filter:!1}},super.connectedCallback()}))}catch(t){console.error(t)}}static get styles(){return[e`
      :host {
        max-width: 1280px;
        width: 1280px;
      }
    `]}render(){return this.site&&this.query?"realtime"===this.query.period?o`
          <yp-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"
            .history="${this.history}"
            .proxyUrl="${`/api/${h.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useCommunityId?`?communityId=${this.useCommunityId}`:""}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-realtime>
        `:o`
          <yp-historical
            .timer="${this.timer}"
            .site="${this.site}"
            .history="${this.history}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"
            .proxyUrl="${`/api/${h.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useCommunityId?`?communityId=${this.useCommunityId}`:""}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-historical>
        `:a}};_d([r({type:String})],Dd.prototype,"plausibleSiteName",void 0),_d([r({type:Object})],Dd.prototype,"collection",void 0),_d([r({type:String})],Dd.prototype,"collectionType",void 0),_d([r({type:Number})],Dd.prototype,"collectionId",void 0),_d([r({type:Number})],Dd.prototype,"useCommunityId",void 0),Dd=_d([n("yp-promotion-dashboard")],Dd);var Sd=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Md=class extends p{constructor(){super(...arguments),this.previewEnabled=!1}static get styles(){return[super.styles,e`
        div {
          flex-direction: column;
        }

        @media (max-width: 1100px) {
        }

        div,
        md-radio {
          display: flex;
        }

        .button {
        }

        .okButton {
          margin-right: 8px;
        }

        .collectionLogoImage {
          width: 350px;
          height: 197px;
        }

        @media (max-width: 1100px) {
          .collectionLogoImage {
            width: 100%;
          }
        }

        .headerText {
          color: var(--md-sys-color-on-surface);
          font-size: 18px;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        md-outlined-text-field {
          width: 350px;
        }

        md-outliend-textarea {
          width: 350px;
          --mdc-theme-primary: var(--md-sys-color-primary);
          --mdc-text-field-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-on-surface-variant
          );
        }

        @media (max-width: 1100px) {
          md-outlined-text-field {
            width: 290px;
          }
          md-outliend-textarea {
            width: 290px;
          }
        }

        @media (max-width: 400px) {
          md-outlined-text-field {
            width: 270px;
          }
          md-outliend-textarea {
            width: 270px;
          }
        }

        md-outliend-textarea.rounded {
          --mdc-shape-small: 4px;
        }

        .formField {
          margin-top: 16px;
        }

        label {
          width: 130px;
        }

        .otherTextField {
          width: 79px;
        }

        .adMediumsList {
          margin-top: 3px;
        }

        .preview {
          background-color: var(--md-sys-color-container);
          color: var(--md-sys-color-on-container);
          padding-top: 8px;
          padding-bottom: 8px;
          width: 350px;
        }

        .linkContentPanel {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          padding: 0;
        }

        .linkDescription {
          padding: 8px;
        }

        .previewPromotionText {
          margin-bottom: 8px;
        }

        @media (max-width: 1100px) {
          .preview {
            width: 100%;
            margin-left: -16px;
            margin-right: -16px;
          }

          .previewPromotionText {
            padding: 16px;
          }
        }

        .linkTitle {
          font-weight: bold;
          margin-bottom: 8px;
          margin-top: 6px;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 8px;
        }

        .linkImage {
        }

        yp-file-upload-icon {
          top: 16px;
          right: 16px;
          margin-bottom: -56px;
          margin-left: 8px;
          z-index: 8;
        }
      `]}open(){this.$$("#newCampaignDialog").show()}getMediums(){let t=[];return this.shadowRoot.querySelectorAll("md-checkbox").forEach((e=>{e.checked&&t.push(e.name)})),t}async inputsChanged(){const t=this.$$("md-tonal-button"),e=this.$$("#campaignDescription"),r=this.$$("#campaignName");setTimeout((()=>{this.campaignName=r.value,this.promotionText=e.value;this.getMediums().length>0&&r.value.length>0&&e.value.length>0?(this.previewEnabled=!0,t.disabled=!1):(this.previewEnabled=!1,t.disabled=!0)}),50)}save(){this.fire("save",{targetAudience:this.targetAudience,promotionText:this.promotionText,name:this.campaignName,shareImageUrl:this.uploadedImageUrl,mediums:this.getMediums()}),this.close()}discard(){this.close()}close(){this.$$("#newCampaignDialog").close()}cancel(){if(this.previewEnabled){this.$$("#confirmationDialog").show()}else this.discard()}renderAdMediums(){return o`
      <div class="layout vertical adMediumsList" @click="${this.inputsChanged}">
        <label>
          ${this.t("facebook")}
          <md-checkbox name="facebook"></md-checkbox>
        </label>
        <label
          >${this.t("twitter")}
          <md-checkbox name="twitter"></md-checkbox>
        </label>
        <label
          >${this.t("adwords")}
          <md-checkbox name="adwords"></md-checkbox>
        </label>
        <label
          >${this.t("linkedin")}
          <md-checkbox name="linkedin"></md-checkbox>
        </label>
        <label
          >${this.t("snapchat")}
          <md-checkbox name="snapchat"></md-checkbox>
        </label>
        <label
          >${this.t("instagram")}
          <md-checkbox name="instagram"></md-checkbox>
        </label>
        <label
          >${this.t("youtube")}
          <md-checkbox name="youtube"></md-checkbox>
        </label>
        <label
          >${this.t("tiktok")}
          <md-checkbox name="tiktok"></md-checkbox>
        </label>
        <label
          >${this.t("whatsapp")}
          <md-checkbox name="whatsapp"></md-checkbox>
        </label>
        <label
          >${this.t("email")}
          <md-checkbox name="email"></md-checkbox>
        </label>
        <label class="otherFormField"
          >${this.t("other")}
          <md-checkbox name="other"></md-checkbox>
        </label>
        <md-outlined-text-field
          class="formField otherTextField"
          hidden
          .label="${this.t("other")}"
        ></md-outlined-text-field>
      </div>
    `}renderTextInputs(){return o`
      <div class="layout horizontal">
        <div class="layout vertical">
          <md-outlined-text-field
            class="formField"
            id="campaignName"
            @keydown="${this.inputsChanged}"
            .label="${this.t("promotionName")}"
          ></md-outlined-text-field>

          <md-outlined-text-field
            id="campaignDescription"
            rows="5"
            type="textarea"
            class="rounded formField"
            label="${this.t("promotionText")}"
            outlined
            charCounter
            maxLength="280"
            @keydown="${this.inputsChanged}"
          >
          </md-outlined-text-field>
        </div>
      </div>
    `}imageUploadCompleted(t){const e=JSON.parse(t.detail.xhr.response),r=JSON.parse(e.formats);this.uploadedImageUrl=r[0]}get collectionImageUrl(){return this.uploadedImageUrl||u.logoImagePath(this.collectionType,this.collection)}renderPreview(){return o`
      <div class="layout vertical center-center">
        <div class="headerText">${this.t("promotionPreview")}</div>
        <div class="preview">
          <div class="previewPromotionText">${this.promotionText}</div>
          <div class="linkImage">
            <yp-file-upload-icon
              target="/api/images?itemType=group-logo"
              method="POST"
              @success="${this.imageUploadCompleted}"
            ></yp-file-upload-icon>
            <yp-image
              class="collectionLogoImage"
              sizing="cover"
              .src="${this.collectionImageUrl}"
            ></yp-image>
          </div>
          <div class="linkContentPanel">
            <div class="linkTitle">${this.collection.name}</div>
            <div class="linkDescription">
              ${g.truncate(this.collection.description||this.collection?.objectives,150)}
            </div>
          </div>
        </div>
      </div>
    `}renderConfirmationDialog(){return o`
      <md-dialog id="confirmationDialog" crimClickAction="" escapeKeyAction="">
        <div class="layout horizontal center-center">
          <div class="headerText" slot="headline">
            ${this.t("discardDraft")}
          </div>
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          dialogAction="cancel"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          class="button okButton"
          .label="${this.t("discard")}"
          @click="${this.discard}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
    `}render(){return o`
      <md-dialog
        id="newCampaignDialog"
        scrimClickAction=""
        escapeKeyAction=""
        modal
      >
        <div slot="heading">${this.t("newTrackingPromotion")}</div>
        <div
          class="layout ${this.wide?"horizontal":"vertical"}"
          slot="content"
        >
          <div class="layout vertical">
            ${this.renderTextInputs()}
            ${this.wide?a:this.renderAdMediums()}
            ${this.renderPreview()}
          </div>
          ${this.wide?this.renderAdMediums():a}
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          @click="${this.cancel}"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          disabled
          class="button okButton"
          .label="${this.t("save")}"
          @click="${this.save}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
      ${this.renderConfirmationDialog()}
    `}};Sd([r({type:String})],Md.prototype,"collectionType",void 0),Sd([r({type:Number})],Md.prototype,"collectionId",void 0),Sd([r({type:Object})],Md.prototype,"collection",void 0),Sd([r({type:Object})],Md.prototype,"campaign",void 0),Sd([r({type:Boolean})],Md.prototype,"previewEnabled",void 0),Sd([r({type:String})],Md.prototype,"uploadedImageUrl",void 0),Sd([r({type:String})],Md.prototype,"targetAudience",void 0),Sd([r({type:String})],Md.prototype,"campaignName",void 0),Sd([r({type:String})],Md.prototype,"promotionText",void 0),Md=Sd([n("yp-new-campaign")],Md);var Td=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};let Ed=class extends p{constructor(){super(...arguments),this.campaignApi=new fd}firstUpdated(){this.getCampaigns()}newCampaign(){this.newCampaignElement.open()}getTrackingUrl(t,e){const r=`${location.protocol+"//"+location.host}/${this.collectionType}/${this.collectionId}?utm_source=${t.configuration.utm_source}&utm_medium=${e}&utm_campaign=${t.configuration.utm_campaign}&utm_content=${t.id}`;return encodeURI(r)}async createCampaign(t){const e=t.detail,r={utm_campaign:e.name,utm_source:this.collection.name,audience:e.targetAudience,promotionText:e.promotionText,shareImageUrl:e.shareImageUrl,mediums:[]},i=await this.campaignApi.createCampaign(this.collectionType,this.collectionId,{configuration:r});i.configuration.utm_content=`${i.id}`;const n=[];for(let t=0;t<e.mediums.length;t++){const r=e.mediums[t];n.push({utm_medium:r,finaUrl:this.getTrackingUrl(i,r),active:!1})}i.configuration.mediums=n,await this.campaignApi.updateCampaign(this.collectionType,this.collectionId,i.id,{configuration:i.configuration}),this.getCampaigns()}async campaignConfigurationUpdated(t){await this.campaignApi.updateCampaign(this.collectionType,this.collectionId,t.detail.campaignId,{configuration:t.detail.configuration})}async getCampaigns(){this.campaignToDelete=void 0,this.campaigns=await this.campaignApi.getCampaigns(this.collectionType,this.collectionId)}async reallyDeleteCampaign(){try{await this.campaignApi.deleteCampaign(this.collectionType,this.collectionId,this.campaignToDelete)}catch(t){this.campaignToDelete=void 0,console.error(t)}this.getCampaigns()}deleteCampaign(t){this.campaignToDelete=t.detail,this.$$("#deleteConfirmationDialog").show()}cancelDeleteCampaign(){this.campaignToDelete=void 0}static get styles(){return[super.styles,e`
        .mainContainer {
          width: 100%;
          margin-top: 32px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        md-fab {
          margin-top: 32px;
          margin-bottom: 0;
        }

        .fabContainer {
          width: 1000px;
        }

        @media (max-width: 1100px) {
          .fabContainer {
            width: 100%;
          }
        }
      `]}renderDeleteConfirmationDialog(){return o`
      <md-dialog id="deleteConfirmationDialog" crimClickAction escapeKeyAction>
        <div class="layout horizontal center-center">
          <div class="headerText" slot="headline">${this.t("reallyDeletePromotion")}</div>
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          dialogAction="cancel"
          @click="${this.cancelDeleteCampaign}"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          class="button okButton"
          .label="${this.t("delete")}"
          @click="${this.reallyDeleteCampaign}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
    `}renderCampaign(t){return o`<yp-campaign
      @configurationUpdated="${this.campaignConfigurationUpdated}"
      .campaignApi="${this.campaignApi}"
      @deleteCampaign="${this.deleteCampaign}"
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .campaign="${t}"
    ></yp-campaign>`}render(){return o`
      <yp-new-campaign
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        @save="${this.createCampaign}"
      ></yp-new-campaign>
      <div class="layout horizontal center-center fabContainer">
        <md-fab
          .label="${this.t("newTrackingPromotion")}"
          @click="${this.newCampaign}"
        ><md-icon slot="icon">add</md-icon></md-fab>
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.campaigns?.map((t=>this.renderCampaign(t)))}
        </div>
      </div>
      ${this.renderDeleteConfirmationDialog()}
    `}};Td([r({type:String})],Ed.prototype,"collectionType",void 0),Td([r({type:Number})],Ed.prototype,"collectionId",void 0),Td([r({type:Object})],Ed.prototype,"collection",void 0),Td([r({type:Array})],Ed.prototype,"campaigns",void 0),Td([l("yp-new-campaign")],Ed.prototype,"newCampaignElement",void 0),Ed=Td([n("yp-campaign-manager")],Ed);var Ad=function(t,e,r,i){for(var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,r,a):n(e,r))||a);return o>3&&a&&Object.defineProperty(e,r,a),a};const Od=1,Id=2,Pd=3,jd=4,qd=5;let Nd=class extends p{static get styles(){return[super.styles,e`
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }
        .backContainer {
          margin-top: 16px;
          margin-left: 16px;
        }
        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .headerContainer {
          width: 100%;
          margin-bottom: 8px;
          vertical-align: middle;
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          margin-left: 16px;
          width: 100%;
        }

        .loadingText {
          margin-top: 48px;
        }

        .collectionName {
          color: var(--md-sys-color-on-surface);
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-secondary-container
          );
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .collectionLogoImage {
          width: 120px;
          height: 68px;
          margin-right: 16px;
          margin-left: 16px;
        }

        .mainPageContainer {
          margin-top: 16px;
          max-width: 1100px;
          width: 1100px;
        }

        yp-promotion-dashboard {
          max-width: 1100px;
        }

        @media (max-width: 1100px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
          }

          yp-promotion-dashboard {
            max-width: 100%;
          }
        }
      `]}constructor(){super(),this.collectionAction="config",this.pageIndex=1,this.adminConfirmed=!1,this.haveCheckedAdminRights=!1,this.haveCheckedPromoterRights=!1;let t=window.location.pathname;t.endsWith("/")&&(t=t.substring(0,t.length-1));const e=t.split("/");this.collectionType=e[e.length-2],this.originalCollectionType=this.collectionType,this.collectionId=e[e.length-1]}connectedCallback(){super.connectedCallback(),this._setupEventListeners(),window.appUser.recheckAdminRights()}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}async _getCollection(){const t=await window.serverApi.getCollection(this.collectionType,this.collectionId);"group"==this.collectionType?this.collection=t.group:"community"==this.collectionType?(t.configuration.useCommunityIdForAnalytics&&t.configuration.communityId?this.useCommunityId=t.configuration.communityId:this.useCommunityId=void 0,this.collection=t):this.collection=t,await this.updateComplete,this._setAdminConfirmed()}renderTopBar(){return o`
      <div class="layout vertical center-center">
        <div class="layout horizontal topAppBar">
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <img
                  class="collectionLogoImage"
                  src="${s(u.logoImagePath(this.collectionType,this.collection))}"
                />
              </div>
              <div></div>
              ${this.collection?this.collection.name:""}
            </div>
          </div>
        </div>
      </div>
    `}snackbarclosed(){this.lastSnackbarText=void 0}render(){return o`
      <md-dialog id="errorDialog">
        <div slot="heading">${this.t("error")}</div>
        <div>${this.currentError}</div>
        <md-text-button dialogAction="cancel" slot="secondaryAction">
          ${this.t("ok")}
        </md-text-button>
      </md-dialog>
      ${this.collection?o`
            <div class="layout horizontal">
              ${this.renderNavigationBar()}
              <div class="rightPanel">
                <main>
                  <div class="mainPageContainer">${this._renderPage()}</div>
                </main>
              </div>
            </div>
          `:o`
            <div class="layout horizontal center-center loadingText">
              <div>${this.t("Loading...")}</div>
            </div>
          `}
    `}renderNavigationBar(){return this.wide?o`
        <div class="layout vertical">
          <div class="layout horizontal backContainer">
            <md-icon-button @click="${this.exitToMainApp}">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <yp-image
                  class="collectionLogoImage"
                  sizing="contain"
                  .src="${u.logoImagePath(this.collectionType,this.collection)}"
                ></yp-image>
              </div>
              <div class="collectionName">
                ${this.collection?this.collection.name:""}
              </div>
            </div>
          </div>

          <md-list>
            <md-list-item
              class="${1==this.pageIndex&&"selectedContainer"}"
              @click="${()=>this.pageIndex=1}"
              type="button"
            >
              <div slot="headline">${this.t("Analytics")}</div>
              <div slot="supporting-text">
                ${this.t("Historical and realtime")}
              </div>
              <md-icon slot="start">
                <md-icon>insights</md-icon>
              </md-icon></md-list-item
            >
            <md-list-item
              class="${2==this.pageIndex&&"selectedContainer"}"
              @click="${()=>this.pageIndex=2}"
              type="button"
            >
              <div slot="headline">${this.t("Promotion")}</div>
              <div slot="supporting-text">
                ${"post"==this.collectionType?this.t("Promote your idea"):this.t("Promote your community")}
              </div>
              <md-icon slot="start"
                ><md-icon>ads_click</md-icon></md-icon
              ></md-list-item
            >
            <md-list-item
              class="${3==this.pageIndex&&"selectedContainer"}"
              @click="${()=>this.pageIndex=3}"
              ?hidden="${!0}"
              type="button"
            >
              <div slot="headline">${this.t("Email Lists")}</div>
              <div slot="supporting-text">
                ${this.t("Send promotional emails")}
              </div>
              <md-icon slot="start"
                ><md-icon
                  ><span class="material-symbols-outlined"
                    >schedule_send</span
                  ></md-icon
                ></md-icon
              ></md-list-item
            >
          </md-list>
        </div>
      `:o`
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t("Analytics")}"
              ><md-icon slot="activeIcon">insights</md-icon>
              <md-icon slot="inactiveIcon">insights</md-icon></md-navigation-tab
            >
            <md-navigation-tab .label="${this.t("Promotion")}">
              <md-icon slot="activeIcon">ads_click</md-icon>
              <md-icon slot="inactiveIcon">ads_click</md-icon>
            </md-navigation-tab>
            <md-navigation-tab .label="${this.t("Settings")}">
              <md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon">settings</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `}tabChanged(t){0==t.detail.activeIndex?this.pageIndex=1:1==t.detail.activeIndex?this.pageIndex=2:2==t.detail.activeIndex&&(this.pageIndex=5)}exitToMainApp(){window.location.href=`/${this.originalCollectionType}/${this.collectionId}`}_setupEventListeners(){this.addListener("exit-to-app",this.exitToMainApp),this.addGlobalListener("yp-got-admin-rights",this._gotAdminRights.bind(this)),this.addGlobalListener("yp-got-promoter-rights",this._gotPromoterRights.bind(this))}_removeEventListeners(){this.removeGlobalListener("yp-got-admin-rights",this._gotAdminRights.bind(this)),this.removeGlobalListener("yp-got-promoter-rights",this._gotPromoterRights.bind(this))}_gotAdminRights(t){this.haveCheckedAdminRights=!0}_gotPromoterRights(t){this.haveCheckedPromoterRights=!0}_setAdminConfirmed(){if(this.collection)switch(this.collectionType){case"domain":this.adminConfirmed=m.checkDomainAccess(this.collection);break;case"community":this.adminConfirmed=m.checkCommunityAccess(this.collection);break;case"group":this.adminConfirmed=m.checkGroupAccess(this.collection);break;case"post":this.adminConfirmed=m.checkPostAccess(this.collection)}if(!this.adminConfirmed)switch(this.collectionType){case"community":this.adminConfirmed=m.checkCommunityPromoterAccess(this.collection);break;case"group":this.adminConfirmed=m.checkGroupPromoterAccess(this.collection)}this.adminConfirmed||this.fire("yp-network-error",{message:this.t("unauthorized")})}updated(t){super.updated(t),(t.has("loggedInUser")||t.has("haveCheckedAdminRights")||t.has("haveCheckedPromoterRights"))&&this.loggedInUser&&!0===this.haveCheckedAdminRights&&1==this.haveCheckedPromoterRights&&this._getCollection()}_appError(t){let e=t.detail.message;t.detail&&t.detail.response&&(e=t.detail.response.statusText),console.error(e),this.currentError=e,this.$$("#errorDialog").open=!0}_renderPage(){if(console.error(`admin confirmed: ${this.adminConfirmed}`),!this.adminConfirmed)return a;switch(console.error(this.pageIndex),this.pageIndex){case Od:switch(this.collectionType){case"domain":case"community":case"group":case"post":return o`
                ${f(this.collection?o`<yp-promotion-dashboard
                        .collectionType="${this.collectionType}"
                        .collection="${this.collection}"
                        .collectionId="${this.collectionId}"
                        .useCommunityId="${this.useCommunityId}"
                      >
                      </yp-promotion-dashboard>`:a)}
              `;default:return o`<p>
                Page not found try going to <a href="#main">Main</a>
              </p>`}case Id:return o`
            ${f(this.collection?o`<yp-campaign-manager
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-campaign-manager>`:a)}
          `;case jd:return o`
            ${f(this.collection?o`<yp-ai-text-analysis
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-ai-text-analysis>`:a)}
          `;case Pd:return o`
            ${f(this.collection?o`<yp-email-lists
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-email-lists>`:a)}
          `;case qd:return o`
            ${f(this.collection?o`<yp-promotion-settings
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                    @color-changed="${this._settingsColorChanged}"
                  >
                  </yp-promotion-settings>`:a)}
          `;default:return o`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `}}_settingsColorChanged(t){this.fireGlobal("yp-theme-color",t.detail.value)}};Ad([r({type:String})],Nd.prototype,"collectionType",void 0),Ad([r({type:Number})],Nd.prototype,"collectionId",void 0),Ad([r({type:String})],Nd.prototype,"collectionAction",void 0),Ad([r({type:String})],Nd.prototype,"page",void 0),Ad([r({type:Number})],Nd.prototype,"pageIndex",void 0),Ad([r({type:Object})],Nd.prototype,"collection",void 0),Ad([r({type:String})],Nd.prototype,"currentError",void 0),Ad([r({type:Boolean})],Nd.prototype,"adminConfirmed",void 0),Ad([r({type:Boolean})],Nd.prototype,"haveCheckedAdminRights",void 0),Ad([r({type:Boolean})],Nd.prototype,"haveCheckedPromoterRights",void 0),Ad([r({type:Boolean,reflect:!0})],Nd.prototype,"active",void 0),Ad([r({type:String})],Nd.prototype,"lastSnackbarText",void 0),Ad([r({type:String})],Nd.prototype,"useCommunityId",void 0),Nd=Ad([n("yp-promotion-app")],Nd);export{Nd as YpPromotionApp};
