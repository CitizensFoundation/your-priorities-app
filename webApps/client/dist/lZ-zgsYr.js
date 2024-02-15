import{a1 as t,i as e,n as i,s as r,t as n,x as o,T as a,k as s,f as l,a2 as c,a3 as d,d as h,a4 as u,a5 as p,j as f,X as g,a0 as m,a6 as v}from"./vvdsc7sg.js";import{C as b,r as y}from"./da63nve-.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const w=1e6,x=1e9;function k(t){if(t>=1e3&&t<w){const e=t/1e3;return e===Math.floor(e)||t>=1e5?Math.floor(e)+"k":Math.floor(10*e)/10+"k"}if(t>=w&&t<x){const e=t/w;return e===Math.floor(e)||t>=1e8?Math.floor(e)+"M":Math.floor(10*e)/10+"M"}if(t>=x&&t<1e12){const e=t/x;return e===Math.floor(e)||t>=1e11?Math.floor(e)+"B":Math.floor(10*e)/10+"B"}return t}function $(t){const e=Math.floor(t/60/60),i=Math.floor(t/60)%60,r=Math.floor(t-60*i-60*e*60);return e>0?`${e}h ${i}m ${r}s`:i>0?`${i}m ${n=r,o=2,("000"+n).slice(-1*o)}s`:`${r}s`;var n,o}function C(t){return new Date(t.getTime()-6e4*t.getTimezoneOffset()).toISOString().split("T")[0]}function M(t,e){const i=new Date(t.getTime()),r=i.getDate();return i.setMonth(i.getMonth()+e),i.getDate()!==r&&i.setDate(0),i}function S(t,e){const i=new Date(t.getTime());return i.setDate(i.getDate()+e),i}const j=["January","February","March","April","May","June","July","August","September","October","November","December"],D=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function O(t){return`${j[t.getMonth()]} ${t.getFullYear()}`}function z(t){const e=D[t.getDay()];return t.getFullYear()!==(new Date).getFullYear()?`${e}, ${t.getDate()} ${U(t)} ${t.getFullYear()}`:`${e}, ${t.getDate()} ${U(t)}`}function T(t){return`${t.getDate()} ${U(t)}`}function I(t){let e;if("string"==typeof t&&t.includes(" ")){const i=t.split(/[^0-9]/).map((t=>parseInt(t,10)));i[1]-=1,e=new Date(...i)}else e=new Date(t);return new Date(e.getTime()+6e4*e.getTimezoneOffset())}function R(t){const e=60*(new Date).getTimezoneOffset();return new Date((new Date).getTime()+1e3*t.offset+1e3*e)}function _(t,e){return C(e)===C(R(t))}function A(t,e,i){return t.getFullYear()!==e.getFullYear()?t.getFullYear()<e.getFullYear():"year"!==i&&(t.getMonth()!==e.getMonth()?t.getMonth()<e.getMonth():"month"!==i&&t.getDate()<e.getDate())}function N(t,e,i){return t.getFullYear()!==e.getFullYear()?t.getFullYear()>e.getFullYear():"year"!==i&&(t.getMonth()!==e.getMonth()?t.getMonth()>e.getMonth():"month"!==i&&t.getDate()>e.getDate())}function U(t){return`${j[t.getMonth()].substring(0,3)}`}let B=new AbortController;class L extends Error{constructor(t){super(t),this.name="ApiError"}}function E(t,e=[]){const i={period:"realtime"};return t.period&&(i.period=t.period),t.date&&t.date instanceof Date?i.date=C(t.date):i.date=t.date,t.from&&(i.from=C(t.from)),t.to&&(i.to=C(t.to)),t.filters&&(i.filters=function(t){const e={};return Object.entries(t).forEach((([t,i])=>i?e[t]=i:null)),JSON.stringify(e)}(t.filters)),t.with_imported&&(i.with_imported=t.with_imported),Object.assign(i,...e),"?"+function(t){var e=[];for(var i in t)t.hasOwnProperty(i)&&e.push(encodeURIComponent(i)+"="+encodeURIComponent(t[i]));return e.join("&")}(i)}function F(t,e,i,...r){return t?function(t,e,i,...r){const n={Accept:"application/json","Content-Type":"application/json"};return e+=E(i,r),fetch(t,{method:"PUT",body:JSON.stringify({plausibleUrl:e}),signal:B.signal,headers:n}).then((t=>(t.ok,t.json())))}(t,e,i,...r):function(t,e,...i){const r={Accept:"application/json","Content-Type":"application/json"};return t+=E(e,i),fetch(t,{signal:B.signal,headers:r}).then((t=>t.ok?t.json():t.json().then((t=>{throw new L(t.error)}))))}(e,i,...r)}const P={};const q=function(){try{const t="test";return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch(t){return!1}}();function W(t,e){q?window.localStorage.setItem(t,e):P[t]=e}function H(t){return q?window.localStorage.getItem(t):P[t]??null}const V=e`
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
`;var Y=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};class G extends r{constructor(){super(...arguments),this.language="en",this.rtl=!1,this.wide=!1,this.installMediaQueryWatcher=(t,e)=>{let i=window.matchMedia(t);i.addListener((t=>e(t.matches))),e(i.matches)}}connectedCallback(){super.connectedCallback(),this.addGlobalListener("language-loaded",this._languageEvent.bind(this)),window.appGlobals&&window.appGlobals.i18nTranslation&&window.appGlobals.locale?(this.language=window.appGlobals.locale,this._setupRtl()):this.language="en",this.installMediaQueryWatcher("(min-width: 900px)",(t=>{this.wide=t}))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("language-loaded",this._languageEvent.bind(this))}updated(t){t.has("language")&&this.languageChanged()}static get rtlLanguages(){return["fa","ar","ar_EG"]}languageChanged(){}_setupRtl(){G.rtlLanguages.indexOf(this.language)>-1?this.rtl=!0:this.rtl=!1}static get styles(){return[V,e`
        [hidden] {
          display: none !important;
        }
      `]}_languageEvent(t){this.language=t.detail.language,window.appGlobals.locale=t.detail.language,void 0!==this.rtl&&this._setupRtl()}fire(t,e={},i=this){const r=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});i.dispatchEvent(r)}fireGlobal(t,e={}){this.fire(t,e,document)}addListener(t,e,i=this){i.addEventListener(t,e,!1)}addGlobalListener(t,e){this.addListener(t,e,document)}removeListener(t,e,i=this){i.removeEventListener(t,e)}removeGlobalListener(t,e){this.removeListener(t,e,document)}t(...t){const e=t[0];if(window.appGlobals&&window.appGlobals.i18nTranslation){let t=window.appGlobals.i18nTranslation.t(e);return t||(t=""),t}return e}getTooltipText(t){return t.tooltipTextToken?this.t(t.tooltipTextToken):void 0}renderIcon(t){return t.icon?"icon":void 0}$$(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}}Y([i({type:String})],G.prototype,"language",void 0),Y([i({type:Boolean})],G.prototype,"rtl",void 0),Y([i({type:Boolean})],G.prototype,"wide",void 0);var K=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let J=class extends G{constructor(){super(...arguments),this.disabled=!1}static get styles(){return[...super.styles]}renderComparison(t,e){const i=k(Math.abs(e));if(e>0){return o`<span class="text-xs dark:text-gray-100"
        ><span class="${("Bounce rate"===t?"text-red-400":"text-green-500")+" font-bold"}">&uarr;</span
        >${i}%</span
      >`}if(e<0){return o`<span class="text-xs dark:text-gray-100"
        ><span class="${("Bounce rate"===t?"text-green-500":"text-red-400")+" font-bold"}">&darr;</span>
        ${i}%</span
      >`}return 0===e?o`<span class="text-xs text-gray-700 dark:text-gray-300"
        >&#12336; N/A</span
      >`:a}topStatNumberShort(t){return["visit duration","time on page"].includes(t.name.toLowerCase())?$(t.value):["bounce rate","conversion rate"].includes(t.name.toLowerCase())?t.value+"%":k(t.value)}topStatTooltip(t){if(["visit duration","time on page","bounce rate","conversion rate"].includes(t.name.toLowerCase()))return null;{let e=t.name.toLowerCase();return e=1===t.value?e.slice(0,-1):e,t.value.toLocaleString()+" "+e}}titleFor(t){return this.metric===mt[t.name]?`Hide ${vt[mt[t.name]].toLowerCase()} from graph`:`Show ${vt[mt[t.name]].toLowerCase()} on graph`}renderStat(t){return o` <div
      class="flex items-center justify-between my-1 whitespace-nowrap"
    >
      <b
        class="mr-4 text-xl md:text-2xl dark:text-gray-100"
        tooltip="${s(null===this.topStatTooltip(t)?void 0:this.topStatTooltip(t))}"
        >${this.topStatNumberShort(t)}</b
      >
      ${this.renderComparison(t.name,t.change)}
    </div>`}render(){const t=this.topStatData&&this.topStatData.top_stats.map(((t,e)=>{let i=e>0?"lg:border-l border-gray-300":"";i=e%2==0?i+" border-r lg:border-r-0":i;const r=Object.keys(mt).includes(t.name)&&!(this.query.filters.goal&&"Unique visitors"===t.name),n=this.metric===mt[t.name],[a,s]=t.name.split(/(\(.+\))/g),l=this.t(a);return o`
          ${r?o`
                <div
                  class="${`px-4 md:px-6 w-1/2 my-4 lg:w-auto group cursor-pointer select-none ${i}`}"
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
                <div class=${`px-4 md:px-6 w-1/2 my-4 lg:w-auto ${i}`}>
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
        ></div>`),t}};K([i({type:Boolean})],J.prototype,"disabled",void 0),K([i({type:Object})],J.prototype,"query",void 0),K([i({type:Object})],J.prototype,"updateMetric",void 0),K([i({type:Object})],J.prototype,"history",void 0),K([i({type:String})],J.prototype,"classsName",void 0),K([i({type:Object})],J.prototype,"to",void 0),K([i({type:String})],J.prototype,"metric",void 0),K([i({type:Object})],J.prototype,"topStatData",void 0),J=K([n("pl-top-stats")],J),b.register(...y);var X=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Z=class extends G{constructor(){super(...arguments),this.to=void 0}static get styles(){return[...super.styles,e`
        :host {
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
      `]}get currentUri(){return`${location.pathname}?${this.to.search}`}onClick(t){t.preventDefault(),window.history.pushState({},"",this.currentUri),setTimeout((()=>{window.dispatchEvent(new CustomEvent("popstate"))}))}render(){return o`<a href="${this.currentUri}" @click="${this.onClick}"
      ><slot></slot
    ></a> `}};X([i({type:String})],Z.prototype,"to",void 0),Z=X([n("pl-link")],Z);const Q=["realtime","day","month","7d","30d","6mo","12mo","year","all","custom"];function tt(t,e){const i=new URLSearchParams(t);let r=i.get("period");const n=`period__${e.domain}`;return Q.includes(r)?"custom"!==r&&"realtime"!==r&&W(n,r):r=H(n)?H(n):"30d",{period:r,date:i.get("date")?I(i.get("date")):R(e),from:i.get("from")?I(i.get("from")):void 0,to:i.get("to")?I(i.get("to")):void 0,with_imported:!i.get("with_imported")||"true"===i.get("with_imported"),filters:{goal:i.get("goal"),props:JSON.parse(i.get("props")),source:i.get("source"),utm_medium:i.get("utm_medium"),utm_source:i.get("utm_source"),utm_campaign:i.get("utm_campaign"),utm_content:i.get("utm_content"),utm_term:i.get("utm_term"),referrer:i.get("referrer"),screen:i.get("screen"),browser:i.get("browser"),browser_version:i.get("browser_version"),os:i.get("os"),os_version:i.get("os_version"),country:i.get("country"),region:i.get("region"),city:i.get("city"),page:i.get("page"),entry_page:i.get("entry_page"),exit_page:i.get("exit_page")}}}function et(t){return Object.keys(t.filters).map((e=>[e,t.filters[e]])).filter((([t,e])=>!!e))}function it(t){const e=new URLSearchParams(window.location.search);return Object.keys(t).forEach((i=>{t[i]?e.set(i,t[i]):e.delete(i)})),e.toString()}function rt(t,e,i){const r=it(i);if(i.period&&i.period!==e.period){const t=new URLSearchParams(window.location.search);t.set("period",e.period);const i=`${location.pathname}?${t.toString()}`;window.history.pushState({},"",i),setTimeout((()=>{window.dispatchEvent(new CustomEvent("popstate"))}))}else{const t=`${location.pathname}?${r}`;window.history.pushState({},"",t),setTimeout((()=>{window.dispatchEvent(new CustomEvent("popstate"))}))}t.push({search:r})}const nt={goal:"Goal",props:"Property",prop_key:"Property",prop_value:"Value",source:"Source",utm_medium:"UTM Medium",utm_source:"UTM Source",utm_campaign:"UTM Campaign",utm_content:"UTM Content",utm_term:"UTM Term",referrer:"Referrer URL",screen:"Screen size",browser:"Browser",browser_version:"Browser Version",os:"Operating System",os_version:"Operating System Version",country:"Country",region:"Region",city:"City",page:"Page",entry_page:"Entry Page",exit_page:"Exit Page"},ot=(t,e=!1)=>function(i,r,n){let o=I(i);if("month"===t)return O(o);if("date"===t)return z(o);if("hour"===t){const t=i.split(/[^0-9]/);o=new Date(t[0],t[1]-1,t[2],t[3],t[4],t[5]);var a=o.getHours(),s=a>=12?"pm":"am";return(a=(a%=12)||12)+s}if("minute"===t){if(e){const t=Math.abs(parseInt(i));return 1===t?"1 minute ago":t+" minutes ago"}return i+"m"}return i},at=(t,e,i,r)=>n=>{const o=n.tooltip,a=i.getBoundingClientRect();let s=r;if(s||(s=document.createElement("div"),s.id="chartjs-tooltip",s.style.display="none",s.style.opacity="0",document.body.appendChild(s)),s&&a&&window.innerWidth<768&&(s.style.top=a.y+a.height+window.scrollY+15+"px",s.style.left=a.x+"px",s.style.right="",s.style.opacity="1"),0!==o.opacity){if(o.body){var l=o.body.map((function(t){return t.lines}));3===l.length&&(l[1]=[]);const i=o.dataPoints[0],r=t.labels[i.dataIndex],n=i.raw||0;let a=`\n        <div class='text-gray-100 flex flex-col'>\n          <div class='flex justify-between items-center'>\n            <span class='font-bold mr-4 text-lg'>${vt[e]}</span>\n          </div>\n          <div class='flex flex-col'>\n            <div class='flex flex-row justify-between items-center'>\n              <span class='flex items-center mr-4'>\n                <div class='w-3 h-3 mr-1 rounded-full' style='background-color: rgba(101,116,205)'></div>\n                <span>${function(e,i){const r=ot(t.interval,!0)(e),n=i?ot(t.interval,!0)(i):null;return"month"===t.interval||"date"===t.interval?i?n:r:"hour"===t.interval?i?`${ot("date",!0)(i)}, ${ot(t.interval,!0)(i)}`:`${ot("date",!0)(e)}, ${r}`:i?n:r}(r)}</span>\n              </span>\n              <span>${bt[e](n)}</span>\n            </div>\n          </div>\n          <span class='font-bold text-'>${"month"===t.interval?"Click to view month":"date"===t.interval?"Click to view day":""}</span>\n        </div>\n      `;s.innerHTML=a}s.style.display=""}else s.style.display="none"};function st(t,e=""){return`/api/stats/${encodeURIComponent(t.domain)}${e}`}function lt(t,e=""){return function(t,e=""){return`/${encodeURIComponent(t.domain)}${e}`}(t,e)+window.location.search}function ct(t,e){const i=new URLSearchParams(window.location.search);return i.set(t,e),`${i.toString()}`}var dt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};class ht extends G{}dt([i({type:Object})],ht.prototype,"query",void 0),dt([i({type:Object})],ht.prototype,"site",void 0),dt([i({type:String})],ht.prototype,"proxyUrl",void 0),dt([i({type:String})],ht.prototype,"proxyFaviconBaseUrl",void 0),dt([i({type:Object})],ht.prototype,"timer",void 0),dt([i({type:String})],ht.prototype,"currentUserRole",void 0);var ut=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let pt=class extends ht{constructor(){super(),this.darkTheme=!1,this.exported=!1,this.repositionTooltip=this.repositionTooltip.bind(this)}static get styles(){return[...super.styles]}updated(t){super.updated(t);const e=this.$$("#chartjs-tooltip");this.metric&&this.graphData&&(t.has("graphData")||t.has("darkTheme"))&&(this.chart&&this.chart.destroy(),this.chart=this.regenerateChart(),this.chart.update(),e&&(e.style.display="none")),this.graphData&&this.metric||(this.chart&&this.chart.destroy(),e&&(e.style.display="none"))}regenerateChart(){let t=this.$$("canvas");t||(t=this.canvasElement),this.ctx=t.getContext("2d");const e=((t,e,i,r,n)=>{var o=i.createLinearGradient(0,0,0,300),a=i.createLinearGradient(0,0,0,300);if(o.addColorStop(0,"rgba(101,116,205, 0.2)"),o.addColorStop(1,"rgba(101,116,205, 0)"),a.addColorStop(0,"rgba(101,116,205, 0.075)"),a.addColorStop(1,"rgba(101,116,205, 0)"),n)return[{label:r,data:t,borderWidth:2,borderColor:"rgba(166,187,210,0.5)",pointHoverBackgroundColor:"rgba(166,187,210,0.8)",pointBorderColor:"transparent",pointHoverBorderColor:"transparent",pointHoverRadius:4,backgroundColor:a,fill:!0}];if(null!==e){var s=t.slice(e-1,e+1),l=new Array(e-1).fill(void 0).concat(s);const i=[...t];for(var c=e;c<i.length;c++)i[c]=void 0;return[{label:r,data:i,borderWidth:3,borderColor:"rgba(101,116,205)",pointBackgroundColor:"rgba(101,116,205)",pointHoverBackgroundColor:"rgba(71, 87, 193)",pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0},{label:r,data:l,borderWidth:3,borderDash:[3,3],borderColor:"rgba(101,116,205)",pointHoverBackgroundColor:"rgba(71, 87, 193)",pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0}]}return[{label:r,data:t,borderWidth:3,borderColor:"rgba(101,116,205)",pointHoverBackgroundColor:"rgba(71, 87, 193)",pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0}]})(this.graphData.plot,this.graphData.present_index,this.ctx,vt[this.metric],!1),i=this.graphData;return new b(this.ctx,{type:"line",data:{labels:this.graphData.labels,datasets:e},options:{animation:!1,plugins:{legend:{display:!1},tooltip:{enabled:!1,mode:"index",intersect:!1,position:"average",external:at(this.graphData,this.metric,t,this.$$("#chartjs-tooltip"))}},responsive:!0,onResize:this.updateWindowDimensions,elements:{line:{tension:0},point:{radius:0}},onClick:this.onClick.bind(this),scales:{y:{beginAtZero:!0,ticks:{callback:bt[this.metric],maxTicksLimit:8,color:this.darkTheme?"rgb(243, 244, 246)":void 0},grid:{zeroLineColor:"transparent",drawBorder:!1}},x:{grid:{display:!1},ticks:{maxTicksLimit:8,callback:function(t,e,r){return ot(i.interval)(this.getLabelForValue(t))},color:this.darkTheme?"rgb(243, 244, 246)":void 0}}},interaction:{mode:"index",intersect:!1}}})}repositionTooltip(t){const e=this.$$("#chartjs-tooltip");e&&window.innerWidth>=768&&(t.clientX>.66*window.innerWidth?(e.style.right=window.innerWidth-t.clientX+window.pageXOffset+"px",e.style.left=""):(e.style.right="",e.style.left=t.clientX+window.pageXOffset+"px"),e.style.top=t.clientY+window.pageYOffset+"px",e.style.opacity="1")}connectedCallback(){super.connectedCallback(),window.addEventListener("mousemove",this.repositionTooltip)}firstUpdated(t){this.metric&&this.graphData&&(this.chart=this.regenerateChart())}disconnectedCallback(){super.disconnectedCallback();const t=document.getElementById("chartjs-tooltip");t&&(t.style.opacity="0",t.style.display="none"),window.removeEventListener("mousemove",this.repositionTooltip)}updateWindowDimensions(t,e){t.options.scales.x.ticks.maxTicksLimit=e.width<720?5:8,t.options.scales.y.ticks.maxTicksLimit=e.height<233?3:8}onClick(t){const e=this.chart.getElementsAtEventForMode(t,"index",{intersect:!1},!1)[0],i=this.chart.data.labels[e.index];"month"===this.graphData.interval?rt(this.history,this.query,{period:"month",date:i}):"date"===this.graphData.interval&&rt(this.history,this.query,{period:"day",date:i})}pollExportReady(){document.cookie.includes("exporting")?setTimeout(this.pollExportReady.bind(this),1e3):this.exported=!1}downloadSpinner(){this.exported=!0,document.cookie="exporting=",setTimeout(this.pollExportReady.bind(this),1e3)}downloadLink(){if("realtime"!==this.query.period){if(this.exported)return o`
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
        `;{const t=`/${encodeURIComponent(this.site.domain)}/export${E(this.query)}`;return o`
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
      `:a}importedNotice(){const t=this.topStatData.imported_source;if(t){const e=this.topStatData.with_imported,i=function(t,e){const i=new URLSearchParams(window.location.search);return i.set(t,e),`${window.location.pathname}?${i.toString()}`}("with_imported",(!e).toString());return o`
        <pl-link .to=${i} class="w-4 h-4 mx-2">
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
    `}};ut([i({type:Object})],pt.prototype,"graphData",void 0),ut([i({type:String})],pt.prototype,"metric",void 0),ut([i({type:Object})],pt.prototype,"ctx",void 0),ut([i({type:Boolean})],pt.prototype,"darkTheme",void 0),ut([i({type:Object})],pt.prototype,"chart",void 0),ut([i({type:Object})],pt.prototype,"updateMetric",void 0),ut([i({type:Object})],pt.prototype,"history",void 0),ut([i({type:Object})],pt.prototype,"topStatData",void 0),ut([l("canvas")],pt.prototype,"canvasElement",void 0),ut([i({type:Boolean})],pt.prototype,"exported",void 0),pt=ut([n("pl-line-graph")],pt);var ft=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let gt=class extends ht{constructor(){super(),this.useTopStatsForCurrentVisitors=!1}static get styles(){return[...super.styles]}connectedCallback(){super.connectedCallback(),this.metric=H(`metric__${this.site.domain}`)||"visitors",this.updateMetric=this.updateMetric.bind(this),this.fetchGraphData=this.fetchGraphData.bind(this),this.fetchTopStatData=this.fetchTopStatData.bind(this)}updated(t){if(super.updated(t),t.get("query")){this.fetchGraphData(),this.fetchTopStatData();const e=H(`metric__${this.site.domain}`),i=this.topStatData&&this.topStatData.top_stats.map((({name:t})=>mt[t])).filter((t=>t)),r=t.get("topStatData")&&t.get("topStatData").top_stats.map((({name:t})=>mt[t])).filter((t=>t));i&&`${i}`!=`${r}`&&(i.includes(e)||""===e?this.metric=e:this.query.filters.goal&&"conversions"!==this.metric?this.metric="conversions":this.metric=i[0])}else t.get("metric")&&this.fetchGraphData()}firstUpdated(){this.fetchGraphData(),this.fetchTopStatData(),this.timer&&(this.timer.onTick(this.fetchGraphData),this.timer.onTick(this.fetchTopStatData))}updateMetric(t){t===this.metric?W(`metric__${this.site.domain}`,""):(W(`metric__${this.site.domain}`,t),this.metric=t)}fetchGraphData(){this.metric&&F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/main-graph`,this.query,{metric:this.metric||"none"}).then((t=>{this.graphData=t}))}fetchTopStatData(){F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`,this.query).then((t=>{this.useTopStatsForCurrentVisitors&&"realtime"==this.query.period&&(t.top_stats[0]={name:t.top_stats[0].name,value:t.top_stats[1].value}),this.topStatData=t}))}renderInner(){const t=document.querySelector("html").classList.contains("dark")||!1;return o`
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

`}};ft([i({type:Object})],gt.prototype,"history",void 0),ft([i({type:String})],gt.prototype,"metric",void 0),ft([i({type:Object})],gt.prototype,"topStatData",void 0),ft([i({type:Object})],gt.prototype,"graphData",void 0),ft([i({type:Boolean})],gt.prototype,"useTopStatsForCurrentVisitors",void 0),gt=ft([n("pl-visitors-graph")],gt);const mt={"Unique visitors (last 30 min)":"visitors","Pageviews (last 30 min)":"pageviews","Unique visitors":"visitors","Visit duration":"visit_duration","Total pageviews":"pageviews","Bounce rate":"bounce_rate","Unique conversions":"conversions"},vt={visitors:"Visitors",pageviews:"Pageviews",bounce_rate:"Bounce Rate",visit_duration:"Visit Duration",conversions:"Converted Visitors"},bt={visitors:k,pageviews:k,bounce_rate:t=>`${t}%`,visit_duration:$,conversions:k};var yt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let wt=class extends G{constructor(){super(...arguments),this.plot="visitors"}static get styles(){return[...super.styles,e`
        :host {
          width: 90%;
        }

        .faviconMargin {
          margin-left: 30px;
        }

        .rounded {
          border-radius: 12px;
        }
      `,e``]}render(){const t=function(t,e,i){let r=e[0][i];for(const t of e)t>r&&(r=t[i]);return t/r*100}(this.count,this.all,this.plot);return o`
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
    `}};yt([i({type:Number})],wt.prototype,"count",void 0),yt([i({type:Array})],wt.prototype,"all",void 0),yt([i({type:String})],wt.prototype,"maxWidthDeduction",void 0),yt([i({type:String})],wt.prototype,"plot",void 0),yt([i({type:String})],wt.prototype,"bg",void 0),wt=yt([n("pl-bar")],wt);var xt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let kt=class extends ht{constructor(){super(),this.loading=!0,this.viewport=1080,this.breakdown=[],this.page=1,this.moreResultsAvailable=!0}async connectedCallback(){super.connectedCallback(),this.propKey=this.goal.prop_names[0],this.storageKey="goalPropTab__"+this.site.domain+this.goal.name;const t=H(this.storageKey);this.goal.prop_names.includes(t)&&(this.propKey=t),this.query.filters.props&&(this.propKey=Object.keys(this.query.filters.props)[0]),this.handleResize=this.handleResize.bind(this),window.addEventListener("resize",this.handleResize,!1),this.handleResize(),await this.updateComplete,this.fetchPropBreakdown()}disconnectedCallback(){window.removeEventListener("resize",this.handleResize,!1)}static get styles(){return[...super.styles]}handleResize(){this.viewport=window.innerWidth}getBarMaxWidth(){return this.viewport>767?"16rem":"10rem"}fetchPropBreakdown(){this.query.filters.goal&&F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/property/${encodeURIComponent(this.propKey)}`,this.query,{limit:100,page:this.page}).then((t=>{this.loading=!1,this.breakdown=this.breakdown.concat(t),this.moreResultsAvailable=100===t.length}))}loadMore(){this.loading=!0,this.page=this.page+1,this.fetchPropBreakdown()}renderUrl(t){return function(t){let e;try{e=new URL(t)}catch(t){return!1}return"http:"===e.protocol||"https:"===e.protocol}(t.name)?o`
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
            >${k(t.unique_conversions)}</span
          >
          ${this.viewport&&this.viewport>767?o`
                <span class="font-medium inline-block w-20 text-right"
                  >${k(t.total_conversions)}
                </span>
              `:null}
          <span class="font-medium inline-block w-20 text-right"
            >${k(t.conversion_rate)}%</span
          >
        </div>
      </div>
    `}changePropKey(t){W(this.storageKey,t),this.propKey=t,this.loading=!0,this.breakdown=[],this.page=1,this.moreResultsAvailable=!1,this.fetchPropBreakdown()}renderLoading(){return this.loading?o` <div class="px-4 py-2">
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
      `:a}};xt([i({type:Object})],kt.prototype,"onClickFunction",void 0),xt([i({type:Object})],kt.prototype,"goal",void 0),xt([i({type:String})],kt.prototype,"propKey",void 0),xt([i({type:String})],kt.prototype,"storageKey",void 0),xt([i({type:Boolean})],kt.prototype,"loading",void 0),xt([i({type:Number})],kt.prototype,"viewport",void 0),xt([i({type:Array})],kt.prototype,"breakdown",void 0),xt([i({type:Number})],kt.prototype,"page",void 0),xt([i({type:Boolean})],kt.prototype,"moreResultsAvailable",void 0),kt=xt([n("pl-prop-breakdown")],kt);var $t=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Ct=class extends ht{constructor(){super(),this.loading=!1,this.viewport=1080,this.handleResize=this.handleResize.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this.handleResize,!1),this.handleResize(),this.timer&&this.timer.onTick(this.fetchConversions.bind(this))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this.handleResize,!1)}updated(t){if(super.updated(t),t.get("query")){const t=this.offsetHeight;this.loading=!0,this.prevHeight=t,this.fetchConversions()}}static get styles(){return[...super.styles,e`
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
      `]}handleResize(){this.viewport=window.innerWidth}firstUpdated(){this.fetchConversions()}getBarMaxWidth(){return this.viewport>767?"16rem":"10rem"}fetchConversions(){F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/conversions`,this.query).then((t=>{this.loading=!1,this.goals=t,this.prevHeight=void 0}))}getPlBackground(t){return this.highlightedGoals&&this.highlightedGoals.includes(t)?"bg-red-60":this.highlightedGoals?"bg-red-40":"bg-red-50"}renderGoal(t){const e=this.query.filters.goal==t.name&&t.prop_names;return o`
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
              .to="${{search:ct("goal",t.name)}}"
              class="block px-2 py-1.5 hover:underline relative z-2 break-all lg:truncate dark:text-gray-200"
              >${this.t(t.name)}</pl-link
            >
          </pl-bar>
          <div class="dark:text-gray-200">
            <span class="inline-block w-20 font-medium text-right"
              >${k(t.unique_conversions)}</span
            >
            ${this.viewport&&this.viewport>767?o`<span class="inline-block w-20 font-medium text-right"
                  >${k(t.total_conversions)}</span
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
    `}};$t([i({type:Object})],Ct.prototype,"onClickFunction",void 0),$t([i({type:Boolean})],Ct.prototype,"loading",void 0),$t([i({type:Number})],Ct.prototype,"viewport",void 0),$t([i({type:Number})],Ct.prototype,"prevHeight",void 0),$t([i({type:Array})],Ct.prototype,"goals",void 0),$t([i({type:Array})],Ct.prototype,"highlightedGoals",void 0),Ct=$t([n("pl-conversions")],Ct);var Mt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let St=class extends G{static get styles(){return[...super.styles,e`
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
      `:a}};Mt([i({type:String})],St.prototype,"url",void 0),Mt([i({type:String})],St.prototype,"endpoint",void 0),Mt([i({type:Object})],St.prototype,"site",void 0),Mt([i({type:Array})],St.prototype,"list",void 0),St=Mt([n("pl-more-link")],St);var jt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Dt=class extends ht{constructor(){super(...arguments),this.filter=void 0,this.loading=!1}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.fetchData.bind(this)),this.valueKey=this.valueKey||"visitors",this.showConversionRate=!!this.query.filters.goal}static get styles(){return[...super.styles,e`
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
      `}return a}firstUpdated(t){this.fetchData()}updated(t){super.updated(t),t.get("query")&&this.fetchData()}fetchData(){if(this.prevQuery!==this.query){this.prevQuery=this.query,this.loading=!0,this.list=void 0;try{this.fetchDataFunction().then((t=>{this.loading=!1,this.list=t}))}catch(t){console.error(t)}}}get label(){return"realtime"===this.query.period?this.t("Current visitors"):this.showConversionRate?this.t("Conversions"):this.valueLabel||this.t("Visitors")}renderListItem(t){const e=new URLSearchParams(window.location.search);Object.entries(this.filter).forEach((([i,r])=>{e.set(i,t[r])}));const i=this.showConversionRate?"10rem":"5rem",r=this.color||"bg-green-50";return o`
      <div
        class="flex items-center justify-between my-1 text-sm"
        key="${t.name}"
      >
        <pl-bar
          .count=${t[this.valueKey]}
          .all=${this.list}
          .bg=${`${r} dark:bg-gray-500 dark:bg-opacity-15`}
          maxWidthDeduction="${i}"
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
          ${k(t[this.valueKey])}
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
    `}};jt([i({type:Object})],Dt.prototype,"prevQuery",void 0),jt([i({type:String})],Dt.prototype,"tabKey",void 0),jt([i({type:String})],Dt.prototype,"valueKey",void 0),jt([i({type:String})],Dt.prototype,"keyLabel",void 0),jt([i({type:String})],Dt.prototype,"color",void 0),jt([i({type:String})],Dt.prototype,"valueLabel",void 0),jt([i({type:String})],Dt.prototype,"storedTab",void 0),jt([i({type:Object})],Dt.prototype,"externalLinkDest",void 0),jt([i({type:Boolean})],Dt.prototype,"showConversionRate",void 0),jt([i({type:String})],Dt.prototype,"detailsLink",void 0),jt([i({type:Object})],Dt.prototype,"onClick",void 0),jt([i({type:Object})],Dt.prototype,"fetchDataFunction",void 0),jt([i({type:Object})],Dt.prototype,"filter",void 0),jt([i({type:Array})],Dt.prototype,"list",void 0),jt([i({type:Boolean})],Dt.prototype,"loading",void 0),Dt=jt([n("pl-list-report")],Dt);var Ot=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};class zt extends ht{connectedCallback(){super.connectedCallback()}fetchData(){return F(this.proxyUrl,st(this.site,this.pagePath),this.query,{limit:9})}externalLinkDest(t){return function(t,e){return new URL(`https://${t}`),`https://${window.location.hostname}${e}`}(this.site.domain,t.name)}}Ot([i({type:String})],zt.prototype,"pagePath",void 0);var Tt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let It=class extends zt{constructor(){super(),this.pagePath="/pages"}render(){return o`
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{entry_page:"name"}}
        .keyLabel=${this.t("Page")}
        .timer="${this.timer}"
        .proxyUrl="${this.proxyUrl}"
        .detailsLink=${lt(this.site,this.pagePath)}
        .query=${this.query}
        .pagePath="${this.pagePath}"
        .site="${this.site}"
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `}};It=Tt([n("pl-top-pages")],It);var Rt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let _t=class extends zt{constructor(){super(),this.pagePath="/entry-pages"}render(){return o`
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
        .detailsLink=${lt(this.site,this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `}};_t=Rt([n("pl-entry-pages")],_t);var At=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Nt=class extends zt{constructor(){super(),this.pagePath="/exit-pages"}render(){return o`
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
        .detailsLink=${lt(this.site,this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `}};Nt=At([n("pl-exit-pages")],Nt);var Ut=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Bt=class extends ht{constructor(){super(...arguments),this.labelFor={pages:"Top Pages","entry-pages":"Entry Pages","exit-pages":"Exit Pages"}}connectedCallback(){super.connectedCallback(),this.tabKey=`pageTab__${this.site.domain}`,this.mode=this.storedTab||"pages"}setMode(t){W(this.tabKey,t),this.mode=t}renderContent(){switch(this.mode){case"entry-pages":return o`<pl-entry-pages
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
      `:a}};Ut([i({type:String})],Bt.prototype,"tabKey",void 0),Ut([i({type:String})],Bt.prototype,"storedTab",void 0),Ut([i({type:String})],Bt.prototype,"mode",void 0),Bt=Ut([n("pl-pages")],Bt);const Lt=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
</svg>`,Et=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
</svg>`,Ft=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg>`,Pt=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
</svg>`,qt=c`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg>`;var Wt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};const Ht={utm_medium:{label:"UTM Medium",shortLabel:"UTM Medium",endpoint:"utm_mediums"},utm_source:{label:"UTM Source",shortLabel:"UTM Source",endpoint:"utm_sources"},utm_campaign:{label:"UTM Campaign",shortLabel:"UTM Campai",endpoint:"utm_campaigns"},utm_content:{label:"UTM Content",shortLabel:"UTM Conten",endpoint:"utm_contents"},utm_term:{label:"UTM Term",shortLabel:"UTM Term",endpoint:"utm_terms"}};class Vt extends ht{constructor(){super(...arguments),this.loading=!1,this.open=!1,this.alwaysShowNoRef=!1}fetchReferrers(){}updated(t){t.has("tab")&&this.fire("tab-changed",this.tab),(t.has("tab")||t.get("query"))&&this.fetchReferrers()}toggleOpen(){this.open=!this.open}get label(){return"realtime"===this.query.period?this.t("Current visitors"):this.showConversionRate?this.t("Conversions"):this.t("Visitors")}get showConversionRate(){return!!this.query.filters?.goal}get showNoRef(){return this.alwaysShowNoRef||"realtime"===this.query.period}setTab(t){this.tab=t,this.open=!1}faviconUrl(t){return this.proxyFaviconBaseUrl?`${this.proxyFaviconBaseUrl}${encodeURIComponent(t)}`:`/favicon/sources/${encodeURIComponent(t)}`}static get styles(){return[...super.styles,e`

    `]}setAllTab(){this.fire("tab-changed","all"),this.open=!1}renderTabs(){const t="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading truncate text-left",e="hover:text-indigo-600 cursor-pointer truncate text-left";let i=Ht[this.tab]?this.t(Ht[this.tab].label):this.t("UTM");return o`
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
                style="width: ${"UTM"==i?"1.8rem":"4.5rem"}"
                class="${this.tab.startsWith("utm_")?t:e}"
                >${i}</span
              >
              <div class="-mr-1 ml-px h-4 w-4" aria-hidden="true">
                ${qt}
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
    `}}Wt([i({type:String})],Vt.prototype,"tab",void 0),Wt([i({type:Array})],Vt.prototype,"referrers",void 0),Wt([i({type:Boolean})],Vt.prototype,"loading",void 0),Wt([i({type:Boolean})],Vt.prototype,"open",void 0),Wt([i({type:Boolean})],Vt.prototype,"alwaysShowNoRef",void 0);var Yt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Gt=class extends r{constructor(){super(...arguments),this.show=!1}render(){return o`
      <div
        class="${`${this.myClassName||""} ${this.show?"fade-enter-active":"fade-enter"}`}"
      >
        <slot></slot>
      </div>
    `}};Yt([i({type:Boolean})],Gt.prototype,"show",void 0),Yt([i({type:String})],Gt.prototype,"myClassName",void 0),Gt=Yt([n("pl-fade-in")],Gt);var Kt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Jt=class extends Vt{constructor(){super(...arguments),this.to=void 0}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.fetchReferrers.bind(this))}fetchReferrers(){this.loading=!0,this.referrers=void 0,F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/sources`,this.query,{show_noref:this.showNoRef}).then((t=>{this.loading=!1,this.referrers=t}))}static get styles(){return[...super.styles,e`
      .directNoneIcon {
        margin-right: 28px;
      }
    `]}renderReferrer(t){const e=this.showConversionRate?"10rem":"5rem";let i;return t.name&&(i=this.t(t.name)),o`
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
              .to=${{search:ct("source",t.name)}}
            >
            ${"Direct / None"!==t.name?o`
              <img
                  src=${this.faviconUrl(t.name)}
                  class="inline w-4 h-4 mr-2 -mt-px align-middle"
                />
            `:o`
              <div class="inline w-4 h-4 mr-2 -mt-px align-middle directNoneIcon"></div>
            `}
              ${i}
            </pl-link>
          </span>
        </pl-bar>
        <span
          class="font-medium dark:text-gray-200 w-20 text-right"
          tooltip="${t.visitors}"
          >${k(t.visitors)}</span
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
    `}};Kt([i({type:String})],Jt.prototype,"to",void 0),Jt=Kt([n("pl-sources-all")],Jt);var Xt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Zt=class extends Vt{constructor(){super(...arguments),this.to=void 0}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.fetchReferrers.bind(this))}fetchReferrers(){const t=Ht[this.tab].endpoint;this.loading=!0,this.referrers=void 0,F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/${t}`,this.query,{show_noref:this.showNoRef}).then((t=>{this.loading=!1,this.referrers=t}))}renderReferrer(t){const e=this.showConversionRate?"10rem":"5rem";return o`
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
              .to=${{search:ct(this.tab,t.name)}}
            >
              ${t.name}
           </pl-link>
          </span>
        </pl-bar>
        <span class="font-medium dark:text-gray-200 w-20 text-right" tooltip=${t.visitors}>${k(t.visitors)}</span>
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
    `}};Xt([i({type:String})],Zt.prototype,"to",void 0),Zt=Xt([n("pl-sources-utm")],Zt);var Qt=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let te=class extends Jt{fetchReferrers(){this.loading=!0,this.referrers=void 0,F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/referrers/${encodeURIComponent(this.query.filters.source)}`,this.query,{show_noref:this.showNoRef}).then((t=>{this.loading=!1,this.referrers=t}))}};te=Qt([n("pl-sources-referrers")],te);var ee=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let ie=class extends ht{constructor(){super(...arguments),this.alwaysShowNoRef=!1}connectedCallback(){super.connectedCallback(),this.tabKey="sourceTab__"+this.site.domain;const t=H(this.tabKey);this.tab=t||"all"}tabChanged(t){this.tab=t.detail,this.tab&&W(this.tabKey,this.tab)}render(){return this.query.filters.source&&"Direct / None"!==this.query.filters.source?o`
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
      `}};ee([i({type:String})],ie.prototype,"tabKey",void 0),ee([i({type:String})],ie.prototype,"tab",void 0),ee([i({type:Boolean})],ie.prototype,"alwaysShowNoRef",void 0),ie=ee([n("pl-sources-list")],ie);var re=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};const ne={Mobile:"up to 576px",Tablet:"576px to 992px",Laptop:"992px to 1440px",Desktop:"above 1440px"};let oe=class extends ht{connectedCallback(){super.connectedCallback(),this.tabKey=`pageTab__${this.site.domain}`,this.mode=this.storedTab||"browser"}setMode(t){W(this.tabKey,t),this.mode=t}renderBrowsers(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/browsers"),this.query)}
        .filter=${{browser:"name"}}
        .timer="${this.timer}"
        .keyLabel="${this.t("Browser")}"
        .query=${this.query}
      ></pl-list-report>
    `}renderBrowserVersions(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/browser-versions"),this.query)}
        .timer="${this.timer}"
        .filter=${{browser_version:"name"}}
        .keyLabel=${this.query.filters.browser+` ${this.t("version")}`}
        .query=${this.query}
      ></pl-list-report>
    `}renderOperatingSystems(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/operating-systems"),this.query)}
        .timer="${this.timer}"
        .filter=${{os:"name"}}
        .keyLabel=${this.t("Operating system")}
        .query=${this.query}
      ></pl-list-report>
    `}renderOperatingSystemVersions(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/operating-system-versions"),this.query)}
        .timer="${this.timer}"
        .filter=${{os_version:"name"}}
        .keyLabel=${this.query.filters.os+` ${this.t("version")}`}
        .query=${this.query}
      ></pl-list-report>
    `}renderScreenSizes(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/screen-sizes"),this.query)}
        .filter=${{screen:"name"}}
        .keyLabel=${this.t("Screen size")}
        .timer="${this.timer}"
        .query=${this.query}
        .renderIcon=${t=>this.iconFor(t.name)}
        .tooltipText=${t=>ne[t.name]}
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
    `}};function ae(t,e){return null==t||null==e?NaN:t<e?-1:t>e?1:t>=e?0:NaN}function se(t,e){return null==t||null==e?NaN:e<t?-1:e>t?1:e>=t?0:NaN}function le(t){let e,i,r;function n(t,r,n=0,o=t.length){if(n<o){if(0!==e(r,r))return o;do{const e=n+o>>>1;i(t[e],r)<0?n=e+1:o=e}while(n<o)}return n}return 2!==t.length?(e=ae,i=(e,i)=>ae(t(e),i),r=(e,i)=>t(e)-i):(e=t===ae||t===se?t:ce,i=t,r=t),{left:n,center:function(t,e,i=0,o=t.length){const a=n(t,e,i,o-1);return a>i&&r(t[a-1],e)>-r(t[a],e)?a-1:a},right:function(t,r,n=0,o=t.length){if(n<o){if(0!==e(r,r))return o;do{const e=n+o>>>1;i(t[e],r)<=0?n=e+1:o=e}while(n<o)}return n}}}function ce(){return 0}re([i({type:String})],oe.prototype,"tabKey",void 0),re([i({type:String})],oe.prototype,"storedTab",void 0),re([i({type:String})],oe.prototype,"mode",void 0),oe=re([n("pl-devices")],oe);const de=le(ae).right;le((function(t){return null===t?NaN:+t})).center;var he=de;class ue{constructor(){this._partials=new Float64Array(32),this._n=0}add(t){const e=this._partials;let i=0;for(let r=0;r<this._n&&r<32;r++){const n=e[r],o=t+n,a=Math.abs(t)<Math.abs(n)?t-(o-n):n-(o-t);a&&(e[i++]=a),t=o}return e[i]=t,this._n=i+1,this}valueOf(){const t=this._partials;let e,i,r,n=this._n,o=0;if(n>0){for(o=t[--n];n>0&&(e=o,i=t[--n],o=e+i,r=i-(o-e),!r););n>0&&(r<0&&t[n-1]<0||r>0&&t[n-1]>0)&&(i=2*r,e=o+i,i==e-o&&(o=e))}return o}}const pe=Math.sqrt(50),fe=Math.sqrt(10),ge=Math.sqrt(2);function me(t,e,i){const r=(e-t)/Math.max(0,i),n=Math.floor(Math.log10(r)),o=r/Math.pow(10,n),a=o>=pe?10:o>=fe?5:o>=ge?2:1;let s,l,c;return n<0?(c=Math.pow(10,-n)/a,s=Math.round(t*c),l=Math.round(e*c),s/c<t&&++s,l/c>e&&--l,c=-c):(c=Math.pow(10,n)*a,s=Math.round(t/c),l=Math.round(e/c),s*c<t&&++s,l*c>e&&--l),l<s&&.5<=i&&i<2?me(t,e,2*i):[s,l,c]}function ve(t,e,i){return me(t=+t,e=+e,i=+i)[2]}function be(t){return Array.from(function*(t){for(const e of t)yield*e}(t))}var ye={value:()=>{}};function we(){for(var t,e=0,i=arguments.length,r={};e<i;++e){if(!(t=arguments[e]+"")||t in r||/[\s.]/.test(t))throw new Error("illegal type: "+t);r[t]=[]}return new xe(r)}function xe(t){this._=t}function ke(t,e){for(var i,r=0,n=t.length;r<n;++r)if((i=t[r]).name===e)return i.value}function $e(t,e,i){for(var r=0,n=t.length;r<n;++r)if(t[r].name===e){t[r]=ye,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=i&&t.push({name:e,value:i}),t}xe.prototype=we.prototype={constructor:xe,on:function(t,e){var i,r,n=this._,o=(r=n,(t+"").trim().split(/^|\s+/).map((function(t){var e="",i=t.indexOf(".");if(i>=0&&(e=t.slice(i+1),t=t.slice(0,i)),t&&!r.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}}))),a=-1,s=o.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++a<s;)if(i=(t=o[a]).type)n[i]=$e(n[i],t.name,e);else if(null==e)for(i in n)n[i]=$e(n[i],t.name,null);return this}for(;++a<s;)if((i=(t=o[a]).type)&&(i=ke(n[i],t.name)))return i},copy:function(){var t={},e=this._;for(var i in e)t[i]=e[i].slice();return new xe(t)},call:function(t,e){if((i=arguments.length-2)>0)for(var i,r,n=new Array(i),o=0;o<i;++o)n[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=0,i=(r=this._[t]).length;o<i;++o)r[o].value.apply(e,n)},apply:function(t,e,i){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],n=0,o=r.length;n<o;++n)r[n].value.apply(e,i)}};var Ce="http://www.w3.org/1999/xhtml",Me={svg:"http://www.w3.org/2000/svg",xhtml:Ce,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function Se(t){var e=t+="",i=e.indexOf(":");return i>=0&&"xmlns"!==(e=t.slice(0,i))&&(t=t.slice(i+1)),Me.hasOwnProperty(e)?{space:Me[e],local:t}:t}function je(t){return function(){var e=this.ownerDocument,i=this.namespaceURI;return i===Ce&&e.documentElement.namespaceURI===Ce?e.createElement(t):e.createElementNS(i,t)}}function De(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function Oe(t){var e=Se(t);return(e.local?De:je)(e)}function ze(){}function Te(t){return null==t?ze:function(){return this.querySelector(t)}}function Ie(){return[]}function Re(t){return null==t?Ie:function(){return this.querySelectorAll(t)}}function _e(t){return function(){return function(t){return null==t?[]:Array.isArray(t)?t:Array.from(t)}(t.apply(this,arguments))}}function Ae(t){return function(){return this.matches(t)}}function Ne(t){return function(e){return e.matches(t)}}var Ue=Array.prototype.find;function Be(){return this.firstElementChild}var Le=Array.prototype.filter;function Ee(){return Array.from(this.children)}function Fe(t){return new Array(t.length)}function Pe(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.C=e}function qe(t,e,i,r,n,o){for(var a,s=0,l=e.length,c=o.length;s<c;++s)(a=e[s])?(a.C=o[s],r[s]=a):i[s]=new Pe(t,o[s]);for(;s<l;++s)(a=e[s])&&(n[s]=a)}function We(t,e,i,r,n,o,a){var s,l,c,d=new Map,h=e.length,u=o.length,p=new Array(h);for(s=0;s<h;++s)(l=e[s])&&(p[s]=c=a.call(l,l.C,s,e)+"",d.has(c)?n[s]=l:d.set(c,l));for(s=0;s<u;++s)c=a.call(t,o[s],s,o)+"",(l=d.get(c))?(r[s]=l,l.C=o[s],d.delete(c)):i[s]=new Pe(t,o[s]);for(s=0;s<h;++s)(l=e[s])&&d.get(p[s])===l&&(n[s]=l)}function He(t){return t.C}function Ve(t){return"object"==typeof t&&"length"in t?t:Array.from(t)}function Ye(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function Ge(t){return function(){this.removeAttribute(t)}}function Ke(t){return function(){this.removeAttributeNS(t.space,t.local)}}function Je(t,e){return function(){this.setAttribute(t,e)}}function Xe(t,e){return function(){this.setAttributeNS(t.space,t.local,e)}}function Ze(t,e){return function(){var i=e.apply(this,arguments);null==i?this.removeAttribute(t):this.setAttribute(t,i)}}function Qe(t,e){return function(){var i=e.apply(this,arguments);null==i?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,i)}}function ti(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function ei(t){return function(){this.style.removeProperty(t)}}function ii(t,e,i){return function(){this.style.setProperty(t,e,i)}}function ri(t,e,i){return function(){var r=e.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,i)}}function ni(t,e){return t.style.getPropertyValue(e)||ti(t).getComputedStyle(t,null).getPropertyValue(e)}function oi(t){return function(){delete this[t]}}function ai(t,e){return function(){this[t]=e}}function si(t,e){return function(){var i=e.apply(this,arguments);null==i?delete this[t]:this[t]=i}}function li(t){return t.trim().split(/^|\s+/)}function ci(t){return t.classList||new di(t)}function di(t){this._node=t,this._names=li(t.getAttribute("class")||"")}function hi(t,e){for(var i=ci(t),r=-1,n=e.length;++r<n;)i.add(e[r])}function ui(t,e){for(var i=ci(t),r=-1,n=e.length;++r<n;)i.remove(e[r])}function pi(t){return function(){hi(this,t)}}function fi(t){return function(){ui(this,t)}}function gi(t,e){return function(){(e.apply(this,arguments)?hi:ui)(this,t)}}function mi(){this.textContent=""}function vi(t){return function(){this.textContent=t}}function bi(t){return function(){var e=t.apply(this,arguments);this.textContent=e??""}}function yi(){this.innerHTML=""}function wi(t){return function(){this.innerHTML=t}}function xi(t){return function(){var e=t.apply(this,arguments);this.innerHTML=e??""}}function ki(){this.nextSibling&&this.parentNode.appendChild(this)}function $i(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function Ci(){return null}function Mi(){var t=this.parentNode;t&&t.removeChild(this)}function Si(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function ji(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Di(t){return function(){var e=this.O;if(e){for(var i,r=0,n=-1,o=e.length;r<o;++r)i=e[r],t.type&&i.type!==t.type||i.name!==t.name?e[++n]=i:this.removeEventListener(i.type,i.listener,i.options);++n?e.length=n:delete this.O}}}function Oi(t,e,i){return function(){var r,n=this.O,o=function(t){return function(e){t.call(this,e,this.C)}}(e);if(n)for(var a=0,s=n.length;a<s;++a)if((r=n[a]).type===t.type&&r.name===t.name)return this.removeEventListener(r.type,r.listener,r.options),this.addEventListener(r.type,r.listener=o,r.options=i),void(r.value=e);this.addEventListener(t.type,o,i),r={type:t.type,name:t.name,value:e,listener:o,options:i},n?n.push(r):this.O=[r]}}function zi(t,e,i){var r=ti(t),n=r.CustomEvent;"function"==typeof n?n=new n(e,i):(n=r.document.createEvent("Event"),i?(n.initEvent(e,i.bubbles,i.cancelable),n.detail=i.detail):n.initEvent(e,!1,!1)),t.dispatchEvent(n)}function Ti(t,e){return function(){return zi(this,t,e)}}function Ii(t,e){return function(){return zi(this,t,e.apply(this,arguments))}}Pe.prototype={constructor:Pe,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}},di.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var Ri=[null];function _i(t,e){this._groups=t,this._parents=e}function Ai(){return new _i([[document.documentElement]],Ri)}function Ni(t){return"string"==typeof t?new _i([[document.querySelector(t)]],[document.documentElement]):new _i([[t]],Ri)}function Ui(t,e,i){t.prototype=e.prototype=i,i.constructor=t}function Bi(t,e){var i=Object.create(t.prototype);for(var r in e)i[r]=e[r];return i}function Li(){}_i.prototype=Ai.prototype={constructor:_i,select:function(t){"function"!=typeof t&&(t=Te(t));for(var e=this._groups,i=e.length,r=new Array(i),n=0;n<i;++n)for(var o,a,s=e[n],l=s.length,c=r[n]=new Array(l),d=0;d<l;++d)(o=s[d])&&(a=t.call(o,o.C,d,s))&&("C"in o&&(a.C=o.C),c[d]=a);return new _i(r,this._parents)},selectAll:function(t){t="function"==typeof t?_e(t):Re(t);for(var e=this._groups,i=e.length,r=[],n=[],o=0;o<i;++o)for(var a,s=e[o],l=s.length,c=0;c<l;++c)(a=s[c])&&(r.push(t.call(a,a.C,c,s)),n.push(a));return new _i(r,n)},selectChild:function(t){return this.select(null==t?Be:function(t){return function(){return Ue.call(this.children,t)}}("function"==typeof t?t:Ne(t)))},selectChildren:function(t){return this.selectAll(null==t?Ee:function(t){return function(){return Le.call(this.children,t)}}("function"==typeof t?t:Ne(t)))},filter:function(t){"function"!=typeof t&&(t=Ae(t));for(var e=this._groups,i=e.length,r=new Array(i),n=0;n<i;++n)for(var o,a=e[n],s=a.length,l=r[n]=[],c=0;c<s;++c)(o=a[c])&&t.call(o,o.C,c,a)&&l.push(o);return new _i(r,this._parents)},data:function(t,e){if(!arguments.length)return Array.from(this,He);var i=e?We:qe,r=this._parents,n=this._groups;"function"!=typeof t&&(t=function(t){return function(){return t}}(t));for(var o=n.length,a=new Array(o),s=new Array(o),l=new Array(o),c=0;c<o;++c){var d=r[c],h=n[c],u=h.length,p=Ve(t.call(d,d&&d.C,c,r)),f=p.length,g=s[c]=new Array(f),m=a[c]=new Array(f);i(d,h,g,m,l[c]=new Array(u),p,e);for(var v,b,y=0,w=0;y<f;++y)if(v=g[y]){for(y>=w&&(w=y+1);!(b=m[w])&&++w<f;);v._next=b||null}}return(a=new _i(a,r))._enter=s,a._exit=l,a},enter:function(){return new _i(this._enter||this._groups.map(Fe),this._parents)},exit:function(){return new _i(this._exit||this._groups.map(Fe),this._parents)},join:function(t,e,i){var r=this.enter(),n=this,o=this.exit();return"function"==typeof t?(r=t(r))&&(r=r.selection()):r=r.append(t+""),null!=e&&(n=e(n))&&(n=n.selection()),null==i?o.remove():i(o),r&&n?r.merge(n).order():n},merge:function(t){for(var e=t.selection?t.selection():t,i=this._groups,r=e._groups,n=i.length,o=r.length,a=Math.min(n,o),s=new Array(n),l=0;l<a;++l)for(var c,d=i[l],h=r[l],u=d.length,p=s[l]=new Array(u),f=0;f<u;++f)(c=d[f]||h[f])&&(p[f]=c);for(;l<n;++l)s[l]=i[l];return new _i(s,this._parents)},selection:function(){return this},order:function(){for(var t=this._groups,e=-1,i=t.length;++e<i;)for(var r,n=t[e],o=n.length-1,a=n[o];--o>=0;)(r=n[o])&&(a&&4^r.compareDocumentPosition(a)&&a.parentNode.insertBefore(r,a),a=r);return this},sort:function(t){function e(e,i){return e&&i?t(e.C,i.C):!e-!i}t||(t=Ye);for(var i=this._groups,r=i.length,n=new Array(r),o=0;o<r;++o){for(var a,s=i[o],l=s.length,c=n[o]=new Array(l),d=0;d<l;++d)(a=s[d])&&(c[d]=a);c.sort(e)}return new _i(n,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){return Array.from(this)},node:function(){for(var t=this._groups,e=0,i=t.length;e<i;++e)for(var r=t[e],n=0,o=r.length;n<o;++n){var a=r[n];if(a)return a}return null},size:function(){let t=0;for(const e of this)++t;return t},empty:function(){return!this.node()},each:function(t){for(var e=this._groups,i=0,r=e.length;i<r;++i)for(var n,o=e[i],a=0,s=o.length;a<s;++a)(n=o[a])&&t.call(n,n.C,a,o);return this},attr:function(t,e){var i=Se(t);if(arguments.length<2){var r=this.node();return i.local?r.getAttributeNS(i.space,i.local):r.getAttribute(i)}return this.each((null==e?i.local?Ke:Ge:"function"==typeof e?i.local?Qe:Ze:i.local?Xe:Je)(i,e))},style:function(t,e,i){return arguments.length>1?this.each((null==e?ei:"function"==typeof e?ri:ii)(t,e,i??"")):ni(this.node(),t)},property:function(t,e){return arguments.length>1?this.each((null==e?oi:"function"==typeof e?si:ai)(t,e)):this.node()[t]},classed:function(t,e){var i=li(t+"");if(arguments.length<2){for(var r=ci(this.node()),n=-1,o=i.length;++n<o;)if(!r.contains(i[n]))return!1;return!0}return this.each(("function"==typeof e?gi:e?pi:fi)(i,e))},text:function(t){return arguments.length?this.each(null==t?mi:("function"==typeof t?bi:vi)(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?yi:("function"==typeof t?xi:wi)(t)):this.node().innerHTML},raise:function(){return this.each(ki)},lower:function(){return this.each($i)},append:function(t){var e="function"==typeof t?t:Oe(t);return this.select((function(){return this.appendChild(e.apply(this,arguments))}))},insert:function(t,e){var i="function"==typeof t?t:Oe(t),r=null==e?Ci:"function"==typeof e?e:Te(e);return this.select((function(){return this.insertBefore(i.apply(this,arguments),r.apply(this,arguments)||null)}))},remove:function(){return this.each(Mi)},clone:function(t){return this.select(t?ji:Si)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().C},on:function(t,e,i){var r,n,o=function(t){return t.trim().split(/^|\s+/).map((function(t){var e="",i=t.indexOf(".");return i>=0&&(e=t.slice(i+1),t=t.slice(0,i)),{type:t,name:e}}))}(t+""),a=o.length;if(!(arguments.length<2)){for(s=e?Oi:Di,r=0;r<a;++r)this.each(s(o[r],e,i));return this}var s=this.node().O;if(s)for(var l,c=0,d=s.length;c<d;++c)for(r=0,l=s[c];r<a;++r)if((n=o[r]).type===l.type&&n.name===l.name)return l.value},dispatch:function(t,e){return this.each(("function"==typeof e?Ii:Ti)(t,e))},[Symbol.iterator]:function*(){for(var t=this._groups,e=0,i=t.length;e<i;++e)for(var r,n=t[e],o=0,a=n.length;o<a;++o)(r=n[o])&&(yield r)}};var Ei=.7,Fi=1/Ei,Pi="\\s*([+-]?\\d+)\\s*",qi="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",Wi="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Hi=/^#([0-9a-f]{3,8})$/,Vi=new RegExp(`^rgb\\(${Pi},${Pi},${Pi}\\)$`),Yi=new RegExp(`^rgb\\(${Wi},${Wi},${Wi}\\)$`),Gi=new RegExp(`^rgba\\(${Pi},${Pi},${Pi},${qi}\\)$`),Ki=new RegExp(`^rgba\\(${Wi},${Wi},${Wi},${qi}\\)$`),Ji=new RegExp(`^hsl\\(${qi},${Wi},${Wi}\\)$`),Xi=new RegExp(`^hsla\\(${qi},${Wi},${Wi},${qi}\\)$`),Zi={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Qi(){return this.rgb().formatHex()}function tr(){return this.rgb().formatRgb()}function er(t){var e,i;return t=(t+"").trim().toLowerCase(),(e=Hi.exec(t))?(i=e[1].length,e=parseInt(e[1],16),6===i?ir(e):3===i?new or(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1):8===i?rr(e>>24&255,e>>16&255,e>>8&255,(255&e)/255):4===i?rr(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|240&e,((15&e)<<4|15&e)/255):null):(e=Vi.exec(t))?new or(e[1],e[2],e[3],1):(e=Yi.exec(t))?new or(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=Gi.exec(t))?rr(e[1],e[2],e[3],e[4]):(e=Ki.exec(t))?rr(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=Ji.exec(t))?hr(e[1],e[2]/100,e[3]/100,1):(e=Xi.exec(t))?hr(e[1],e[2]/100,e[3]/100,e[4]):Zi.hasOwnProperty(t)?ir(Zi[t]):"transparent"===t?new or(NaN,NaN,NaN,0):null}function ir(t){return new or(t>>16&255,t>>8&255,255&t,1)}function rr(t,e,i,r){return r<=0&&(t=e=i=NaN),new or(t,e,i,r)}function nr(t,e,i,r){return 1===arguments.length?function(t){return t instanceof Li||(t=er(t)),t?new or((t=t.rgb()).r,t.g,t.b,t.opacity):new or}(t):new or(t,e,i,r??1)}function or(t,e,i,r){this.r=+t,this.g=+e,this.b=+i,this.opacity=+r}function ar(){return`#${dr(this.r)}${dr(this.g)}${dr(this.b)}`}function sr(){const t=lr(this.opacity);return`${1===t?"rgb(":"rgba("}${cr(this.r)}, ${cr(this.g)}, ${cr(this.b)}${1===t?")":`, ${t})`}`}function lr(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function cr(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function dr(t){return((t=cr(t))<16?"0":"")+t.toString(16)}function hr(t,e,i,r){return r<=0?t=e=i=NaN:i<=0||i>=1?t=e=NaN:e<=0&&(t=NaN),new pr(t,e,i,r)}function ur(t){if(t instanceof pr)return new pr(t.h,t.s,t.l,t.opacity);if(t instanceof Li||(t=er(t)),!t)return new pr;if(t instanceof pr)return t;var e=(t=t.rgb()).r/255,i=t.g/255,r=t.b/255,n=Math.min(e,i,r),o=Math.max(e,i,r),a=NaN,s=o-n,l=(o+n)/2;return s?(a=e===o?(i-r)/s+6*(i<r):i===o?(r-e)/s+2:(e-i)/s+4,s/=l<.5?o+n:2-o-n,a*=60):s=l>0&&l<1?0:a,new pr(a,s,l,t.opacity)}function pr(t,e,i,r){this.h=+t,this.s=+e,this.l=+i,this.opacity=+r}function fr(t){return(t=(t||0)%360)<0?t+360:t}function gr(t){return Math.max(0,Math.min(1,t||0))}function mr(t,e,i){return 255*(t<60?e+(i-e)*t/60:t<180?i:t<240?e+(i-e)*(240-t)/60:e)}Ui(Li,er,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:Qi,formatHex:Qi,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return ur(this).formatHsl()},formatRgb:tr,toString:tr}),Ui(or,nr,Bi(Li,{brighter(t){return t=null==t?Fi:Math.pow(Fi,t),new or(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=null==t?Ei:Math.pow(Ei,t),new or(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new or(cr(this.r),cr(this.g),cr(this.b),lr(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:ar,formatHex:ar,formatHex8:function(){return`#${dr(this.r)}${dr(this.g)}${dr(this.b)}${dr(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:sr,toString:sr})),Ui(pr,(function(t,e,i,r){return 1===arguments.length?ur(t):new pr(t,e,i,r??1)}),Bi(Li,{brighter(t){return t=null==t?Fi:Math.pow(Fi,t),new pr(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=null==t?Ei:Math.pow(Ei,t),new pr(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,i=this.l,r=i+(i<.5?i:1-i)*e,n=2*i-r;return new or(mr(t>=240?t-240:t+120,n,r),mr(t,n,r),mr(t<120?t+240:t-120,n,r),this.opacity)},clamp(){return new pr(fr(this.h),gr(this.s),gr(this.l),lr(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=lr(this.opacity);return`${1===t?"hsl(":"hsla("}${fr(this.h)}, ${100*gr(this.s)}%, ${100*gr(this.l)}%${1===t?")":`, ${t})`}`}}));var vr=t=>()=>t;function br(t){return 1==(t=+t)?yr:function(e,i){return i-e?function(t,e,i){return t=Math.pow(t,i),e=Math.pow(e,i)-t,i=1/i,function(r){return Math.pow(t+r*e,i)}}(e,i,t):vr(isNaN(e)?i:e)}}function yr(t,e){var i=e-t;return i?function(t,e){return function(i){return t+i*e}}(t,i):vr(isNaN(t)?e:t)}var wr=function t(e){var i=br(e);function r(t,e){var r=i((t=nr(t)).r,(e=nr(e)).r),n=i(t.g,e.g),o=i(t.b,e.b),a=yr(t.opacity,e.opacity);return function(e){return t.r=r(e),t.g=n(e),t.b=o(e),t.opacity=a(e),t+""}}return r.gamma=t,r}(1);function xr(t,e){e||(e=[]);var i,r=t?Math.min(e.length,t.length):0,n=e.slice();return function(o){for(i=0;i<r;++i)n[i]=t[i]*(1-o)+e[i]*o;return n}}function kr(t,e){var i,r=e?e.length:0,n=t?Math.min(r,t.length):0,o=new Array(n),a=new Array(r);for(i=0;i<n;++i)o[i]=Or(t[i],e[i]);for(;i<r;++i)a[i]=e[i];return function(t){for(i=0;i<n;++i)a[i]=o[i](t);return a}}function $r(t,e){var i=new Date;return t=+t,e=+e,function(r){return i.setTime(t*(1-r)+e*r),i}}function Cr(t,e){return t=+t,e=+e,function(i){return t*(1-i)+e*i}}function Mr(t,e){var i,r={},n={};for(i in null!==t&&"object"==typeof t||(t={}),null!==e&&"object"==typeof e||(e={}),e)i in t?r[i]=Or(t[i],e[i]):n[i]=e[i];return function(t){for(i in r)n[i]=r[i](t);return n}}var Sr=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,jr=new RegExp(Sr.source,"g");function Dr(t,e){var i,r,n,o=Sr.lastIndex=jr.lastIndex=0,a=-1,s=[],l=[];for(t+="",e+="";(i=Sr.exec(t))&&(r=jr.exec(e));)(n=r.index)>o&&(n=e.slice(o,n),s[a]?s[a]+=n:s[++a]=n),(i=i[0])===(r=r[0])?s[a]?s[a]+=r:s[++a]=r:(s[++a]=null,l.push({i:a,x:Cr(i,r)})),o=jr.lastIndex;return o<e.length&&(n=e.slice(o),s[a]?s[a]+=n:s[++a]=n),s.length<2?l[0]?function(t){return function(e){return t(e)+""}}(l[0].x):function(t){return function(){return t}}(e):(e=l.length,function(t){for(var i,r=0;r<e;++r)s[(i=l[r]).i]=i.x(t);return s.join("")})}function Or(t,e){var i,r=typeof e;return null==e||"boolean"===r?vr(e):("number"===r?Cr:"string"===r?(i=er(e))?(e=i,wr):Dr:e instanceof er?wr:e instanceof Date?$r:function(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}(e)?xr:Array.isArray(e)?kr:"function"!=typeof e.valueOf&&"function"!=typeof e.toString||isNaN(e)?Mr:Cr)(t,e)}function zr(t,e){return t=+t,e=+e,function(i){return Math.round(t*(1-i)+e*i)}}var Tr,Ir=180/Math.PI,Rr={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function _r(t,e,i,r,n,o){var a,s,l;return(a=Math.sqrt(t*t+e*e))&&(t/=a,e/=a),(l=t*i+e*r)&&(i-=t*l,r-=e*l),(s=Math.sqrt(i*i+r*r))&&(i/=s,r/=s,l/=s),t*r<e*i&&(t=-t,e=-e,l=-l,a=-a),{translateX:n,translateY:o,rotate:Math.atan2(e,t)*Ir,skewX:Math.atan(l)*Ir,scaleX:a,scaleY:s}}function Ar(t,e,i,r){function n(t){return t.length?t.pop()+" ":""}return function(o,a){var s=[],l=[];return o=t(o),a=t(a),function(t,r,n,o,a,s){if(t!==n||r!==o){var l=a.push("translate(",null,e,null,i);s.push({i:l-4,x:Cr(t,n)},{i:l-2,x:Cr(r,o)})}else(n||o)&&a.push("translate("+n+e+o+i)}(o.translateX,o.translateY,a.translateX,a.translateY,s,l),function(t,e,i,o){t!==e?(t-e>180?e+=360:e-t>180&&(t+=360),o.push({i:i.push(n(i)+"rotate(",null,r)-2,x:Cr(t,e)})):e&&i.push(n(i)+"rotate("+e+r)}(o.rotate,a.rotate,s,l),function(t,e,i,o){t!==e?o.push({i:i.push(n(i)+"skewX(",null,r)-2,x:Cr(t,e)}):e&&i.push(n(i)+"skewX("+e+r)}(o.skewX,a.skewX,s,l),function(t,e,i,r,o,a){if(t!==i||e!==r){var s=o.push(n(o)+"scale(",null,",",null,")");a.push({i:s-4,x:Cr(t,i)},{i:s-2,x:Cr(e,r)})}else 1===i&&1===r||o.push(n(o)+"scale("+i+","+r+")")}(o.scaleX,o.scaleY,a.scaleX,a.scaleY,s,l),o=a=null,function(t){for(var e,i=-1,r=l.length;++i<r;)s[(e=l[i]).i]=e.x(t);return s.join("")}}}var Nr,Ur,Br=Ar((function(t){const e=new("function"==typeof DOMMatrix?DOMMatrix:WebKitCSSMatrix)(t+"");return e.isIdentity?Rr:_r(e.a,e.b,e.c,e.d,e.e,e.f)}),"px, ","px)","deg)"),Lr=Ar((function(t){return null==t?Rr:(Tr||(Tr=document.createElementNS("http://www.w3.org/2000/svg","g")),Tr.setAttribute("transform",t),(t=Tr.transform.baseVal.consolidate())?_r((t=t.matrix).a,t.b,t.c,t.d,t.e,t.f):Rr)}),", ",")",")"),Er=0,Fr=0,Pr=0,qr=1e3,Wr=0,Hr=0,Vr=0,Yr="object"==typeof performance&&performance.now?performance:Date,Gr="object"==typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function Kr(){return Hr||(Gr(Jr),Hr=Yr.now()+Vr)}function Jr(){Hr=0}function Xr(){this._call=this._time=this._next=null}function Zr(t,e,i){var r=new Xr;return r.restart(t,e,i),r}function Qr(){Hr=(Wr=Yr.now())+Vr,Er=Fr=0;try{!function(){Kr(),++Er;for(var t,e=Nr;e;)(t=Hr-e._time)>=0&&e._call.call(void 0,t),e=e._next;--Er}()}finally{Er=0,function(){var t,e,i=Nr,r=1/0;for(;i;)i._call?(r>i._time&&(r=i._time),t=i,i=i._next):(e=i._next,i._next=null,i=t?t._next=e:Nr=e);Ur=t,en(r)}(),Hr=0}}function tn(){var t=Yr.now(),e=t-Wr;e>qr&&(Vr-=e,Wr=t)}function en(t){Er||(Fr&&(Fr=clearTimeout(Fr)),t-Hr>24?(t<1/0&&(Fr=setTimeout(Qr,t-Yr.now()-Vr)),Pr&&(Pr=clearInterval(Pr))):(Pr||(Wr=Yr.now(),Pr=setInterval(tn,qr)),Er=1,Gr(Qr)))}function rn(t,e,i){var r=new Xr;return e=null==e?0:+e,r.restart((i=>{r.stop(),t(i+e)}),e,i),r}Xr.prototype=Zr.prototype={constructor:Xr,restart:function(t,e,i){if("function"!=typeof t)throw new TypeError("callback is not a function");i=(null==i?Kr():+i)+(null==e?0:+e),this._next||Ur===this||(Ur?Ur._next=this:Nr=this,Ur=this),this._call=t,this._time=i,en()},stop:function(){this._call&&(this._call=null,this._time=1/0,en())}};var nn=we("start","end","cancel","interrupt"),on=[],an=0,sn=1,ln=2,cn=3,dn=4,hn=5,un=6;function pn(t,e,i,r,n,o){var a=t.I;if(a){if(i in a)return}else t.I={};!function(t,e,i){var r,n=t.I;function o(t){i.state=sn,i.timer.restart(a,i.delay,i.time),i.delay<=t&&a(t-i.delay)}function a(o){var c,d,h,u;if(i.state!==sn)return l();for(c in n)if((u=n[c]).name===i.name){if(u.state===cn)return rn(a);u.state===dn?(u.state=un,u.timer.stop(),u.on.call("interrupt",t,t.C,u.index,u.group),delete n[c]):+c<e&&(u.state=un,u.timer.stop(),u.on.call("cancel",t,t.C,u.index,u.group),delete n[c])}if(rn((function(){i.state===cn&&(i.state=dn,i.timer.restart(s,i.delay,i.time),s(o))})),i.state=ln,i.on.call("start",t,t.C,i.index,i.group),i.state===ln){for(i.state=cn,r=new Array(h=i.tween.length),c=0,d=-1;c<h;++c)(u=i.tween[c].value.call(t,t.C,i.index,i.group))&&(r[++d]=u);r.length=d+1}}function s(e){for(var n=e<i.duration?i.ease.call(null,e/i.duration):(i.timer.restart(l),i.state=hn,1),o=-1,a=r.length;++o<a;)r[o].call(t,n);i.state===hn&&(i.on.call("end",t,t.C,i.index,i.group),l())}function l(){for(var r in i.state=un,i.timer.stop(),delete n[e],n)return;delete t.I}n[e]=i,i.timer=Zr(o,0,i.time)}(t,i,{name:e,index:r,group:n,on:nn,tween:on,time:o.time,delay:o.delay,duration:o.duration,ease:o.ease,timer:null,state:an})}function fn(t,e){var i=mn(t,e);if(i.state>an)throw new Error("too late; already scheduled");return i}function gn(t,e){var i=mn(t,e);if(i.state>cn)throw new Error("too late; already running");return i}function mn(t,e){var i=t.I;if(!i||!(i=i[e]))throw new Error("transition not found");return i}function vn(t,e){var i,r;return function(){var n=gn(this,t),o=n.tween;if(o!==i)for(var a=0,s=(r=i=o).length;a<s;++a)if(r[a].name===e){(r=r.slice()).splice(a,1);break}n.tween=r}}function bn(t,e,i){var r,n;if("function"!=typeof i)throw new Error;return function(){var o=gn(this,t),a=o.tween;if(a!==r){n=(r=a).slice();for(var s={name:e,value:i},l=0,c=n.length;l<c;++l)if(n[l].name===e){n[l]=s;break}l===c&&n.push(s)}o.tween=n}}function yn(t,e,i){var r=t._id;return t.each((function(){var t=gn(this,r);(t.value||(t.value={}))[e]=i.apply(this,arguments)})),function(t){return mn(t,r).value[e]}}function wn(t,e){var i;return("number"==typeof e?Cr:e instanceof er?wr:(i=er(e))?(e=i,wr):Dr)(t,e)}function xn(t){return function(){this.removeAttribute(t)}}function kn(t){return function(){this.removeAttributeNS(t.space,t.local)}}function $n(t,e,i){var r,n,o=i+"";return function(){var a=this.getAttribute(t);return a===o?null:a===r?n:n=e(r=a,i)}}function Cn(t,e,i){var r,n,o=i+"";return function(){var a=this.getAttributeNS(t.space,t.local);return a===o?null:a===r?n:n=e(r=a,i)}}function Mn(t,e,i){var r,n,o;return function(){var a,s,l=i(this);if(null!=l)return(a=this.getAttribute(t))===(s=l+"")?null:a===r&&s===n?o:(n=s,o=e(r=a,l));this.removeAttribute(t)}}function Sn(t,e,i){var r,n,o;return function(){var a,s,l=i(this);if(null!=l)return(a=this.getAttributeNS(t.space,t.local))===(s=l+"")?null:a===r&&s===n?o:(n=s,o=e(r=a,l));this.removeAttributeNS(t.space,t.local)}}function jn(t,e){var i,r;function n(){var n=e.apply(this,arguments);return n!==r&&(i=(r=n)&&function(t,e){return function(i){this.setAttributeNS(t.space,t.local,e.call(this,i))}}(t,n)),i}return n._value=e,n}function Dn(t,e){var i,r;function n(){var n=e.apply(this,arguments);return n!==r&&(i=(r=n)&&function(t,e){return function(i){this.setAttribute(t,e.call(this,i))}}(t,n)),i}return n._value=e,n}function On(t,e){return function(){fn(this,t).delay=+e.apply(this,arguments)}}function zn(t,e){return e=+e,function(){fn(this,t).delay=e}}function Tn(t,e){return function(){gn(this,t).duration=+e.apply(this,arguments)}}function In(t,e){return e=+e,function(){gn(this,t).duration=e}}var Rn=Ai.prototype.constructor;function _n(t){return function(){this.style.removeProperty(t)}}var An=0;function Nn(t,e,i,r){this._groups=t,this._parents=e,this._name=i,this._id=r}function Un(){return++An}var Bn=Ai.prototype;Nn.prototype={constructor:Nn,select:function(t){var e=this._name,i=this._id;"function"!=typeof t&&(t=Te(t));for(var r=this._groups,n=r.length,o=new Array(n),a=0;a<n;++a)for(var s,l,c=r[a],d=c.length,h=o[a]=new Array(d),u=0;u<d;++u)(s=c[u])&&(l=t.call(s,s.C,u,c))&&("C"in s&&(l.C=s.C),h[u]=l,pn(h[u],e,i,u,h,mn(s,i)));return new Nn(o,this._parents,e,i)},selectAll:function(t){var e=this._name,i=this._id;"function"!=typeof t&&(t=Re(t));for(var r=this._groups,n=r.length,o=[],a=[],s=0;s<n;++s)for(var l,c=r[s],d=c.length,h=0;h<d;++h)if(l=c[h]){for(var u,p=t.call(l,l.C,h,c),f=mn(l,i),g=0,m=p.length;g<m;++g)(u=p[g])&&pn(u,e,i,g,p,f);o.push(p),a.push(l)}return new Nn(o,a,e,i)},selectChild:Bn.selectChild,selectChildren:Bn.selectChildren,filter:function(t){"function"!=typeof t&&(t=Ae(t));for(var e=this._groups,i=e.length,r=new Array(i),n=0;n<i;++n)for(var o,a=e[n],s=a.length,l=r[n]=[],c=0;c<s;++c)(o=a[c])&&t.call(o,o.C,c,a)&&l.push(o);return new Nn(r,this._parents,this._name,this._id)},merge:function(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,i=t._groups,r=e.length,n=i.length,o=Math.min(r,n),a=new Array(r),s=0;s<o;++s)for(var l,c=e[s],d=i[s],h=c.length,u=a[s]=new Array(h),p=0;p<h;++p)(l=c[p]||d[p])&&(u[p]=l);for(;s<r;++s)a[s]=e[s];return new Nn(a,this._parents,this._name,this._id)},selection:function(){return new Rn(this._groups,this._parents)},transition:function(){for(var t=this._name,e=this._id,i=Un(),r=this._groups,n=r.length,o=0;o<n;++o)for(var a,s=r[o],l=s.length,c=0;c<l;++c)if(a=s[c]){var d=mn(a,e);pn(a,t,i,c,s,{time:d.time+d.delay+d.duration,delay:0,duration:d.duration,ease:d.ease})}return new Nn(r,this._parents,t,i)},call:Bn.call,nodes:Bn.nodes,node:Bn.node,size:Bn.size,empty:Bn.empty,each:Bn.each,on:function(t,e){var i=this._id;return arguments.length<2?mn(this.node(),i).on.on(t):this.each(function(t,e,i){var r,n,o=function(t){return(t+"").trim().split(/^|\s+/).every((function(t){var e=t.indexOf(".");return e>=0&&(t=t.slice(0,e)),!t||"start"===t}))}(e)?fn:gn;return function(){var a=o(this,t),s=a.on;s!==r&&(n=(r=s).copy()).on(e,i),a.on=n}}(i,t,e))},attr:function(t,e){var i=Se(t),r="transform"===i?Lr:wn;return this.attrTween(t,"function"==typeof e?(i.local?Sn:Mn)(i,r,yn(this,"attr."+t,e)):null==e?(i.local?kn:xn)(i):(i.local?Cn:$n)(i,r,e))},attrTween:function(t,e){var i="attr."+t;if(arguments.length<2)return(i=this.tween(i))&&i._value;if(null==e)return this.tween(i,null);if("function"!=typeof e)throw new Error;var r=Se(t);return this.tween(i,(r.local?jn:Dn)(r,e))},style:function(t,e,i){var r="transform"==(t+="")?Br:wn;return null==e?this.styleTween(t,function(t,e){var i,r,n;return function(){var o=ni(this,t),a=(this.style.removeProperty(t),ni(this,t));return o===a?null:o===i&&a===r?n:n=e(i=o,r=a)}}(t,r)).on("end.style."+t,_n(t)):"function"==typeof e?this.styleTween(t,function(t,e,i){var r,n,o;return function(){var a=ni(this,t),s=i(this),l=s+"";return null==s&&(this.style.removeProperty(t),l=s=ni(this,t)),a===l?null:a===r&&l===n?o:(n=l,o=e(r=a,s))}}(t,r,yn(this,"style."+t,e))).each(function(t,e){var i,r,n,o,a="style."+e,s="end."+a;return function(){var l=gn(this,t),c=l.on,d=null==l.value[a]?o||(o=_n(e)):void 0;c===i&&n===d||(r=(i=c).copy()).on(s,n=d),l.on=r}}(this._id,t)):this.styleTween(t,function(t,e,i){var r,n,o=i+"";return function(){var a=ni(this,t);return a===o?null:a===r?n:n=e(r=a,i)}}(t,r,e),i).on("end.style."+t,null)},styleTween:function(t,e,i){var r="style."+(t+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==e)return this.tween(r,null);if("function"!=typeof e)throw new Error;return this.tween(r,function(t,e,i){var r,n;function o(){var o=e.apply(this,arguments);return o!==n&&(r=(n=o)&&function(t,e,i){return function(r){this.style.setProperty(t,e.call(this,r),i)}}(t,o,i)),r}return o._value=e,o}(t,e,i??""))},text:function(t){return this.tween("text","function"==typeof t?function(t){return function(){var e=t(this);this.textContent=e??""}}(yn(this,"text",t)):function(t){return function(){this.textContent=t}}(null==t?"":t+""))},textTween:function(t){var e="text";if(arguments.length<1)return(e=this.tween(e))&&e._value;if(null==t)return this.tween(e,null);if("function"!=typeof t)throw new Error;return this.tween(e,function(t){var e,i;function r(){var r=t.apply(this,arguments);return r!==i&&(e=(i=r)&&function(t){return function(e){this.textContent=t.call(this,e)}}(r)),e}return r._value=t,r}(t))},remove:function(){return this.on("end.remove",function(t){return function(){var e=this.parentNode;for(var i in this.I)if(+i!==t)return;e&&e.removeChild(this)}}(this._id))},tween:function(t,e){var i=this._id;if(t+="",arguments.length<2){for(var r,n=mn(this.node(),i).tween,o=0,a=n.length;o<a;++o)if((r=n[o]).name===t)return r.value;return null}return this.each((null==e?vn:bn)(i,t,e))},delay:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?On:zn)(e,t)):mn(this.node(),e).delay},duration:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?Tn:In)(e,t)):mn(this.node(),e).duration},ease:function(t){var e=this._id;return arguments.length?this.each(function(t,e){if("function"!=typeof e)throw new Error;return function(){gn(this,t).ease=e}}(e,t)):mn(this.node(),e).ease},easeVarying:function(t){if("function"!=typeof t)throw new Error;return this.each(function(t,e){return function(){var i=e.apply(this,arguments);if("function"!=typeof i)throw new Error;gn(this,t).ease=i}}(this._id,t))},end:function(){var t,e,i=this,r=i._id,n=i.size();return new Promise((function(o,a){var s={value:a},l={value:function(){0==--n&&o()}};i.each((function(){var i=gn(this,r),n=i.on;n!==t&&((e=(t=n).copy())._.cancel.push(s),e._.interrupt.push(s),e._.end.push(l)),i.on=e})),0===n&&o()}))},[Symbol.iterator]:Bn[Symbol.iterator]};var Ln={time:null,delay:0,duration:250,ease:function(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}};function En(t,e){for(var i;!(i=t.I)||!(i=i[e]);)if(!(t=t.parentNode))throw new Error(`transition ${e} not found`);return i}function Fn(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);if(204!==t.status&&205!==t.status)return t.json()}function Pn(t,e){if((i=(t=e?t.toExponential(e-1):t.toExponential()).indexOf("e"))<0)return null;var i,r=t.slice(0,i);return[r.length>1?r[0]+r.slice(2):r,+t.slice(i+1)]}function qn(t){return(t=Pn(Math.abs(t)))?t[1]:NaN}Ai.prototype.interrupt=function(t){return this.each((function(){!function(t,e){var i,r,n,o=t.I,a=!0;if(o){for(n in e=null==e?null:e+"",o)(i=o[n]).name===e?(r=i.state>ln&&i.state<hn,i.state=un,i.timer.stop(),i.on.call(r?"interrupt":"cancel",t,t.C,i.index,i.group),delete o[n]):a=!1;a&&delete t.I}}(this,t)}))},Ai.prototype.transition=function(t){var e,i;t instanceof Nn?(e=t._id,t=t._name):(e=Un(),(i=Ln).time=Kr(),t=null==t?null:t+"");for(var r=this._groups,n=r.length,o=0;o<n;++o)for(var a,s=r[o],l=s.length,c=0;c<l;++c)(a=s[c])&&pn(a,t,e,c,s,i||En(a,e));return new Nn(r,this._parents,t,e)};var Wn,Hn=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Vn(t){if(!(e=Hn.exec(t)))throw new Error("invalid format: "+t);var e;return new Yn({fill:e[1],align:e[2],sign:e[3],symbol:e[4],zero:e[5],width:e[6],comma:e[7],precision:e[8]&&e[8].slice(1),trim:e[9],type:e[10]})}function Yn(t){this.fill=void 0===t.fill?" ":t.fill+"",this.align=void 0===t.align?">":t.align+"",this.sign=void 0===t.sign?"-":t.sign+"",this.symbol=void 0===t.symbol?"":t.symbol+"",this.zero=!!t.zero,this.width=void 0===t.width?void 0:+t.width,this.comma=!!t.comma,this.precision=void 0===t.precision?void 0:+t.precision,this.trim=!!t.trim,this.type=void 0===t.type?"":t.type+""}function Gn(t,e){var i=Pn(t,e);if(!i)return t+"";var r=i[0],n=i[1];return n<0?"0."+new Array(-n).join("0")+r:r.length>n+1?r.slice(0,n+1)+"."+r.slice(n+1):r+new Array(n-r.length+2).join("0")}Vn.prototype=Yn.prototype,Yn.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};var Kn={"%":(t,e)=>(100*t).toFixed(e),b:t=>Math.round(t).toString(2),c:t=>t+"",d:function(t){return Math.abs(t=Math.round(t))>=1e21?t.toLocaleString("en").replace(/,/g,""):t.toString(10)},e:(t,e)=>t.toExponential(e),f:(t,e)=>t.toFixed(e),g:(t,e)=>t.toPrecision(e),o:t=>Math.round(t).toString(8),p:(t,e)=>Gn(100*t,e),r:Gn,s:function(t,e){var i=Pn(t,e);if(!i)return t+"";var r=i[0],n=i[1],o=n-(Wn=3*Math.max(-8,Math.min(8,Math.floor(n/3))))+1,a=r.length;return o===a?r:o>a?r+new Array(o-a+1).join("0"):o>0?r.slice(0,o)+"."+r.slice(o):"0."+new Array(1-o).join("0")+Pn(t,Math.max(0,e+o-1))[0]},X:t=>Math.round(t).toString(16).toUpperCase(),x:t=>Math.round(t).toString(16)};function Jn(t){return t}var Xn,Zn,Qn,to=Array.prototype.map,eo=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function io(t){var e,i,r=void 0===t.grouping||void 0===t.thousands?Jn:(e=to.call(t.grouping,Number),i=t.thousands+"",function(t,r){for(var n=t.length,o=[],a=0,s=e[0],l=0;n>0&&s>0&&(l+s+1>r&&(s=Math.max(1,r-l)),o.push(t.substring(n-=s,n+s)),!((l+=s+1)>r));)s=e[a=(a+1)%e.length];return o.reverse().join(i)}),n=void 0===t.currency?"":t.currency[0]+"",o=void 0===t.currency?"":t.currency[1]+"",a=void 0===t.decimal?".":t.decimal+"",s=void 0===t.numerals?Jn:function(t){return function(e){return e.replace(/[0-9]/g,(function(e){return t[+e]}))}}(to.call(t.numerals,String)),l=void 0===t.percent?"%":t.percent+"",c=void 0===t.minus?"−":t.minus+"",d=void 0===t.nan?"NaN":t.nan+"";function h(t){var e=(t=Vn(t)).fill,i=t.align,h=t.sign,u=t.symbol,p=t.zero,f=t.width,g=t.comma,m=t.precision,v=t.trim,b=t.type;"n"===b?(g=!0,b="g"):Kn[b]||(void 0===m&&(m=12),v=!0,b="g"),(p||"0"===e&&"="===i)&&(p=!0,e="0",i="=");var y="$"===u?n:"#"===u&&/[boxX]/.test(b)?"0"+b.toLowerCase():"",w="$"===u?o:/[%p]/.test(b)?l:"",x=Kn[b],k=/[defgprs%]/.test(b);function $(t){var n,o,l,u=y,$=w;if("c"===b)$=x(t)+$,t="";else{var C=(t=+t)<0||1/t<0;if(t=isNaN(t)?d:x(Math.abs(t),m),v&&(t=function(t){t:for(var e,i=t.length,r=1,n=-1;r<i;++r)switch(t[r]){case".":n=e=r;break;case"0":0===n&&(n=r),e=r;break;default:if(!+t[r])break t;n>0&&(n=0)}return n>0?t.slice(0,n)+t.slice(e+1):t}(t)),C&&0==+t&&"+"!==h&&(C=!1),u=(C?"("===h?h:c:"-"===h||"("===h?"":h)+u,$=("s"===b?eo[8+Wn/3]:"")+$+(C&&"("===h?")":""),k)for(n=-1,o=t.length;++n<o;)if(48>(l=t.charCodeAt(n))||l>57){$=(46===l?a+t.slice(n+1):t.slice(n))+$,t=t.slice(0,n);break}}g&&!p&&(t=r(t,1/0));var M=u.length+t.length+$.length,S=M<f?new Array(f-M+1).join(e):"";switch(g&&p&&(t=r(S+t,S.length?f-$.length:1/0),S=""),i){case"<":t=u+t+$+S;break;case"=":t=u+S+t+$;break;case"^":t=S.slice(0,M=S.length>>1)+u+t+$+S.slice(M);break;default:t=S+u+t+$}return s(t)}return m=void 0===m?6:/[gprs]/.test(b)?Math.max(1,Math.min(21,m)):Math.max(0,Math.min(20,m)),$.toString=function(){return t+""},$}return{format:h,formatPrefix:function(t,e){var i=h(((t=Vn(t)).type="f",t)),r=3*Math.max(-8,Math.min(8,Math.floor(qn(e)/3))),n=Math.pow(10,-r),o=eo[8+r/3];return function(t){return i(n*t)+o}}}}Xn=io({thousands:",",grouping:[3],currency:["$",""]}),Zn=Xn.format,Qn=Xn.formatPrefix;var ro=1e-6,no=1e-12,oo=Math.PI,ao=oo/2,so=oo/4,lo=2*oo,co=180/oo,ho=oo/180,uo=Math.abs,po=Math.atan,fo=Math.atan2,go=Math.cos,mo=Math.exp,vo=Math.log,bo=Math.sin,yo=Math.sign||function(t){return t>0?1:t<0?-1:0},wo=Math.sqrt,xo=Math.tan;function ko(t){return t>1?ao:t<-1?-ao:Math.asin(t)}function $o(){}function Co(t,e){t&&So.hasOwnProperty(t.type)&&So[t.type](t,e)}var Mo={Feature:function(t,e){Co(t.geometry,e)},FeatureCollection:function(t,e){for(var i=t.features,r=-1,n=i.length;++r<n;)Co(i[r].geometry,e)}},So={Sphere:function(t,e){e.sphere()},Point:function(t,e){t=t.coordinates,e.point(t[0],t[1],t[2])},MultiPoint:function(t,e){for(var i=t.coordinates,r=-1,n=i.length;++r<n;)t=i[r],e.point(t[0],t[1],t[2])},LineString:function(t,e){jo(t.coordinates,e,0)},MultiLineString:function(t,e){for(var i=t.coordinates,r=-1,n=i.length;++r<n;)jo(i[r],e,0)},Polygon:function(t,e){Do(t.coordinates,e)},MultiPolygon:function(t,e){for(var i=t.coordinates,r=-1,n=i.length;++r<n;)Do(i[r],e)},GeometryCollection:function(t,e){for(var i=t.geometries,r=-1,n=i.length;++r<n;)Co(i[r],e)}};function jo(t,e,i){var r,n=-1,o=t.length-i;for(e.lineStart();++n<o;)r=t[n],e.point(r[0],r[1],r[2]);e.lineEnd()}function Do(t,e){var i=-1,r=t.length;for(e.polygonStart();++i<r;)jo(t[i],e,1);e.polygonEnd()}function Oo(t,e){t&&Mo.hasOwnProperty(t.type)?Mo[t.type](t,e):Co(t,e)}function zo(t){return[fo(t[1],t[0]),ko(t[2])]}function To(t){var e=t[0],i=t[1],r=go(i);return[r*go(e),r*bo(e),bo(i)]}function Io(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Ro(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function _o(t,e){t[0]+=e[0],t[1]+=e[1],t[2]+=e[2]}function Ao(t,e){return[t[0]*e,t[1]*e,t[2]*e]}function No(t){var e=wo(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]/=e,t[1]/=e,t[2]/=e}function Uo(t,e){function i(i,r){return i=t(i,r),e(i[0],i[1])}return t.invert&&e.invert&&(i.invert=function(i,r){return(i=e.invert(i,r))&&t.invert(i[0],i[1])}),i}function Bo(t,e){return uo(t)>oo&&(t-=Math.round(t/lo)*lo),[t,e]}function Lo(t,e,i){return(t%=lo)?e||i?Uo(Fo(t),Po(e,i)):Fo(t):e||i?Po(e,i):Bo}function Eo(t){return function(e,i){return uo(e+=t)>oo&&(e-=Math.round(e/lo)*lo),[e,i]}}function Fo(t){var e=Eo(t);return e.invert=Eo(-t),e}function Po(t,e){var i=go(t),r=bo(t),n=go(e),o=bo(e);function a(t,e){var a=go(e),s=go(t)*a,l=bo(t)*a,c=bo(e),d=c*i+s*r;return[fo(l*n-d*o,s*i-c*r),ko(d*n+l*o)]}return a.invert=function(t,e){var a=go(e),s=go(t)*a,l=bo(t)*a,c=bo(e),d=c*n-l*o;return[fo(l*n+c*o,s*i+d*r),ko(d*i-s*r)]},a}function qo(t,e){(e=To(e))[0]-=t,No(e);var i=function(t){return t>1?0:t<-1?oo:Math.acos(t)}(-e[1]);return((-e[2]<0?-i:i)+lo-ro)%lo}function Wo(){var t,e=[];return{point:function(e,i,r){t.push([e,i,r])},lineStart:function(){e.push(t=[])},lineEnd:$o,rejoin:function(){e.length>1&&e.push(e.pop().concat(e.shift()))},result:function(){var i=e;return e=[],t=null,i}}}function Ho(t,e){return uo(t[0]-e[0])<ro&&uo(t[1]-e[1])<ro}function Vo(t,e,i,r){this.x=t,this.z=e,this.o=i,this.e=r,this.v=!1,this.n=this.p=null}function Yo(t,e,i,r,n){var o,a,s=[],l=[];if(t.forEach((function(t){if(!((e=t.length-1)<=0)){var e,i,r=t[0],a=t[e];if(Ho(r,a)){if(!r[2]&&!a[2]){for(n.lineStart(),o=0;o<e;++o)n.point((r=t[o])[0],r[1]);return void n.lineEnd()}a[0]+=2*ro}s.push(i=new Vo(r,t,null,!0)),l.push(i.o=new Vo(r,null,i,!1)),s.push(i=new Vo(a,t,null,!1)),l.push(i.o=new Vo(a,null,i,!0))}})),s.length){for(l.sort(e),Go(s),Go(l),o=0,a=l.length;o<a;++o)l[o].e=i=!i;for(var c,d,h=s[0];;){for(var u=h,p=!0;u.v;)if((u=u.n)===h)return;c=u.z,n.lineStart();do{if(u.v=u.o.v=!0,u.e){if(p)for(o=0,a=c.length;o<a;++o)n.point((d=c[o])[0],d[1]);else r(u.x,u.n.x,1,n);u=u.n}else{if(p)for(c=u.p.z,o=c.length-1;o>=0;--o)n.point((d=c[o])[0],d[1]);else r(u.x,u.p.x,-1,n);u=u.p}c=(u=u.o).z,p=!p}while(!u.v);n.lineEnd()}}}function Go(t){if(e=t.length){for(var e,i,r=0,n=t[0];++r<e;)n.n=i=t[r],i.p=n,n=i;n.n=i=t[0],i.p=n}}function Ko(t){return uo(t[0])<=oo?t[0]:yo(t[0])*((uo(t[0])+oo)%lo-oo)}function Jo(t,e,i,r){return function(n){var o,a,s,l=e(n),c=Wo(),d=e(c),h=!1,u={point:p,lineStart:g,lineEnd:m,polygonStart:function(){u.point=v,u.lineStart=b,u.lineEnd=y,a=[],o=[]},polygonEnd:function(){u.point=p,u.lineStart=g,u.lineEnd=m,a=be(a);var t=function(t,e){var i=Ko(e),r=e[1],n=bo(r),o=[bo(i),-go(i),0],a=0,s=0,l=new ue;1===n?r=ao+ro:-1===n&&(r=-ao-ro);for(var c=0,d=t.length;c<d;++c)if(u=(h=t[c]).length)for(var h,u,p=h[u-1],f=Ko(p),g=p[1]/2+so,m=bo(g),v=go(g),b=0;b<u;++b,f=w,m=k,v=$,p=y){var y=h[b],w=Ko(y),x=y[1]/2+so,k=bo(x),$=go(x),C=w-f,M=C>=0?1:-1,S=M*C,j=S>oo,D=m*k;if(l.add(fo(D*M*bo(S),v*$+D*go(S))),a+=j?C+M*lo:C,j^f>=i^w>=i){var O=Ro(To(p),To(y));No(O);var z=Ro(o,O);No(z);var T=(j^C>=0?-1:1)*ko(z[2]);(r>T||r===T&&(O[0]||O[1]))&&(s+=j^C>=0?1:-1)}}return(a<-ro||a<ro&&l<-no)^1&s}(o,r);a.length?(h||(n.polygonStart(),h=!0),Yo(a,Zo,t,i,n)):t&&(h||(n.polygonStart(),h=!0),n.lineStart(),i(null,null,1,n),n.lineEnd()),h&&(n.polygonEnd(),h=!1),a=o=null},sphere:function(){n.polygonStart(),n.lineStart(),i(null,null,1,n),n.lineEnd(),n.polygonEnd()}};function p(e,i){t(e,i)&&n.point(e,i)}function f(t,e){l.point(t,e)}function g(){u.point=f,l.lineStart()}function m(){u.point=p,l.lineEnd()}function v(t,e){s.push([t,e]),d.point(t,e)}function b(){d.lineStart(),s=[]}function y(){v(s[0][0],s[0][1]),d.lineEnd();var t,e,i,r,l=d.clean(),u=c.result(),p=u.length;if(s.pop(),o.push(s),s=null,p)if(1&l){if((e=(i=u[0]).length-1)>0){for(h||(n.polygonStart(),h=!0),n.lineStart(),t=0;t<e;++t)n.point((r=i[t])[0],r[1]);n.lineEnd()}}else p>1&&2&l&&u.push(u.pop().concat(u.shift())),a.push(u.filter(Xo))}return u}}function Xo(t){return t.length>1}function Zo(t,e){return((t=t.x)[0]<0?t[1]-ao-ro:ao-t[1])-((e=e.x)[0]<0?e[1]-ao-ro:ao-e[1])}Bo.invert=Bo;var Qo=Jo((function(){return!0}),(function(t){var e,i=NaN,r=NaN,n=NaN;return{lineStart:function(){t.lineStart(),e=1},point:function(o,a){var s=o>0?oo:-oo,l=uo(o-i);uo(l-oo)<ro?(t.point(i,r=(r+a)/2>0?ao:-ao),t.point(n,r),t.lineEnd(),t.lineStart(),t.point(s,r),t.point(o,r),e=0):n!==s&&l>=oo&&(uo(i-n)<ro&&(i-=n*ro),uo(o-s)<ro&&(o-=s*ro),r=function(t,e,i,r){var n,o,a=bo(t-i);return uo(a)>ro?po((bo(e)*(o=go(r))*bo(i)-bo(r)*(n=go(e))*bo(t))/(n*o*a)):(e+r)/2}(i,r,o,a),t.point(n,r),t.lineEnd(),t.lineStart(),t.point(s,r),e=0),t.point(i=o,r=a),n=s},lineEnd:function(){t.lineEnd(),i=r=NaN},clean:function(){return 2-e}}}),(function(t,e,i,r){var n;if(null==t)n=i*ao,r.point(-oo,n),r.point(0,n),r.point(oo,n),r.point(oo,0),r.point(oo,-n),r.point(0,-n),r.point(-oo,-n),r.point(-oo,0),r.point(-oo,n);else if(uo(t[0]-e[0])>ro){var o=t[0]<e[0]?oo:-oo;n=i*o/2,r.point(-o,n),r.point(0,n),r.point(o,n)}else r.point(e[0],e[1])}),[-oo,-ao]);function ta(t){var e=go(t),i=6*ho,r=e>0,n=uo(e)>ro;function o(t,i){return go(t)*go(i)>e}function a(t,i,r){var n=[1,0,0],o=Ro(To(t),To(i)),a=Io(o,o),s=o[0],l=a-s*s;if(!l)return!r&&t;var c=e*a/l,d=-e*s/l,h=Ro(n,o),u=Ao(n,c);_o(u,Ao(o,d));var p=h,f=Io(u,p),g=Io(p,p),m=f*f-g*(Io(u,u)-1);if(!(m<0)){var v=wo(m),b=Ao(p,(-f-v)/g);if(_o(b,u),b=zo(b),!r)return b;var y,w=t[0],x=i[0],k=t[1],$=i[1];x<w&&(y=w,w=x,x=y);var C=x-w,M=uo(C-oo)<ro;if(!M&&$<k&&(y=k,k=$,$=y),M||C<ro?M?k+$>0^b[1]<(uo(b[0]-w)<ro?k:$):k<=b[1]&&b[1]<=$:C>oo^(w<=b[0]&&b[0]<=x)){var S=Ao(p,(-f+v)/g);return _o(S,u),[b,zo(S)]}}}function s(e,i){var n=r?t:oo-t,o=0;return e<-n?o|=1:e>n&&(o|=2),i<-n?o|=4:i>n&&(o|=8),o}return Jo(o,(function(t){var e,i,l,c,d;return{lineStart:function(){c=l=!1,d=1},point:function(h,u){var p,f=[h,u],g=o(h,u),m=r?g?0:s(h,u):g?s(h+(h<0?oo:-oo),u):0;if(!e&&(c=l=g)&&t.lineStart(),g!==l&&(!(p=a(e,f))||Ho(e,p)||Ho(f,p))&&(f[2]=1),g!==l)d=0,g?(t.lineStart(),p=a(f,e),t.point(p[0],p[1])):(p=a(e,f),t.point(p[0],p[1],2),t.lineEnd()),e=p;else if(n&&e&&r^g){var v;m&i||!(v=a(f,e,!0))||(d=0,r?(t.lineStart(),t.point(v[0][0],v[0][1]),t.point(v[1][0],v[1][1]),t.lineEnd()):(t.point(v[1][0],v[1][1]),t.lineEnd(),t.lineStart(),t.point(v[0][0],v[0][1],3)))}!g||e&&Ho(e,f)||t.point(f[0],f[1]),e=f,l=g,i=m},lineEnd:function(){l&&t.lineEnd(),e=null},clean:function(){return d|(c&&l)<<1}}}),(function(e,r,n,o){!function(t,e,i,r,n,o){if(i){var a=go(e),s=bo(e),l=r*i;null==n?(n=e+r*lo,o=e-l/2):(n=qo(a,n),o=qo(a,o),(r>0?n<o:n>o)&&(n+=r*lo));for(var c,d=n;r>0?d>o:d<o;d-=l)c=zo([a,-s*go(d),-s*bo(d)]),t.point(c[0],c[1])}}(o,t,i,n,e,r)}),r?[0,-t]:[-oo,t-oo])}var ea=1e9,ia=-ea;function ra(t,e,i,r){function n(n,o){return t<=n&&n<=i&&e<=o&&o<=r}function o(n,o,s,c){var d=0,h=0;if(null==n||(d=a(n,s))!==(h=a(o,s))||l(n,o)<0^s>0)do{c.point(0===d||3===d?t:i,d>1?r:e)}while((d=(d+s+4)%4)!==h);else c.point(o[0],o[1])}function a(r,n){return uo(r[0]-t)<ro?n>0?0:3:uo(r[0]-i)<ro?n>0?2:1:uo(r[1]-e)<ro?n>0?1:0:n>0?3:2}function s(t,e){return l(t.x,e.x)}function l(t,e){var i=a(t,1),r=a(e,1);return i!==r?i-r:0===i?e[1]-t[1]:1===i?t[0]-e[0]:2===i?t[1]-e[1]:e[0]-t[0]}return function(a){var l,c,d,h,u,p,f,g,m,v,b,y=a,w=Wo(),x={point:k,lineStart:function(){x.point=$,c&&c.push(d=[]);v=!0,m=!1,f=g=NaN},lineEnd:function(){l&&($(h,u),p&&m&&w.rejoin(),l.push(w.result()));x.point=k,m&&y.lineEnd()},polygonStart:function(){y=w,l=[],c=[],b=!0},polygonEnd:function(){var e=function(){for(var e=0,i=0,n=c.length;i<n;++i)for(var o,a,s=c[i],l=1,d=s.length,h=s[0],u=h[0],p=h[1];l<d;++l)o=u,a=p,u=(h=s[l])[0],p=h[1],a<=r?p>r&&(u-o)*(r-a)>(p-a)*(t-o)&&++e:p<=r&&(u-o)*(r-a)<(p-a)*(t-o)&&--e;return e}(),i=b&&e,n=(l=be(l)).length;(i||n)&&(a.polygonStart(),i&&(a.lineStart(),o(null,null,1,a),a.lineEnd()),n&&Yo(l,s,e,o,a),a.polygonEnd());y=a,l=c=d=null}};function k(t,e){n(t,e)&&y.point(t,e)}function $(o,a){var s=n(o,a);if(c&&d.push([o,a]),v)h=o,u=a,p=s,v=!1,s&&(y.lineStart(),y.point(o,a));else if(s&&m)y.point(o,a);else{var l=[f=Math.max(ia,Math.min(ea,f)),g=Math.max(ia,Math.min(ea,g))],w=[o=Math.max(ia,Math.min(ea,o)),a=Math.max(ia,Math.min(ea,a))];!function(t,e,i,r,n,o){var a,s=t[0],l=t[1],c=0,d=1,h=e[0]-s,u=e[1]-l;if(a=i-s,h||!(a>0)){if(a/=h,h<0){if(a<c)return;a<d&&(d=a)}else if(h>0){if(a>d)return;a>c&&(c=a)}if(a=n-s,h||!(a<0)){if(a/=h,h<0){if(a>d)return;a>c&&(c=a)}else if(h>0){if(a<c)return;a<d&&(d=a)}if(a=r-l,u||!(a>0)){if(a/=u,u<0){if(a<c)return;a<d&&(d=a)}else if(u>0){if(a>d)return;a>c&&(c=a)}if(a=o-l,u||!(a<0)){if(a/=u,u<0){if(a>d)return;a>c&&(c=a)}else if(u>0){if(a<c)return;a<d&&(d=a)}return c>0&&(t[0]=s+c*h,t[1]=l+c*u),d<1&&(e[0]=s+d*h,e[1]=l+d*u),!0}}}}}(l,w,t,e,i,r)?s&&(y.lineStart(),y.point(o,a),b=!1):(m||(y.lineStart(),y.point(l[0],l[1])),y.point(w[0],w[1]),s||y.lineEnd(),b=!1)}f=o,g=a,m=s}return x}}var na,oa,aa,sa,la=t=>t,ca=new ue,da=new ue,ha={point:$o,lineStart:$o,lineEnd:$o,polygonStart:function(){ha.lineStart=ua,ha.lineEnd=ga},polygonEnd:function(){ha.lineStart=ha.lineEnd=ha.point=$o,ca.add(uo(da)),da=new ue},result:function(){var t=ca/2;return ca=new ue,t}};function ua(){ha.point=pa}function pa(t,e){ha.point=fa,na=aa=t,oa=sa=e}function fa(t,e){da.add(sa*t-aa*e),aa=t,sa=e}function ga(){fa(na,oa)}var ma=ha,va=1/0,ba=va,ya=-va,wa=ya,xa={point:function(t,e){t<va&&(va=t);t>ya&&(ya=t);e<ba&&(ba=e);e>wa&&(wa=e)},lineStart:$o,lineEnd:$o,polygonStart:$o,polygonEnd:$o,result:function(){var t=[[va,ba],[ya,wa]];return ya=wa=-(ba=va=1/0),t}};var ka,$a,Ca,Ma,Sa=xa,ja=0,Da=0,Oa=0,za=0,Ta=0,Ia=0,Ra=0,_a=0,Aa=0,Na={point:Ua,lineStart:Ba,lineEnd:Fa,polygonStart:function(){Na.lineStart=Pa,Na.lineEnd=qa},polygonEnd:function(){Na.point=Ua,Na.lineStart=Ba,Na.lineEnd=Fa},result:function(){var t=Aa?[Ra/Aa,_a/Aa]:Ia?[za/Ia,Ta/Ia]:Oa?[ja/Oa,Da/Oa]:[NaN,NaN];return ja=Da=Oa=za=Ta=Ia=Ra=_a=Aa=0,t}};function Ua(t,e){ja+=t,Da+=e,++Oa}function Ba(){Na.point=La}function La(t,e){Na.point=Ea,Ua(Ca=t,Ma=e)}function Ea(t,e){var i=t-Ca,r=e-Ma,n=wo(i*i+r*r);za+=n*(Ca+t)/2,Ta+=n*(Ma+e)/2,Ia+=n,Ua(Ca=t,Ma=e)}function Fa(){Na.point=Ua}function Pa(){Na.point=Wa}function qa(){Ha(ka,$a)}function Wa(t,e){Na.point=Ha,Ua(ka=Ca=t,$a=Ma=e)}function Ha(t,e){var i=t-Ca,r=e-Ma,n=wo(i*i+r*r);za+=n*(Ca+t)/2,Ta+=n*(Ma+e)/2,Ia+=n,Ra+=(n=Ma*t-Ca*e)*(Ca+t),_a+=n*(Ma+e),Aa+=3*n,Ua(Ca=t,Ma=e)}var Va=Na;function Ya(t){this._context=t}Ya.prototype={_radius:4.5,pointRadius:function(t){return this._radius=t,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._context.closePath(),this._point=NaN},point:function(t,e){switch(this._point){case 0:this._context.moveTo(t,e),this._point=1;break;case 1:this._context.lineTo(t,e);break;default:this._context.moveTo(t+this._radius,e),this._context.arc(t,e,this._radius,0,lo)}},result:$o};var Ga,Ka,Ja,Xa,Za,Qa=new ue,ts={point:$o,lineStart:function(){ts.point=es},lineEnd:function(){Ga&&is(Ka,Ja),ts.point=$o},polygonStart:function(){Ga=!0},polygonEnd:function(){Ga=null},result:function(){var t=+Qa;return Qa=new ue,t}};function es(t,e){ts.point=is,Ka=Xa=t,Ja=Za=e}function is(t,e){Xa-=t,Za-=e,Qa.add(wo(Xa*Xa+Za*Za)),Xa=t,Za=e}var rs=ts;let ns,os,as,ss;class ls{constructor(t){this._append=null==t?cs:function(t){const e=Math.floor(t);if(!(e>=0))throw new RangeError(`invalid digits: ${t}`);if(e>15)return cs;if(e!==ns){const t=10**e;ns=e,os=function(e){let i=1;this._+=e[0];for(const r=e.length;i<r;++i)this._+=Math.round(arguments[i]*t)/t+e[i]}}return os}(t),this._radius=4.5,this._=""}pointRadius(t){return this._radius=+t,this}polygonStart(){this._line=0}polygonEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){0===this._line&&(this._+="Z"),this._point=NaN}point(t,e){switch(this._point){case 0:this._append`M${t},${e}`,this._point=1;break;case 1:this._append`L${t},${e}`;break;default:if(this._append`M${t},${e}`,this._radius!==as||this._append!==os){const t=this._radius,e=this._;this._="",this._append`m0,${t}a${t},${t} 0 1,1 0,${-2*t}a${t},${t} 0 1,1 0,${2*t}z`,as=t,os=this._append,ss=this._,this._=e}this._+=ss}}result(){const t=this._;return this._="",t.length?t:null}}function cs(t){let e=1;this._+=t[0];for(const i=t.length;e<i;++e)this._+=arguments[e]+t[e]}function ds(t){return function(e){var i=new hs;for(var r in t)i[r]=t[r];return i.stream=e,i}}function hs(){}function us(t,e,i){var r=t.clipExtent&&t.clipExtent();return t.scale(150).translate([0,0]),null!=r&&t.clipExtent(null),Oo(i,t.stream(Sa)),e(Sa.result()),null!=r&&t.clipExtent(r),t}function ps(t,e,i){return us(t,(function(i){var r=e[1][0]-e[0][0],n=e[1][1]-e[0][1],o=Math.min(r/(i[1][0]-i[0][0]),n/(i[1][1]-i[0][1])),a=+e[0][0]+(r-o*(i[1][0]+i[0][0]))/2,s=+e[0][1]+(n-o*(i[1][1]+i[0][1]))/2;t.scale(150*o).translate([a,s])}),i)}hs.prototype={constructor:hs,point:function(t,e){this.stream.point(t,e)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};var fs=16,gs=go(30*ho);function ms(t,e){return+e?function(t,e){function i(r,n,o,a,s,l,c,d,h,u,p,f,g,m){var v=c-r,b=d-n,y=v*v+b*b;if(y>4*e&&g--){var w=a+u,x=s+p,k=l+f,$=wo(w*w+x*x+k*k),C=ko(k/=$),M=uo(uo(k)-1)<ro||uo(o-h)<ro?(o+h)/2:fo(x,w),S=t(M,C),j=S[0],D=S[1],O=j-r,z=D-n,T=b*O-v*z;(T*T/y>e||uo((v*O+b*z)/y-.5)>.3||a*u+s*p+l*f<gs)&&(i(r,n,o,a,s,l,j,D,M,w/=$,x/=$,k,g,m),m.point(j,D),i(j,D,M,w,x,k,c,d,h,u,p,f,g,m))}}return function(e){var r,n,o,a,s,l,c,d,h,u,p,f,g={point:m,lineStart:v,lineEnd:y,polygonStart:function(){e.polygonStart(),g.lineStart=w},polygonEnd:function(){e.polygonEnd(),g.lineStart=v}};function m(i,r){i=t(i,r),e.point(i[0],i[1])}function v(){d=NaN,g.point=b,e.lineStart()}function b(r,n){var o=To([r,n]),a=t(r,n);i(d,h,c,u,p,f,d=a[0],h=a[1],c=r,u=o[0],p=o[1],f=o[2],fs,e),e.point(d,h)}function y(){g.point=m,e.lineEnd()}function w(){v(),g.point=x,g.lineEnd=k}function x(t,e){b(r=t,e),n=d,o=h,a=u,s=p,l=f,g.point=b}function k(){i(d,h,c,u,p,f,n,o,r,a,s,l,fs,e),g.lineEnd=y,y()}return g}}(t,e):function(t){return ds({point:function(e,i){e=t(e,i),this.stream.point(e[0],e[1])}})}(t)}var vs=ds({point:function(t,e){this.stream.point(t*ho,e*ho)}});function bs(t,e,i,r,n,o){if(!o)return function(t,e,i,r,n){function o(o,a){return[e+t*(o*=r),i-t*(a*=n)]}return o.invert=function(o,a){return[(o-e)/t*r,(i-a)/t*n]},o}(t,e,i,r,n);var a=go(o),s=bo(o),l=a*t,c=s*t,d=a/t,h=s/t,u=(s*i-a*e)/t,p=(s*e+a*i)/t;function f(t,o){return[l*(t*=r)-c*(o*=n)+e,i-c*t-l*o]}return f.invert=function(t,e){return[r*(d*t-h*e+u),n*(p-h*t-d*e)]},f}function ys(t){return function(t){var e,i,r,n,o,a,s,l,c,d,h=150,u=480,p=250,f=0,g=0,m=0,v=0,b=0,y=0,w=1,x=1,k=null,$=Qo,C=null,M=la,S=.5;function j(t){return l(t[0]*ho,t[1]*ho)}function D(t){return(t=l.invert(t[0],t[1]))&&[t[0]*co,t[1]*co]}function O(){var t=bs(h,0,0,w,x,y).apply(null,e(f,g)),r=bs(h,u-t[0],p-t[1],w,x,y);return i=Lo(m,v,b),s=Uo(e,r),l=Uo(i,s),a=ms(s,S),z()}function z(){return c=d=null,j}return j.stream=function(t){return c&&d===t?c:c=vs(function(t){return ds({point:function(e,i){var r=t(e,i);return this.stream.point(r[0],r[1])}})}(i)($(a(M(d=t)))))},j.preclip=function(t){return arguments.length?($=t,k=void 0,z()):$},j.postclip=function(t){return arguments.length?(M=t,C=r=n=o=null,z()):M},j.clipAngle=function(t){return arguments.length?($=+t?ta(k=t*ho):(k=null,Qo),z()):k*co},j.clipExtent=function(t){return arguments.length?(M=null==t?(C=r=n=o=null,la):ra(C=+t[0][0],r=+t[0][1],n=+t[1][0],o=+t[1][1]),z()):null==C?null:[[C,r],[n,o]]},j.scale=function(t){return arguments.length?(h=+t,O()):h},j.translate=function(t){return arguments.length?(u=+t[0],p=+t[1],O()):[u,p]},j.center=function(t){return arguments.length?(f=t[0]%360*ho,g=t[1]%360*ho,O()):[f*co,g*co]},j.rotate=function(t){return arguments.length?(m=t[0]%360*ho,v=t[1]%360*ho,b=t.length>2?t[2]%360*ho:0,O()):[m*co,v*co,b*co]},j.angle=function(t){return arguments.length?(y=t%360*ho,O()):y*co},j.reflectX=function(t){return arguments.length?(w=t?-1:1,O()):w<0},j.reflectY=function(t){return arguments.length?(x=t?-1:1,O()):x<0},j.precision=function(t){return arguments.length?(a=ms(s,S=t*t),z()):wo(S)},j.fitExtent=function(t,e){return ps(j,t,e)},j.fitSize=function(t,e){return function(t,e,i){return ps(t,[[0,0],e],i)}(j,t,e)},j.fitWidth=function(t,e){return function(t,e,i){return us(t,(function(i){var r=+e,n=r/(i[1][0]-i[0][0]),o=(r-n*(i[1][0]+i[0][0]))/2,a=-n*i[0][1];t.scale(150*n).translate([o,a])}),i)}(j,t,e)},j.fitHeight=function(t,e){return function(t,e,i){return us(t,(function(i){var r=+e,n=r/(i[1][1]-i[0][1]),o=-n*i[0][0],a=(r-n*(i[1][1]+i[0][1]))/2;t.scale(150*n).translate([o,a])}),i)}(j,t,e)},function(){return e=t.apply(this,arguments),j.invert=e.invert&&D,O()}}((function(){return t}))()}function ws(t,e){return[t,vo(xo((ao+e)/2))]}function xs(){return function(t){var e,i,r,n=ys(t),o=n.center,a=n.scale,s=n.translate,l=n.clipExtent,c=null;function d(){var o=oo*a(),s=n(function(t){function e(e){return(e=t(e[0]*ho,e[1]*ho))[0]*=co,e[1]*=co,e}return t=Lo(t[0]*ho,t[1]*ho,t.length>2?t[2]*ho:0),e.invert=function(e){return(e=t.invert(e[0]*ho,e[1]*ho))[0]*=co,e[1]*=co,e},e}(n.rotate()).invert([0,0]));return l(null==c?[[s[0]-o,s[1]-o],[s[0]+o,s[1]+o]]:t===ws?[[Math.max(s[0]-o,c),e],[Math.min(s[0]+o,i),r]]:[[c,Math.max(s[1]-o,e)],[i,Math.min(s[1]+o,r)]])}return n.scale=function(t){return arguments.length?(a(t),d()):a()},n.translate=function(t){return arguments.length?(s(t),d()):s()},n.center=function(t){return arguments.length?(o(t),d()):o()},n.clipExtent=function(t){return arguments.length?(null==t?c=e=i=r=null:(c=+t[0][0],e=+t[0][1],i=+t[1][0],r=+t[1][1]),d()):null==c?null:[[c,e],[i,r]]},d()}(ws).scale(961/lo)}function ks(t,e){switch(arguments.length){case 0:break;case 1:this.range(t);break;default:this.range(e).domain(t)}return this}function $s(t){return+t}ws.invert=function(t,e){return[t,2*po(mo(e))-ao]};var Cs=[0,1];function Ms(t){return t}function Ss(t,e){return(e-=t=+t)?function(i){return(i-t)/e}:function(t){return function(){return t}}(isNaN(e)?NaN:.5)}function js(t,e,i){var r=t[0],n=t[1],o=e[0],a=e[1];return n<r?(r=Ss(n,r),o=i(a,o)):(r=Ss(r,n),o=i(o,a)),function(t){return o(r(t))}}function Ds(t,e,i){var r=Math.min(t.length,e.length)-1,n=new Array(r),o=new Array(r),a=-1;for(t[r]<t[0]&&(t=t.slice().reverse(),e=e.slice().reverse());++a<r;)n[a]=Ss(t[a],t[a+1]),o[a]=i(e[a],e[a+1]);return function(e){var i=he(t,e,1,r)-1;return o[i](n[i](e))}}function Os(){var t,e,i,r,n,o,a=Cs,s=Cs,l=Or,c=Ms;function d(){var t=Math.min(a.length,s.length);return c!==Ms&&(c=function(t,e){var i;return t>e&&(i=t,t=e,e=i),function(i){return Math.max(t,Math.min(e,i))}}(a[0],a[t-1])),r=t>2?Ds:js,n=o=null,h}function h(e){return null==e||isNaN(e=+e)?i:(n||(n=r(a.map(t),s,l)))(t(c(e)))}return h.invert=function(i){return c(e((o||(o=r(s,a.map(t),Cr)))(i)))},h.domain=function(t){return arguments.length?(a=Array.from(t,$s),d()):a.slice()},h.range=function(t){return arguments.length?(s=Array.from(t),d()):s.slice()},h.rangeRound=function(t){return s=Array.from(t),l=zr,d()},h.clamp=function(t){return arguments.length?(c=!!t||Ms,d()):c!==Ms},h.interpolate=function(t){return arguments.length?(l=t,d()):l},h.unknown=function(t){return arguments.length?(i=t,h):i},function(i,r){return t=i,e=r,d()}}function zs(t,e,i,r){var n,o=function(t,e,i){i=+i;const r=(e=+e)<(t=+t),n=r?ve(e,t,i):ve(t,e,i);return(r?-1:1)*(n<0?1/-n:n)}(t,e,i);switch((r=Vn(r??",f")).type){case"s":var a=Math.max(Math.abs(t),Math.abs(e));return null!=r.precision||isNaN(n=function(t,e){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(qn(e)/3)))-qn(Math.abs(t)))}(o,a))||(r.precision=n),Qn(r,a);case"":case"e":case"g":case"p":case"r":null!=r.precision||isNaN(n=function(t,e){return t=Math.abs(t),e=Math.abs(e)-t,Math.max(0,qn(e)-qn(t))+1}(o,Math.max(Math.abs(t),Math.abs(e))))||(r.precision=n-("e"===r.type));break;case"f":case"%":null!=r.precision||isNaN(n=function(t){return Math.max(0,-qn(Math.abs(t)))}(o))||(r.precision=n-2*("%"===r.type))}return Zn(r)}function Ts(t){var e=t.domain;return t.ticks=function(t){var i=e();return function(t,e,i){if(!((i=+i)>0))return[];if((t=+t)==(e=+e))return[t];const r=e<t,[n,o,a]=r?me(e,t,i):me(t,e,i);if(!(o>=n))return[];const s=o-n+1,l=new Array(s);if(r)if(a<0)for(let t=0;t<s;++t)l[t]=(o-t)/-a;else for(let t=0;t<s;++t)l[t]=(o-t)*a;else if(a<0)for(let t=0;t<s;++t)l[t]=(n+t)/-a;else for(let t=0;t<s;++t)l[t]=(n+t)*a;return l}(i[0],i[i.length-1],t??10)},t.tickFormat=function(t,i){var r=e();return zs(r[0],r[r.length-1],t??10,i)},t.nice=function(i){null==i&&(i=10);var r,n,o=e(),a=0,s=o.length-1,l=o[a],c=o[s],d=10;for(c<l&&(n=l,l=c,c=n,n=a,a=s,s=n);d-- >0;){if((n=ve(l,c,i))===r)return o[a]=l,o[s]=c,e(o);if(n>0)l=Math.floor(l/n)*n,c=Math.ceil(c/n)*n;else{if(!(n<0))break;l=Math.ceil(l*n)/n,c=Math.floor(c*n)/n}r=n}return t},t}function Is(){var t=Os()(Ms,Ms);return t.copy=function(){return e=t,Is().domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());var e},ks.apply(t,arguments),Ts(t)}function Rs(t,e,i){this.k=t,this.x=e,this.y=i}function _s(t){return t}function As(t,e){var i=e.id,r=e.bbox,n=null==e.properties?{}:e.properties,o=function(t,e){var i=function(t){if(null==t)return _s;var e,i,r=t.scale[0],n=t.scale[1],o=t.translate[0],a=t.translate[1];return function(t,s){s||(e=i=0);var l=2,c=t.length,d=new Array(c);for(d[0]=(e+=t[0])*r+o,d[1]=(i+=t[1])*n+a;l<c;)d[l]=t[l],++l;return d}}(t.transform),r=t.arcs;function n(t,e){e.length&&e.pop();for(var n=r[t<0?~t:t],o=0,a=n.length;o<a;++o)e.push(i(n[o],o));t<0&&function(t,e){for(var i,r=t.length,n=r-e;n<--r;)i=t[n],t[n++]=t[r],t[r]=i}(e,a)}function o(t){return i(t)}function a(t){for(var e=[],i=0,r=t.length;i<r;++i)n(t[i],e);return e.length<2&&e.push(e[0]),e}function s(t){for(var e=a(t);e.length<4;)e.push(e[0]);return e}function l(t){return t.map(s)}function c(t){var e,i=t.type;switch(i){case"GeometryCollection":return{type:i,geometries:t.geometries.map(c)};case"Point":e=o(t.coordinates);break;case"MultiPoint":e=t.coordinates.map(o);break;case"LineString":e=a(t.arcs);break;case"MultiLineString":e=t.arcs.map(a);break;case"Polygon":e=l(t.arcs);break;case"MultiPolygon":e=t.arcs.map(l);break;default:return null}return{type:i,coordinates:e}}return c(e)}(t,e);return null==i&&null==r?{type:"Feature",properties:n,geometry:o}:null==r?{type:"Feature",id:i,properties:n,geometry:o}:{type:"Feature",id:i,bbox:r,properties:n,geometry:o}}Rs.prototype={constructor:Rs,scale:function(t){return 1===t?this:new Rs(this.k*t,this.x,this.y)},translate:function(t,e){return 0===t&0===e?this:new Rs(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}},Rs.prototype;var Ns=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Us=class extends ht{constructor(){super(),this.loading=!0,this.darkTheme=!1,this.defaultFill="#038bff",this.resizeMap=this.resizeMap.bind(this),this.drawMap=this.drawMap.bind(this),this.getDataset=this.getDataset.bind(this),this.darkTheme=document.querySelector("html").classList.contains("dark")||!1}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.updateCountries.bind(this))}updated(t){t.get("query")&&(this.loading=!0,this.countries=void 0,this.fetchCountries())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this.resizeMap)}firstUpdated(){this.fetchCountries(),window.addEventListener("resize",this.resizeMap)}getDataset(){const t={};if(this.countries){var e=this.countries.map((function(t){return t.visitors})),i=Math.max.apply(null,e);const r=Is().domain([0,i]).range([this.darkTheme?"#2e3954":"#f3ebff",this.darkTheme?"#6366f1":"#a779e9"]);this.countries.forEach((function(e){t[e.alpha_3]={numberOfThings:e.visitors,fillColor:r(e.visitors)}}))}return t}updateCountries(){this.fetchCountries().then((()=>{const t=this.getDataset();Ni(this.$$("#map-container")).selectAll("path.country").attr("fill",(e=>{const i=t[e.id];return i?i.fillColor:this.defaultFill}))}))}fetchCountries(){return F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/countries`,this.query,{limit:300}).then((async t=>{this.loading=!1,this.countries=t,await this.updateComplete,this.drawMap()}))}resizeMap(){this.map&&this.map.resize()}drawMap(){const t=this.getDataset();"realtime"===this.query.period?this.t("Current visitors"):this.t("Visitors");const e=this.darkTheme?"#2d3747":"#f8fafc",i=this.darkTheme?"#374151":"#F5F5F5",r=this.darkTheme?"#1f2937":"#dae1e7",n=this.darkTheme?"#4f46e5":"#a779e9";(function(t,e){return fetch(t,e).then(Fn)})("/topo/world.json").then((o=>{const a=function(t,e){return"string"==typeof e&&(e=t.objects[e]),"GeometryCollection"===e.type?{type:"FeatureCollection",features:e.geometries.map((function(e){return As(t,e)}))}:As(t,e)}(o,o.objects.countries).features,s=xs(),l=function(t,e){let i,r,n=3,o=4.5;function a(t){return t&&("function"==typeof o&&r.pointRadius(+o.apply(this,arguments)),Oo(t,i(r))),r.result()}return a.area=function(t){return Oo(t,i(ma)),ma.result()},a.measure=function(t){return Oo(t,i(rs)),rs.result()},a.bounds=function(t){return Oo(t,i(Sa)),Sa.result()},a.centroid=function(t){return Oo(t,i(Va)),Va.result()},a.projection=function(e){return arguments.length?(i=null==e?(t=null,la):(t=e).stream,a):t},a.context=function(t){return arguments.length?(r=null==t?(e=null,new ls(n)):new Ya(e=t),"function"!=typeof o&&r.pointRadius(o),a):e},a.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(r.pointRadius(+t),+t),a):o},a.digits=function(t){if(!arguments.length)return n;if(null==t)n=null;else{const e=Math.floor(t);if(!(e>=0))throw new RangeError(`invalid digits: ${t}`);n=e}return null===e&&(r=new ls(n)),a},a.projection(t).digits(n).context(e)}().communityion(s);Ni(this.$$("#map-container")).append("svg").selectAll("path").data(a).enter().append("path").attr("d",(t=>l(t))).attr("class","country").attr("fill",(i=>t[i.id]?.fillColor??e)).attr("stroke",r).on("mouseover",((e,r)=>{Ni(e.target).attr("fill",t[r.id]?.fillColor??i).attr("stroke",n)})).on("mouseout",((i,n)=>{Ni(i.target).attr("fill",t[n.id]?.fillColor??e).attr("stroke",r)})).on("click",(t=>{const e=this.countries?.find((e=>e.alpha_3===t.id));e&&(this.onClick(),rt(this.history,this.query,{country:e.code,country_name:e.name}))}))}))}onClick(){}geolocationDbNotice(){return this.site.isDbip?o`
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
    `}};Ns([i({type:Array})],Us.prototype,"countries",void 0),Ns([i({type:Boolean})],Us.prototype,"loading",void 0),Ns([i({type:Boolean})],Us.prototype,"darkTheme",void 0),Ns([i({type:Object})],Us.prototype,"history",void 0),Ns([i({type:Object})],Us.prototype,"map",void 0),Us=Ns([n("pl-countries-map")],Us);var Bs=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Ls=class extends ht{connectedCallback(){super.connectedCallback(),this.tabKey=`pageTab__${this.site.domain}`,this.mode=this.storedTab||"map",this.timer&&this.timer.onTick(this.renderCountries.bind(this))}setMode(t){W(this.tabKey,t),this.mode=t}updated(t){if(t.get("query")){const e=e=>t.get("query").filters[e]&&!this.query.filters[e];"cities"===this.mode&&e("region")&&this.setMode("regions"),"regions"===this.mode&&e("country")&&this.setMode(this.countriesRestoreMode||"countries")}}onCountryFilter(t){this.countriesRestoreMode=t,this.setMode("regions")}onRegionFilter(){this.setMode("cities")}renderCountries(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/countries"),this.query,{limit:9}).then((t=>t.map((t=>Object.assign({},t,{percentage:void 0})))))}
        .filter=${{country:"code",country_name:"name"}}
        @click=${()=>this.onCountryFilter("countries")}
        .keyLabel=${this.t("Country")}
        .detailsLink=${lt(this.site,"/countries")}
        .query=${this.query}
        .timer=${this.timer}
        .renderIcon=${t=>o`<span class="mr-1">${t.flag}</span>`}
        color="bg-orange-50"
      ></pl-list-report>
    `}renderRegions(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/regions"),this.query,{limit:9})}
        .filter=${{region:"code",region_name:"name"}}
        @click=${this.onRegionFilter}
        .keyLabel=${this.t("Region")}
        .detailsLink=${lt(this.site,"/regions")}
        .query=${this.query}
        .renderIcon=${t=>o`<span class="mr-1">export${t.country_flag}</span>`}
        color="bg-orange-50"
      ></pl-list-report>
    `}renderCities(){return o`
      <pl-list-report
        .fetchDataFunction=${()=>F(this.proxyUrl,st(this.site,"/cities"),this.query,{limit:9})}
        .filter=${{city:"code",city_name:"name"}}
        .keyLabel=${this.t("City")}
        .detailsLink=${lt(this.site,"/cities")}
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
function Es(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}Bs([i({type:String})],Ls.prototype,"tabKey",void 0),Bs([i({type:String})],Ls.prototype,"storedTab",void 0),Bs([i({type:String})],Ls.prototype,"mode",void 0),Ls=Bs([n("pl-locations")],Ls);const Fs=window,Ps=Fs.ShadowRoot&&(void 0===Fs.ShadyCSS||Fs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,qs=Symbol(),Ws=new WeakMap;let Hs=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==qs)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ps&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=Ws.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ws.set(e,t))}return t}toString(){return this.cssText}};const Vs=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1]),t[0]);return new Hs(i,t,qs)},Ys=Ps?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new Hs("string"==typeof t?t:t+"",void 0,qs))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var Gs;const Ks=window,Js=Ks.trustedTypes,Xs=Js?Js.emptyScript:"",Zs=Ks.reactiveElementPolyfillSupport,Qs={toAttribute(t,e){switch(e){case Boolean:t=t?Xs:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},tl=(t,e)=>e!==t&&(e==e||t==t),el={attribute:!0,type:String,converter:Qs,reflect:!1,hasChanged:tl},il="finalized";let rl=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const r=this._$Ep(i,e);void 0!==r&&(this._$Ev.set(r,i),t.push(r))})),t}static createProperty(t,e=el){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,r=this.getPropertyDescriptor(t,i,e);void 0!==r&&Object.defineProperty(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(r){const n=this[t];this[e]=r,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||el}static finalize(){if(this.hasOwnProperty(il))return!1;this[il]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(Ys(t))}else void 0!==t&&e.push(Ys(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{Ps?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),r=Fs.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,t.appendChild(i)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=el){var r;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(r=i.converter)||void 0===r?void 0:r.toAttribute)?i.converter:Qs).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const r=this.constructor,n=r._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=r.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:Qs;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let r=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||tl)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):r=!1),!this.isUpdatePending&&r&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var nl;rl[il]=!0,rl.elementProperties=new Map,rl.elementStyles=[],rl.shadowRootOptions={mode:"open"},null==Zs||Zs({ReactiveElement:rl}),(null!==(Gs=Ks.reactiveElementVersions)&&void 0!==Gs?Gs:Ks.reactiveElementVersions=[]).push("1.6.3");const ol=window,al=ol.trustedTypes,sl=al?al.createPolicy("lit-html",{createHTML:t=>t}):void 0,ll="$lit$",cl=`lit$${(Math.random()+"").slice(9)}$`,dl="?"+cl,hl=`<${dl}>`,ul=document,pl=()=>ul.createComment(""),fl=t=>null===t||"object"!=typeof t&&"function"!=typeof t,gl=Array.isArray,ml="[ \t\n\f\r]",vl=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bl=/-->/g,yl=/>/g,wl=RegExp(`>|${ml}(?:([^\\s"'>=/]+)(${ml}*=${ml}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),xl=/'/g,kl=/"/g,$l=/^(?:script|style|textarea|title)$/i,Cl=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),Ml=Symbol.for("lit-noChange"),Sl=Symbol.for("lit-nothing"),jl=new WeakMap,Dl=ul.createTreeWalker(ul,129,null,!1);function Ol(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==sl?sl.createHTML(e):e}const zl=(t,e)=>{const i=t.length-1,r=[];let n,o=2===e?"<svg>":"",a=vl;for(let e=0;e<i;e++){const i=t[e];let s,l,c=-1,d=0;for(;d<i.length&&(a.lastIndex=d,l=a.exec(i),null!==l);)d=a.lastIndex,a===vl?"!--"===l[1]?a=bl:void 0!==l[1]?a=yl:void 0!==l[2]?($l.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=wl):void 0!==l[3]&&(a=wl):a===wl?">"===l[0]?(a=null!=n?n:vl,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,s=l[1],a=void 0===l[3]?wl:'"'===l[3]?kl:xl):a===kl||a===xl?a=wl:a===bl||a===yl?a=vl:(a=wl,n=void 0);const h=a===wl&&t[e+1].startsWith("/>")?" ":"";o+=a===vl?i+hl:c>=0?(r.push(s),i.slice(0,c)+ll+i.slice(c)+cl+h):i+cl+(-2===c?(r.push(void 0),e):h)}return[Ol(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),r]};class Tl{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let n=0,o=0;const a=t.length-1,s=this.parts,[l,c]=zl(t,e);if(this.el=Tl.createElement(l,i),Dl.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(r=Dl.nextNode())&&s.length<a;){if(1===r.nodeType){if(r.hasAttributes()){const t=[];for(const e of r.getAttributeNames())if(e.endsWith(ll)||e.startsWith(cl)){const i=c[o++];if(t.push(e),void 0!==i){const t=r.getAttribute(i.toLowerCase()+ll).split(cl),e=/([.?@])?(.*)/.exec(i);s.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?Nl:"?"===e[1]?Bl:"@"===e[1]?Ll:Al})}else s.push({type:6,index:n})}for(const e of t)r.removeAttribute(e)}if($l.test(r.tagName)){const t=r.textContent.split(cl),e=t.length-1;if(e>0){r.textContent=al?al.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],pl()),Dl.nextNode(),s.push({type:2,index:++n});r.append(t[e],pl())}}}else if(8===r.nodeType)if(r.data===dl)s.push({type:2,index:n});else{let t=-1;for(;-1!==(t=r.data.indexOf(cl,t+1));)s.push({type:7,index:n}),t+=cl.length-1}n++}}static createElement(t,e){const i=ul.createElement("template");return i.innerHTML=t,i}}function Il(t,e,i=t,r){var n,o,a,s;if(e===Ml)return e;let l=void 0!==r?null===(n=i._$Co)||void 0===n?void 0:n[r]:i._$Cl;const c=fl(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,r)),void 0!==r?(null!==(a=(s=i)._$Co)&&void 0!==a?a:s._$Co=[])[r]=l:i._$Cl=l),void 0!==l&&(e=Il(t,l._$AS(t,e.values),l,r)),e}class Rl{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:r}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:ul).importNode(i,!0);Dl.currentNode=n;let o=Dl.nextNode(),a=0,s=0,l=r[0];for(;void 0!==l;){if(a===l.index){let e;2===l.type?e=new _l(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new El(o,this,t)),this._$AV.push(e),l=r[++s]}a!==(null==l?void 0:l.index)&&(o=Dl.nextNode(),a++)}return Dl.currentNode=ul,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class _l{constructor(t,e,i,r){var n;this.type=2,this._$AH=Sl,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cp=null===(n=null==r?void 0:r.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Il(this,t,e),fl(t)?t===Sl||null==t||""===t?(this._$AH!==Sl&&this._$AR(),this._$AH=Sl):t!==this._$AH&&t!==Ml&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>gl(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==Sl&&fl(this._$AH)?this._$AA.nextSibling.data=t:this.$(ul.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:r}=t,n="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=Tl.createElement(Ol(r.h,r.h[0]),this.options)),r);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new Rl(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=jl.get(t.strings);return void 0===e&&jl.set(t.strings,e=new Tl(t)),e}T(t){gl(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const n of t)r===e.length?e.push(i=new _l(this.k(pl()),this.k(pl()),this,this.options)):i=e[r],i._$AI(n),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Al{constructor(t,e,i,r,n){this.type=1,this._$AH=Sl,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Sl}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,r){const n=this.strings;let o=!1;if(void 0===n)t=Il(this,t,e,0),o=!fl(t)||t!==this._$AH&&t!==Ml,o&&(this._$AH=t);else{const r=t;let a,s;for(t=n[0],a=0;a<n.length-1;a++)s=Il(this,r[i+a],e,a),s===Ml&&(s=this._$AH[a]),o||(o=!fl(s)||s!==this._$AH[a]),s===Sl?t=Sl:t!==Sl&&(t+=(null!=s?s:"")+n[a+1]),this._$AH[a]=s}o&&!r&&this.j(t)}j(t){t===Sl?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Nl extends Al{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Sl?void 0:t}}const Ul=al?al.emptyScript:"";class Bl extends Al{constructor(){super(...arguments),this.type=4}j(t){t&&t!==Sl?this.element.setAttribute(this.name,Ul):this.element.removeAttribute(this.name)}}class Ll extends Al{constructor(t,e,i,r,n){super(t,e,i,r,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=Il(this,t,e,0))&&void 0!==i?i:Sl)===Ml)return;const r=this._$AH,n=t===Sl&&r!==Sl||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==Sl&&(r===Sl||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class El{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Il(this,t)}}const Fl=ol.litHtmlPolyfillSupport;null==Fl||Fl(Tl,_l),(null!==(nl=ol.litHtmlVersions)&&void 0!==nl?nl:ol.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Pl,ql;class Wl extends rl{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var r,n;const o=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:e;let a=o._$litPart$;if(void 0===a){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=a=new _l(e.insertBefore(pl(),t),t,void 0,null!=i?i:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return Ml}}Wl.finalized=!0,Wl._$litElement$=!0,null===(Pl=globalThis.litElementHydrateSupport)||void 0===Pl||Pl.call(globalThis,{LitElement:Wl});const Hl=globalThis.litElementPolyfillSupport;null==Hl||Hl({LitElement:Wl}),(null!==(ql=globalThis.litElementVersions)&&void 0!==ql?ql:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vl=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Yl(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):Vl(t,e)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var Gl;null===(Gl=window.HTMLSlotElement)||void 0===Gl||Gl.prototype.assignedElements;var Kl=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Jl={_disable:[],allowInput:!1,allowInvalidPreload:!1,altFormat:"F j, Y",altInput:!1,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:!0,clickOpens:!0,closeOnSelect:!0,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:!1,enableSeconds:!1,enableTime:!1,errorHandler:function(t){return"undefined"!=typeof console&&console.warn(t)},getWeek:function(t){var e=new Date(t.getTime());e.setHours(0,0,0,0),e.setDate(e.getDate()+3-(e.getDay()+6)%7);var i=new Date(e.getFullYear(),0,4);return 1+Math.round(((e.getTime()-i.getTime())/864e5-3+(i.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:!1,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:!1,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:!1,showMonths:1,static:!1,time_24hr:!1,weekNumbers:!1,wrap:!1},Xl={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(t){var e=t%100;if(e>3&&e<21)return"th";switch(e%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:!1},Zl=function(t,e){return void 0===e&&(e=2),("000"+t).slice(-1*e)},Ql=function(t){return!0===t?1:0};function tc(t,e){var i;return function(){var r=this,n=arguments;clearTimeout(i),i=setTimeout((function(){return t.apply(r,n)}),e)}}var ec=function(t){return t instanceof Array?t:[t]};function ic(t,e,i){if(!0===i)return t.classList.add(e);t.classList.remove(e)}function rc(t,e,i){var r=window.document.createElement(t);return e=e||"",i=i||"",r.className=e,void 0!==i&&(r.textContent=i),r}function nc(t){for(;t.firstChild;)t.removeChild(t.firstChild)}function oc(t,e){return e(t)?t:t.parentNode?oc(t.parentNode,e):void 0}function ac(t,e){var i=rc("div","numInputWrapper"),r=rc("input","numInput "+t),n=rc("span","arrowUp"),o=rc("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?r.type="number":(r.type="text",r.pattern="\\d*"),void 0!==e)for(var a in e)r.setAttribute(a,e[a]);return i.appendChild(r),i.appendChild(n),i.appendChild(o),i}function sc(t){try{return"function"==typeof t.composedPath?t.composedPath()[0]:t.target}catch(e){return t.target}}var lc=function(){},cc=function(t,e,i){return i.months[e?"shorthand":"longhand"][t]},dc={D:lc,F:function(t,e,i){t.setMonth(i.months.longhand.indexOf(e))},G:function(t,e){t.setHours((t.getHours()>=12?12:0)+parseFloat(e))},H:function(t,e){t.setHours(parseFloat(e))},J:function(t,e){t.setDate(parseFloat(e))},K:function(t,e,i){t.setHours(t.getHours()%12+12*Ql(new RegExp(i.amPM[1],"i").test(e)))},M:function(t,e,i){t.setMonth(i.months.shorthand.indexOf(e))},S:function(t,e){t.setSeconds(parseFloat(e))},U:function(t,e){return new Date(1e3*parseFloat(e))},W:function(t,e,i){var r=parseInt(e),n=new Date(t.getFullYear(),0,2+7*(r-1),0,0,0,0);return n.setDate(n.getDate()-n.getDay()+i.firstDayOfWeek),n},Y:function(t,e){t.setFullYear(parseFloat(e))},Z:function(t,e){return new Date(e)},d:function(t,e){t.setDate(parseFloat(e))},h:function(t,e){t.setHours((t.getHours()>=12?12:0)+parseFloat(e))},i:function(t,e){t.setMinutes(parseFloat(e))},j:function(t,e){t.setDate(parseFloat(e))},l:lc,m:function(t,e){t.setMonth(parseFloat(e)-1)},n:function(t,e){t.setMonth(parseFloat(e)-1)},s:function(t,e){t.setSeconds(parseFloat(e))},u:function(t,e){return new Date(parseFloat(e))},w:lc,y:function(t,e){t.setFullYear(2e3+parseFloat(e))}},hc={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},uc={Z:function(t){return t.toISOString()},D:function(t,e,i){return e.weekdays.shorthand[uc.w(t,e,i)]},F:function(t,e,i){return cc(uc.n(t,e,i)-1,!1,e)},G:function(t,e,i){return Zl(uc.h(t,e,i))},H:function(t){return Zl(t.getHours())},J:function(t,e){return void 0!==e.ordinal?t.getDate()+e.ordinal(t.getDate()):t.getDate()},K:function(t,e){return e.amPM[Ql(t.getHours()>11)]},M:function(t,e){return cc(t.getMonth(),!0,e)},S:function(t){return Zl(t.getSeconds())},U:function(t){return t.getTime()/1e3},W:function(t,e,i){return i.getWeek(t)},Y:function(t){return Zl(t.getFullYear(),4)},d:function(t){return Zl(t.getDate())},h:function(t){return t.getHours()%12?t.getHours()%12:12},i:function(t){return Zl(t.getMinutes())},j:function(t){return t.getDate()},l:function(t,e){return e.weekdays.longhand[t.getDay()]},m:function(t){return Zl(t.getMonth()+1)},n:function(t){return t.getMonth()+1},s:function(t){return t.getSeconds()},u:function(t){return t.getTime()},w:function(t){return t.getDay()},y:function(t){return String(t.getFullYear()).substring(2)}},pc=function(t){var e=t.config,i=void 0===e?Jl:e,r=t.l10n,n=void 0===r?Xl:r,o=t.isMobile,a=void 0!==o&&o;return function(t,e,r){var o=r||n;return void 0===i.formatDate||a?e.split("").map((function(e,r,n){return uc[e]&&"\\"!==n[r-1]?uc[e](t,o,i):"\\"!==e?e:""})).join(""):i.formatDate(t,e,o)}},fc=function(t){var e=t.config,i=void 0===e?Jl:e,r=t.l10n,n=void 0===r?Xl:r;return function(t,e,r,o){if(0===t||t){var a,s=o||n,l=t;if(t instanceof Date)a=new Date(t.getTime());else if("string"!=typeof t&&void 0!==t.toFixed)a=new Date(t);else if("string"==typeof t){var c=e||(i||Jl).dateFormat,d=String(t).trim();if("today"===d)a=new Date,r=!0;else if(i&&i.parseDate)a=i.parseDate(t,c);else if(/Z$/.test(d)||/GMT$/.test(d))a=new Date(t);else{for(var h=void 0,u=[],p=0,f=0,g="";p<c.length;p++){var m=c[p],v="\\"===m,b="\\"===c[p-1]||v;if(hc[m]&&!b){g+=hc[m];var y=new RegExp(g).exec(t);y&&(h=!0)&&u["Y"!==m?"push":"unshift"]({fn:dc[m],val:y[++f]})}else v||(g+=".")}a=i&&i.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),u.forEach((function(t){var e=t.fn,i=t.val;return a=e(a,i,s)||a})),a=h?a:void 0}}if(a instanceof Date&&!isNaN(a.getTime()))return!0===r&&a.setHours(0,0,0,0),a;i.errorHandler(new Error("Invalid date provided: "+l))}}};function gc(t,e,i){return void 0===i&&(i=!0),!1!==i?new Date(t.getTime()).setHours(0,0,0,0)-new Date(e.getTime()).setHours(0,0,0,0):t.getTime()-e.getTime()}var mc=function(t,e,i){return t>Math.min(e,i)&&t<Math.max(e,i)},vc=function(t,e,i){return 3600*t+60*e+i},bc=function(t){var e=Math.floor(t/3600),i=(t-3600*e)/60;return[e,i,t-3600*e-60*i]},yc={DAY:864e5};function wc(t){var e=t.defaultHour,i=t.defaultMinute,r=t.defaultSeconds;if(void 0!==t.minDate){var n=t.minDate.getHours(),o=t.minDate.getMinutes(),a=t.minDate.getSeconds();e<n&&(e=n),e===n&&i<o&&(i=o),e===n&&i===o&&r<a&&(r=t.minDate.getSeconds())}if(void 0!==t.maxDate){var s=t.maxDate.getHours(),l=t.maxDate.getMinutes();(e=Math.min(e,s))===s&&(i=Math.min(l,i)),e===s&&i===l&&(r=t.maxDate.getSeconds())}return{hours:e,minutes:i,seconds:r}}"function"!=typeof Object.assign&&(Object.assign=function(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(!t)throw TypeError("Cannot convert undefined or null to object");for(var r=function(e){e&&Object.keys(e).forEach((function(i){return t[i]=e[i]}))},n=0,o=e;n<o.length;n++){r(o[n])}return t});var xc=function(){return xc=Object.assign||function(t){for(var e,i=1,r=arguments.length;i<r;i++)for(var n in e=arguments[i])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t},xc.apply(this,arguments)},kc=function(){for(var t=0,e=0,i=arguments.length;e<i;e++)t+=arguments[e].length;var r=Array(t),n=0;for(e=0;e<i;e++)for(var o=arguments[e],a=0,s=o.length;a<s;a++,n++)r[n]=o[a];return r},$c=300;function Cc(t,e){var i={config:xc(xc({},Jl),Sc.defaultConfig),l10n:Xl};function r(){var t;return(null===(t=i.calendarContainer)||void 0===t?void 0:t.getRootNode()).activeElement||document.activeElement}function n(t){return t.bind(i)}function o(){var t=i.config;!1===t.weekNumbers&&1===t.showMonths||!0!==t.noCalendar&&window.requestAnimationFrame((function(){if(void 0!==i.calendarContainer&&(i.calendarContainer.style.visibility="hidden",i.calendarContainer.style.display="block"),void 0!==i.daysContainer){var e=(i.days.offsetWidth+1)*t.showMonths;i.daysContainer.style.width=e+"px",i.calendarContainer.style.width=e+(void 0!==i.weekWrapper?i.weekWrapper.offsetWidth:0)+"px",i.calendarContainer.style.removeProperty("visibility"),i.calendarContainer.style.removeProperty("display")}}))}function a(t){if(0===i.selectedDates.length){var e=void 0===i.config.minDate||gc(new Date,i.config.minDate)>=0?new Date:new Date(i.config.minDate.getTime()),r=wc(i.config);e.setHours(r.hours,r.minutes,r.seconds,e.getMilliseconds()),i.selectedDates=[e],i.latestSelectedDateObj=e}void 0!==t&&"blur"!==t.type&&function(t){t.preventDefault();var e="keydown"===t.type,r=sc(t),n=r;void 0!==i.amPM&&r===i.amPM&&(i.amPM.textContent=i.l10n.amPM[Ql(i.amPM.textContent===i.l10n.amPM[0])]);var o=parseFloat(n.getAttribute("min")),a=parseFloat(n.getAttribute("max")),s=parseFloat(n.getAttribute("step")),l=parseInt(n.value,10),c=t.delta||(e?38===t.which?1:-1:0),d=l+s*c;if(void 0!==n.value&&2===n.value.length){var h=n===i.hourElement,u=n===i.minuteElement;d<o?(d=a+d+Ql(!h)+(Ql(h)&&Ql(!i.amPM)),u&&g(void 0,-1,i.hourElement)):d>a&&(d=n===i.hourElement?d-a-Ql(!i.amPM):o,u&&g(void 0,1,i.hourElement)),i.amPM&&h&&(1===s?d+l===23:Math.abs(d-l)>s)&&(i.amPM.textContent=i.l10n.amPM[Ql(i.amPM.textContent===i.l10n.amPM[0])]),n.value=Zl(d)}}(t);var n=i._input.value;s(),Q(),i._input.value!==n&&i._debouncedChange()}function s(){if(void 0!==i.hourElement&&void 0!==i.minuteElement){var t,e,r=(parseInt(i.hourElement.value.slice(-2),10)||0)%24,n=(parseInt(i.minuteElement.value,10)||0)%60,o=void 0!==i.secondElement?(parseInt(i.secondElement.value,10)||0)%60:0;void 0!==i.amPM&&(t=r,e=i.amPM.textContent,r=t%12+12*Ql(e===i.l10n.amPM[1]));var a=void 0!==i.config.minTime||i.config.minDate&&i.minDateHasTime&&i.latestSelectedDateObj&&0===gc(i.latestSelectedDateObj,i.config.minDate,!0),s=void 0!==i.config.maxTime||i.config.maxDate&&i.maxDateHasTime&&i.latestSelectedDateObj&&0===gc(i.latestSelectedDateObj,i.config.maxDate,!0);if(void 0!==i.config.maxTime&&void 0!==i.config.minTime&&i.config.minTime>i.config.maxTime){var l=vc(i.config.minTime.getHours(),i.config.minTime.getMinutes(),i.config.minTime.getSeconds()),d=vc(i.config.maxTime.getHours(),i.config.maxTime.getMinutes(),i.config.maxTime.getSeconds()),h=vc(r,n,o);if(h>d&&h<l){var u=bc(l);r=u[0],n=u[1],o=u[2]}}else{if(s){var p=void 0!==i.config.maxTime?i.config.maxTime:i.config.maxDate;(r=Math.min(r,p.getHours()))===p.getHours()&&(n=Math.min(n,p.getMinutes())),n===p.getMinutes()&&(o=Math.min(o,p.getSeconds()))}if(a){var f=void 0!==i.config.minTime?i.config.minTime:i.config.minDate;(r=Math.max(r,f.getHours()))===f.getHours()&&n<f.getMinutes()&&(n=f.getMinutes()),n===f.getMinutes()&&(o=Math.max(o,f.getSeconds()))}}c(r,n,o)}}function l(t){var e=t||i.latestSelectedDateObj;e&&e instanceof Date&&c(e.getHours(),e.getMinutes(),e.getSeconds())}function c(t,e,r){void 0!==i.latestSelectedDateObj&&i.latestSelectedDateObj.setHours(t%24,e,r||0,0),i.hourElement&&i.minuteElement&&!i.isMobile&&(i.hourElement.value=Zl(i.config.time_24hr?t:(12+t)%12+12*Ql(t%12==0)),i.minuteElement.value=Zl(e),void 0!==i.amPM&&(i.amPM.textContent=i.l10n.amPM[Ql(t>=12)]),void 0!==i.secondElement&&(i.secondElement.value=Zl(r)))}function d(t){var e=sc(t),i=parseInt(e.value)+(t.delta||0);(i/1e3>1||"Enter"===t.key&&!/[^\d]/.test(i.toString()))&&z(i)}function h(t,e,r,n){return e instanceof Array?e.forEach((function(e){return h(t,e,r,n)})):t instanceof Array?t.forEach((function(t){return h(t,e,r,n)})):(t.addEventListener(e,r,n),void i._handlers.push({remove:function(){return t.removeEventListener(e,r,n)}}))}function u(){G("onChange")}function p(t,e){var r=void 0!==t?i.parseDate(t):i.latestSelectedDateObj||(i.config.minDate&&i.config.minDate>i.now?i.config.minDate:i.config.maxDate&&i.config.maxDate<i.now?i.config.maxDate:i.now),n=i.currentYear,o=i.currentMonth;try{void 0!==r&&(i.currentYear=r.getFullYear(),i.currentMonth=r.getMonth())}catch(t){t.message="Invalid date supplied: "+r,i.config.errorHandler(t)}e&&i.currentYear!==n&&(G("onYearChange"),k()),!e||i.currentYear===n&&i.currentMonth===o||G("onMonthChange"),i.redraw()}function f(t){var e=sc(t);~e.className.indexOf("arrow")&&g(t,e.classList.contains("arrowUp")?1:-1)}function g(t,e,i){var r=t&&sc(t),n=i||r&&r.parentNode&&r.parentNode.firstChild,o=K("increment");o.delta=e,n&&n.dispatchEvent(o)}function m(t,e,r,n){var o=T(e,!0),a=rc("span",t,e.getDate().toString());return a.dateObj=e,a.$i=n,a.setAttribute("aria-label",i.formatDate(e,i.config.ariaDateFormat)),-1===t.indexOf("hidden")&&0===gc(e,i.now)&&(i.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),o?(a.tabIndex=-1,J(e)&&(a.classList.add("selected"),i.selectedDateElem=a,"range"===i.config.mode&&(ic(a,"startRange",i.selectedDates[0]&&0===gc(e,i.selectedDates[0],!0)),ic(a,"endRange",i.selectedDates[1]&&0===gc(e,i.selectedDates[1],!0)),"nextMonthDay"===t&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===i.config.mode&&function(t){return!("range"!==i.config.mode||i.selectedDates.length<2)&&(gc(t,i.selectedDates[0])>=0&&gc(t,i.selectedDates[1])<=0)}(e)&&!J(e)&&a.classList.add("inRange"),i.weekNumbers&&1===i.config.showMonths&&"prevMonthDay"!==t&&n%7==6&&i.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+i.config.getWeek(e)+"</span>"),G("onDayCreate",a),a}function v(t){t.focus(),"range"===i.config.mode&&A(t)}function b(t){for(var e=t>0?0:i.config.showMonths-1,r=t>0?i.config.showMonths:-1,n=e;n!=r;n+=t)for(var o=i.daysContainer.children[n],a=t>0?0:o.children.length-1,s=t>0?o.children.length:-1,l=a;l!=s;l+=t){var c=o.children[l];if(-1===c.className.indexOf("hidden")&&T(c.dateObj))return c}}function y(t,e){var n=r(),o=I(n||document.body),a=void 0!==t?t:o?n:void 0!==i.selectedDateElem&&I(i.selectedDateElem)?i.selectedDateElem:void 0!==i.todayDateElem&&I(i.todayDateElem)?i.todayDateElem:b(e>0?1:-1);void 0===a?i._input.focus():o?function(t,e){for(var r=-1===t.className.indexOf("Month")?t.dateObj.getMonth():i.currentMonth,n=e>0?i.config.showMonths:-1,o=e>0?1:-1,a=r-i.currentMonth;a!=n;a+=o)for(var s=i.daysContainer.children[a],l=r-i.currentMonth===a?t.$i+e:e<0?s.children.length-1:0,c=s.children.length,d=l;d>=0&&d<c&&d!=(e>0?c:-1);d+=o){var h=s.children[d];if(-1===h.className.indexOf("hidden")&&T(h.dateObj)&&Math.abs(t.$i-d)>=Math.abs(e))return v(h)}i.changeMonth(o),y(b(o),0)}(a,e):v(a)}function w(t,e){for(var r=(new Date(t,e,1).getDay()-i.l10n.firstDayOfWeek+7)%7,n=i.utils.getDaysInMonth((e-1+12)%12,t),o=i.utils.getDaysInMonth(e,t),a=window.document.createDocumentFragment(),s=i.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",d=n+1-r,h=0;d<=n;d++,h++)a.appendChild(m("flatpickr-day "+l,new Date(t,e-1,d),0,h));for(d=1;d<=o;d++,h++)a.appendChild(m("flatpickr-day",new Date(t,e,d),0,h));for(var u=o+1;u<=42-r&&(1===i.config.showMonths||h%7!=0);u++,h++)a.appendChild(m("flatpickr-day "+c,new Date(t,e+1,u%o),0,h));var p=rc("div","dayContainer");return p.appendChild(a),p}function x(){if(void 0!==i.daysContainer){nc(i.daysContainer),i.weekNumbers&&nc(i.weekNumbers);for(var t=document.createDocumentFragment(),e=0;e<i.config.showMonths;e++){var r=new Date(i.currentYear,i.currentMonth,1);r.setMonth(i.currentMonth+e),t.appendChild(w(r.getFullYear(),r.getMonth()))}i.daysContainer.appendChild(t),i.days=i.daysContainer.firstChild,"range"===i.config.mode&&1===i.selectedDates.length&&A()}}function k(){if(!(i.config.showMonths>1||"dropdown"!==i.config.monthSelectorType)){var t=function(t){return!(void 0!==i.config.minDate&&i.currentYear===i.config.minDate.getFullYear()&&t<i.config.minDate.getMonth())&&!(void 0!==i.config.maxDate&&i.currentYear===i.config.maxDate.getFullYear()&&t>i.config.maxDate.getMonth())};i.monthsDropdownContainer.tabIndex=-1,i.monthsDropdownContainer.innerHTML="";for(var e=0;e<12;e++)if(t(e)){var r=rc("option","flatpickr-monthDropdown-month");r.value=new Date(i.currentYear,e).getMonth().toString(),r.textContent=cc(e,i.config.shorthandCurrentMonth,i.l10n),r.tabIndex=-1,i.currentMonth===e&&(r.selected=!0),i.monthsDropdownContainer.appendChild(r)}}}function $(){var t,e=rc("div","flatpickr-month"),r=window.document.createDocumentFragment();i.config.showMonths>1||"static"===i.config.monthSelectorType?t=rc("span","cur-month"):(i.monthsDropdownContainer=rc("select","flatpickr-monthDropdown-months"),i.monthsDropdownContainer.setAttribute("aria-label",i.l10n.monthAriaLabel),h(i.monthsDropdownContainer,"change",(function(t){var e=sc(t),r=parseInt(e.value,10);i.changeMonth(r-i.currentMonth),G("onMonthChange")})),k(),t=i.monthsDropdownContainer);var n=ac("cur-year",{tabindex:"-1"}),o=n.getElementsByTagName("input")[0];o.setAttribute("aria-label",i.l10n.yearAriaLabel),i.config.minDate&&o.setAttribute("min",i.config.minDate.getFullYear().toString()),i.config.maxDate&&(o.setAttribute("max",i.config.maxDate.getFullYear().toString()),o.disabled=!!i.config.minDate&&i.config.minDate.getFullYear()===i.config.maxDate.getFullYear());var a=rc("div","flatpickr-current-month");return a.appendChild(t),a.appendChild(n),r.appendChild(a),e.appendChild(r),{container:e,yearElement:o,monthElement:t}}function C(){nc(i.monthNav),i.monthNav.appendChild(i.prevMonthNav),i.config.showMonths&&(i.yearElements=[],i.monthElements=[]);for(var t=i.config.showMonths;t--;){var e=$();i.yearElements.push(e.yearElement),i.monthElements.push(e.monthElement),i.monthNav.appendChild(e.container)}i.monthNav.appendChild(i.nextMonthNav)}function M(){i.weekdayContainer?nc(i.weekdayContainer):i.weekdayContainer=rc("div","flatpickr-weekdays");for(var t=i.config.showMonths;t--;){var e=rc("div","flatpickr-weekdaycontainer");i.weekdayContainer.appendChild(e)}return S(),i.weekdayContainer}function S(){if(i.weekdayContainer){var t=i.l10n.firstDayOfWeek,e=kc(i.l10n.weekdays.shorthand);t>0&&t<e.length&&(e=kc(e.splice(t,e.length),e.splice(0,t)));for(var r=i.config.showMonths;r--;)i.weekdayContainer.children[r].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+e.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      "}}function j(t,e){void 0===e&&(e=!0);var r=e?t:t-i.currentMonth;r<0&&!0===i._hidePrevMonthArrow||r>0&&!0===i._hideNextMonthArrow||(i.currentMonth+=r,(i.currentMonth<0||i.currentMonth>11)&&(i.currentYear+=i.currentMonth>11?1:-1,i.currentMonth=(i.currentMonth+12)%12,G("onYearChange"),k()),x(),G("onMonthChange"),X())}function D(t){return i.calendarContainer.contains(t)}function O(t){if(i.isOpen&&!i.config.inline){var e=sc(t),r=D(e),n=!(e===i.input||e===i.altInput||i.element.contains(e)||t.path&&t.path.indexOf&&(~t.path.indexOf(i.input)||~t.path.indexOf(i.altInput)))&&!r&&!D(t.relatedTarget),o=!i.config.ignoredFocusElements.some((function(t){return t.contains(e)}));n&&o&&(i.config.allowInput&&i.setDate(i._input.value,!1,i.config.altInput?i.config.altFormat:i.config.dateFormat),void 0!==i.timeContainer&&void 0!==i.minuteElement&&void 0!==i.hourElement&&""!==i.input.value&&void 0!==i.input.value&&a(),i.close(),i.config&&"range"===i.config.mode&&1===i.selectedDates.length&&i.clear(!1))}}function z(t){if(!(!t||i.config.minDate&&t<i.config.minDate.getFullYear()||i.config.maxDate&&t>i.config.maxDate.getFullYear())){var e=t,r=i.currentYear!==e;i.currentYear=e||i.currentYear,i.config.maxDate&&i.currentYear===i.config.maxDate.getFullYear()?i.currentMonth=Math.min(i.config.maxDate.getMonth(),i.currentMonth):i.config.minDate&&i.currentYear===i.config.minDate.getFullYear()&&(i.currentMonth=Math.max(i.config.minDate.getMonth(),i.currentMonth)),r&&(i.redraw(),G("onYearChange"),k())}}function T(t,e){var r;void 0===e&&(e=!0);var n=i.parseDate(t,void 0,e);if(i.config.minDate&&n&&gc(n,i.config.minDate,void 0!==e?e:!i.minDateHasTime)<0||i.config.maxDate&&n&&gc(n,i.config.maxDate,void 0!==e?e:!i.maxDateHasTime)>0)return!1;if(!i.config.enable&&0===i.config.disable.length)return!0;if(void 0===n)return!1;for(var o=!!i.config.enable,a=null!==(r=i.config.enable)&&void 0!==r?r:i.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(n))return o;if(l instanceof Date&&void 0!==n&&l.getTime()===n.getTime())return o;if("string"==typeof l){var c=i.parseDate(l,void 0,!0);return c&&c.getTime()===n.getTime()?o:!o}if("object"==typeof l&&void 0!==n&&l.from&&l.to&&n.getTime()>=l.from.getTime()&&n.getTime()<=l.to.getTime())return o}return!o}function I(t){return void 0!==i.daysContainer&&(-1===t.className.indexOf("hidden")&&-1===t.className.indexOf("flatpickr-disabled")&&i.daysContainer.contains(t))}function R(t){var e=t.target===i._input,r=i._input.value.trimEnd()!==Z();!e||!r||t.relatedTarget&&D(t.relatedTarget)||i.setDate(i._input.value,!0,t.target===i.altInput?i.config.altFormat:i.config.dateFormat)}function _(e){var n=sc(e),o=i.config.wrap?t.contains(n):n===i._input,l=i.config.allowInput,c=i.isOpen&&(!l||!o),d=i.config.inline&&o&&!l;if(13===e.keyCode&&o){if(l)return i.setDate(i._input.value,!0,n===i.altInput?i.config.altFormat:i.config.dateFormat),i.close(),n.blur();i.open()}else if(D(n)||c||d){var h=!!i.timeContainer&&i.timeContainer.contains(n);switch(e.keyCode){case 13:h?(e.preventDefault(),a(),P()):q(e);break;case 27:e.preventDefault(),P();break;case 8:case 46:o&&!i.config.allowInput&&(e.preventDefault(),i.clear());break;case 37:case 39:if(h||o)i.hourElement&&i.hourElement.focus();else{e.preventDefault();var u=r();if(void 0!==i.daysContainer&&(!1===l||u&&I(u))){var p=39===e.keyCode?1:-1;e.ctrlKey?(e.stopPropagation(),j(p),y(b(1),0)):y(void 0,p)}}break;case 38:case 40:e.preventDefault();var f=40===e.keyCode?1:-1;i.daysContainer&&void 0!==n.$i||n===i.input||n===i.altInput?e.ctrlKey?(e.stopPropagation(),z(i.currentYear-f),y(b(1),0)):h||y(void 0,7*f):n===i.currentYearElement?z(i.currentYear-f):i.config.enableTime&&(!h&&i.hourElement&&i.hourElement.focus(),a(e),i._debouncedChange());break;case 9:if(h){var g=[i.hourElement,i.minuteElement,i.secondElement,i.amPM].concat(i.pluginElements).filter((function(t){return t})),m=g.indexOf(n);if(-1!==m){var v=g[m+(e.shiftKey?-1:1)];e.preventDefault(),(v||i._input).focus()}}else!i.config.noCalendar&&i.daysContainer&&i.daysContainer.contains(n)&&e.shiftKey&&(e.preventDefault(),i._input.focus())}}if(void 0!==i.amPM&&n===i.amPM)switch(e.key){case i.l10n.amPM[0].charAt(0):case i.l10n.amPM[0].charAt(0).toLowerCase():i.amPM.textContent=i.l10n.amPM[0],s(),Q();break;case i.l10n.amPM[1].charAt(0):case i.l10n.amPM[1].charAt(0).toLowerCase():i.amPM.textContent=i.l10n.amPM[1],s(),Q()}(o||D(n))&&G("onKeyDown",e)}function A(t,e){if(void 0===e&&(e="flatpickr-day"),1===i.selectedDates.length&&(!t||t.classList.contains(e)&&!t.classList.contains("flatpickr-disabled"))){for(var r=t?t.dateObj.getTime():i.days.firstElementChild.dateObj.getTime(),n=i.parseDate(i.selectedDates[0],void 0,!0).getTime(),o=Math.min(r,i.selectedDates[0].getTime()),a=Math.max(r,i.selectedDates[0].getTime()),s=!1,l=0,c=0,d=o;d<a;d+=yc.DAY)T(new Date(d),!0)||(s=s||d>o&&d<a,d<n&&(!l||d>l)?l=d:d>n&&(!c||d<c)&&(c=d));Array.from(i.rContainer.querySelectorAll("*:nth-child(-n+"+i.config.showMonths+") > ."+e)).forEach((function(e){var o=e.dateObj.getTime(),a=l>0&&o<l||c>0&&o>c;if(a)return e.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach((function(t){e.classList.remove(t)}));s&&!a||(["startRange","inRange","endRange","notAllowed"].forEach((function(t){e.classList.remove(t)})),void 0!==t&&(t.classList.add(r<=i.selectedDates[0].getTime()?"startRange":"endRange"),n<r&&o===n?e.classList.add("startRange"):n>r&&o===n&&e.classList.add("endRange"),o>=l&&(0===c||o<=c)&&mc(o,n,r)&&e.classList.add("inRange")))}))}}function N(){!i.isOpen||i.config.static||i.config.inline||E()}function U(t){return function(e){var r=i.config["_"+t+"Date"]=i.parseDate(e,i.config.dateFormat),n=i.config["_"+("min"===t?"max":"min")+"Date"];void 0!==r&&(i["min"===t?"minDateHasTime":"maxDateHasTime"]=r.getHours()>0||r.getMinutes()>0||r.getSeconds()>0),i.selectedDates&&(i.selectedDates=i.selectedDates.filter((function(t){return T(t)})),i.selectedDates.length||"min"!==t||l(r),Q()),i.daysContainer&&(F(),void 0!==r?i.currentYearElement[t]=r.getFullYear().toString():i.currentYearElement.removeAttribute(t),i.currentYearElement.disabled=!!n&&void 0!==r&&n.getFullYear()===r.getFullYear())}}function B(){return i.config.wrap?t.querySelector("[data-input]"):t}function L(){"object"!=typeof i.config.locale&&void 0===Sc.l10ns[i.config.locale]&&i.config.errorHandler(new Error("flatpickr: invalid locale "+i.config.locale)),i.l10n=xc(xc({},Sc.l10ns.default),"object"==typeof i.config.locale?i.config.locale:"default"!==i.config.locale?Sc.l10ns[i.config.locale]:void 0),hc.D="("+i.l10n.weekdays.shorthand.join("|")+")",hc.l="("+i.l10n.weekdays.longhand.join("|")+")",hc.M="("+i.l10n.months.shorthand.join("|")+")",hc.F="("+i.l10n.months.longhand.join("|")+")",hc.K="("+i.l10n.amPM[0]+"|"+i.l10n.amPM[1]+"|"+i.l10n.amPM[0].toLowerCase()+"|"+i.l10n.amPM[1].toLowerCase()+")",void 0===xc(xc({},e),JSON.parse(JSON.stringify(t.dataset||{}))).time_24hr&&void 0===Sc.defaultConfig.time_24hr&&(i.config.time_24hr=i.l10n.time_24hr),i.formatDate=pc(i),i.parseDate=fc({config:i.config,l10n:i.l10n})}function E(t){if("function"!=typeof i.config.position){if(void 0!==i.calendarContainer){G("onPreCalendarPosition");var e=t||i._positionElement,r=Array.prototype.reduce.call(i.calendarContainer.children,(function(t,e){return t+e.offsetHeight}),0),n=i.calendarContainer.offsetWidth,o=i.config.position.split(" "),a=o[0],s=o.length>1?o[1]:null,l=e.getBoundingClientRect(),c=window.innerHeight-l.bottom,d="above"===a||"below"!==a&&c<r&&l.top>r,h=window.pageYOffset+l.top+(d?-r-2:e.offsetHeight+2);if(ic(i.calendarContainer,"arrowTop",!d),ic(i.calendarContainer,"arrowBottom",d),!i.config.inline){var u=window.pageXOffset+l.left,p=!1,f=!1;"center"===s?(u-=(n-l.width)/2,p=!0):"right"===s&&(u-=n-l.width,f=!0),ic(i.calendarContainer,"arrowLeft",!p&&!f),ic(i.calendarContainer,"arrowCenter",p),ic(i.calendarContainer,"arrowRight",f);var g=window.document.body.offsetWidth-(window.pageXOffset+l.right),m=u+n>window.document.body.offsetWidth,v=g+n>window.document.body.offsetWidth;if(ic(i.calendarContainer,"rightMost",m),!i.config.static)if(i.calendarContainer.style.top=h+"px",m)if(v){var b=function(){for(var t=null,e=0;e<document.styleSheets.length;e++){var i=document.styleSheets[e];if(i.cssRules){try{i.cssRules}catch(t){continue}t=i;break}}return null!=t?t:(r=document.createElement("style"),document.head.appendChild(r),r.sheet);var r}();if(void 0===b)return;var y=window.document.body.offsetWidth,w=Math.max(0,y/2-n/2),x=b.cssRules.length,k="{left:"+l.left+"px;right:auto;}";ic(i.calendarContainer,"rightMost",!1),ic(i.calendarContainer,"centerMost",!0),b.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+k,x),i.calendarContainer.style.left=w+"px",i.calendarContainer.style.right="auto"}else i.calendarContainer.style.left="auto",i.calendarContainer.style.right=g+"px";else i.calendarContainer.style.left=u+"px",i.calendarContainer.style.right="auto"}}}else i.config.position(i,t)}function F(){i.config.noCalendar||i.isMobile||(k(),X(),x())}function P(){i._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(i.close,0):i.close()}function q(t){t.preventDefault(),t.stopPropagation();var e=oc(sc(t),(function(t){return t.classList&&t.classList.contains("flatpickr-day")&&!t.classList.contains("flatpickr-disabled")&&!t.classList.contains("notAllowed")}));if(void 0!==e){var r=e,n=i.latestSelectedDateObj=new Date(r.dateObj.getTime()),o=(n.getMonth()<i.currentMonth||n.getMonth()>i.currentMonth+i.config.showMonths-1)&&"range"!==i.config.mode;if(i.selectedDateElem=r,"single"===i.config.mode)i.selectedDates=[n];else if("multiple"===i.config.mode){var a=J(n);a?i.selectedDates.splice(parseInt(a),1):i.selectedDates.push(n)}else"range"===i.config.mode&&(2===i.selectedDates.length&&i.clear(!1,!1),i.latestSelectedDateObj=n,i.selectedDates.push(n),0!==gc(n,i.selectedDates[0],!0)&&i.selectedDates.sort((function(t,e){return t.getTime()-e.getTime()})));if(s(),o){var l=i.currentYear!==n.getFullYear();i.currentYear=n.getFullYear(),i.currentMonth=n.getMonth(),l&&(G("onYearChange"),k()),G("onMonthChange")}if(X(),x(),Q(),o||"range"===i.config.mode||1!==i.config.showMonths?void 0!==i.selectedDateElem&&void 0===i.hourElement&&i.selectedDateElem&&i.selectedDateElem.focus():v(r),void 0!==i.hourElement&&void 0!==i.hourElement&&i.hourElement.focus(),i.config.closeOnSelect){var c="single"===i.config.mode&&!i.config.enableTime,d="range"===i.config.mode&&2===i.selectedDates.length&&!i.config.enableTime;(c||d)&&P()}u()}}i.parseDate=fc({config:i.config,l10n:i.l10n}),i._handlers=[],i.pluginElements=[],i.loadedPlugins=[],i._bind=h,i._setHoursFromDate=l,i._positionCalendar=E,i.changeMonth=j,i.changeYear=z,i.clear=function(t,e){void 0===t&&(t=!0);void 0===e&&(e=!0);i.input.value="",void 0!==i.altInput&&(i.altInput.value="");void 0!==i.mobileInput&&(i.mobileInput.value="");i.selectedDates=[],i.latestSelectedDateObj=void 0,!0===e&&(i.currentYear=i._initialDate.getFullYear(),i.currentMonth=i._initialDate.getMonth());if(!0===i.config.enableTime){var r=wc(i.config);c(r.hours,r.minutes,r.seconds)}i.redraw(),t&&G("onChange")},i.close=function(){i.isOpen=!1,i.isMobile||(void 0!==i.calendarContainer&&i.calendarContainer.classList.remove("open"),void 0!==i._input&&i._input.classList.remove("active"));G("onClose")},i.onMouseOver=A,i._createElement=rc,i.createDay=m,i.destroy=function(){void 0!==i.config&&G("onDestroy");for(var t=i._handlers.length;t--;)i._handlers[t].remove();if(i._handlers=[],i.mobileInput)i.mobileInput.parentNode&&i.mobileInput.parentNode.removeChild(i.mobileInput),i.mobileInput=void 0;else if(i.calendarContainer&&i.calendarContainer.parentNode)if(i.config.static&&i.calendarContainer.parentNode){var e=i.calendarContainer.parentNode;if(e.lastChild&&e.removeChild(e.lastChild),e.parentNode){for(;e.firstChild;)e.parentNode.insertBefore(e.firstChild,e);e.parentNode.removeChild(e)}}else i.calendarContainer.parentNode.removeChild(i.calendarContainer);i.altInput&&(i.input.type="text",i.altInput.parentNode&&i.altInput.parentNode.removeChild(i.altInput),delete i.altInput);i.input&&(i.input.type=i.input._type,i.input.classList.remove("flatpickr-input"),i.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach((function(t){try{delete i[t]}catch(t){}}))},i.isEnabled=T,i.jumpToDate=p,i.updateValue=Q,i.open=function(t,e){void 0===e&&(e=i._positionElement);if(!0===i.isMobile){if(t){t.preventDefault();var r=sc(t);r&&r.blur()}return void 0!==i.mobileInput&&(i.mobileInput.focus(),i.mobileInput.click()),void G("onOpen")}if(i._input.disabled||i.config.inline)return;var n=i.isOpen;i.isOpen=!0,n||(i.calendarContainer.classList.add("open"),i._input.classList.add("active"),G("onOpen"),E(e));!0===i.config.enableTime&&!0===i.config.noCalendar&&(!1!==i.config.allowInput||void 0!==t&&i.timeContainer.contains(t.relatedTarget)||setTimeout((function(){return i.hourElement.select()}),50))},i.redraw=F,i.set=function(t,e){if(null!==t&&"object"==typeof t)for(var r in Object.assign(i.config,t),t)void 0!==W[r]&&W[r].forEach((function(t){return t()}));else i.config[t]=e,void 0!==W[t]?W[t].forEach((function(t){return t()})):Kl.indexOf(t)>-1&&(i.config[t]=ec(e));i.redraw(),Q(!0)},i.setDate=function(t,e,r){void 0===e&&(e=!1);void 0===r&&(r=i.config.dateFormat);if(0!==t&&!t||t instanceof Array&&0===t.length)return i.clear(e);H(t,r),i.latestSelectedDateObj=i.selectedDates[i.selectedDates.length-1],i.redraw(),p(void 0,e),l(),0===i.selectedDates.length&&i.clear(!1);Q(e),e&&G("onChange")},i.toggle=function(t){if(!0===i.isOpen)return i.close();i.open(t)};var W={locale:[L,S],showMonths:[C,o,M],minDate:[p],maxDate:[p],positionElement:[Y],clickOpens:[function(){!0===i.config.clickOpens?(h(i._input,"focus",i.open),h(i._input,"click",i.open)):(i._input.removeEventListener("focus",i.open),i._input.removeEventListener("click",i.open))}]};function H(t,e){var r=[];if(t instanceof Array)r=t.map((function(t){return i.parseDate(t,e)}));else if(t instanceof Date||"number"==typeof t)r=[i.parseDate(t,e)];else if("string"==typeof t)switch(i.config.mode){case"single":case"time":r=[i.parseDate(t,e)];break;case"multiple":r=t.split(i.config.conjunction).map((function(t){return i.parseDate(t,e)}));break;case"range":r=t.split(i.l10n.rangeSeparator).map((function(t){return i.parseDate(t,e)}))}else i.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(t)));i.selectedDates=i.config.allowInvalidPreload?r:r.filter((function(t){return t instanceof Date&&T(t,!1)})),"range"===i.config.mode&&i.selectedDates.sort((function(t,e){return t.getTime()-e.getTime()}))}function V(t){return t.slice().map((function(t){return"string"==typeof t||"number"==typeof t||t instanceof Date?i.parseDate(t,void 0,!0):t&&"object"==typeof t&&t.from&&t.to?{from:i.parseDate(t.from,void 0),to:i.parseDate(t.to,void 0)}:t})).filter((function(t){return t}))}function Y(){i._positionElement=i.config.positionElement||i._input}function G(t,e){if(void 0!==i.config){var r=i.config[t];if(void 0!==r&&r.length>0)for(var n=0;r[n]&&n<r.length;n++)r[n](i.selectedDates,i.input.value,i,e);"onChange"===t&&(i.input.dispatchEvent(K("change")),i.input.dispatchEvent(K("input")))}}function K(t){var e=document.createEvent("Event");return e.initEvent(t,!0,!0),e}function J(t){for(var e=0;e<i.selectedDates.length;e++){var r=i.selectedDates[e];if(r instanceof Date&&0===gc(r,t))return""+e}return!1}function X(){i.config.noCalendar||i.isMobile||!i.monthNav||(i.yearElements.forEach((function(t,e){var r=new Date(i.currentYear,i.currentMonth,1);r.setMonth(i.currentMonth+e),i.config.showMonths>1||"static"===i.config.monthSelectorType?i.monthElements[e].textContent=cc(r.getMonth(),i.config.shorthandCurrentMonth,i.l10n)+" ":i.monthsDropdownContainer.value=r.getMonth().toString(),t.value=r.getFullYear().toString()})),i._hidePrevMonthArrow=void 0!==i.config.minDate&&(i.currentYear===i.config.minDate.getFullYear()?i.currentMonth<=i.config.minDate.getMonth():i.currentYear<i.config.minDate.getFullYear()),i._hideNextMonthArrow=void 0!==i.config.maxDate&&(i.currentYear===i.config.maxDate.getFullYear()?i.currentMonth+1>i.config.maxDate.getMonth():i.currentYear>i.config.maxDate.getFullYear()))}function Z(t){var e=t||(i.config.altInput?i.config.altFormat:i.config.dateFormat);return i.selectedDates.map((function(t){return i.formatDate(t,e)})).filter((function(t,e,r){return"range"!==i.config.mode||i.config.enableTime||r.indexOf(t)===e})).join("range"!==i.config.mode?i.config.conjunction:i.l10n.rangeSeparator)}function Q(t){void 0===t&&(t=!0),void 0!==i.mobileInput&&i.mobileFormatStr&&(i.mobileInput.value=void 0!==i.latestSelectedDateObj?i.formatDate(i.latestSelectedDateObj,i.mobileFormatStr):""),i.input.value=Z(i.config.dateFormat),void 0!==i.altInput&&(i.altInput.value=Z(i.config.altFormat)),!1!==t&&G("onValueUpdate")}function tt(t){var e=sc(t),r=i.prevMonthNav.contains(e),n=i.nextMonthNav.contains(e);r||n?j(r?-1:1):i.yearElements.indexOf(e)>=0?e.select():e.classList.contains("arrowUp")?i.changeYear(i.currentYear+1):e.classList.contains("arrowDown")&&i.changeYear(i.currentYear-1)}return function(){i.element=i.input=t,i.isOpen=!1,function(){var r=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],o=xc(xc({},JSON.parse(JSON.stringify(t.dataset||{}))),e),a={};i.config.parseDate=o.parseDate,i.config.formatDate=o.formatDate,Object.defineProperty(i.config,"enable",{get:function(){return i.config._enable},set:function(t){i.config._enable=V(t)}}),Object.defineProperty(i.config,"disable",{get:function(){return i.config._disable},set:function(t){i.config._disable=V(t)}});var s="time"===o.mode;if(!o.dateFormat&&(o.enableTime||s)){var l=Sc.defaultConfig.dateFormat||Jl.dateFormat;a.dateFormat=o.noCalendar||s?"H:i"+(o.enableSeconds?":S":""):l+" H:i"+(o.enableSeconds?":S":"")}if(o.altInput&&(o.enableTime||s)&&!o.altFormat){var c=Sc.defaultConfig.altFormat||Jl.altFormat;a.altFormat=o.noCalendar||s?"h:i"+(o.enableSeconds?":S K":" K"):c+" h:i"+(o.enableSeconds?":S":"")+" K"}Object.defineProperty(i.config,"minDate",{get:function(){return i.config._minDate},set:U("min")}),Object.defineProperty(i.config,"maxDate",{get:function(){return i.config._maxDate},set:U("max")});var d=function(t){return function(e){i.config["min"===t?"_minTime":"_maxTime"]=i.parseDate(e,"H:i:S")}};Object.defineProperty(i.config,"minTime",{get:function(){return i.config._minTime},set:d("min")}),Object.defineProperty(i.config,"maxTime",{get:function(){return i.config._maxTime},set:d("max")}),"time"===o.mode&&(i.config.noCalendar=!0,i.config.enableTime=!0);Object.assign(i.config,a,o);for(var h=0;h<r.length;h++)i.config[r[h]]=!0===i.config[r[h]]||"true"===i.config[r[h]];Kl.filter((function(t){return void 0!==i.config[t]})).forEach((function(t){i.config[t]=ec(i.config[t]||[]).map(n)})),i.isMobile=!i.config.disableMobile&&!i.config.inline&&"single"===i.config.mode&&!i.config.disable.length&&!i.config.enable&&!i.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(h=0;h<i.config.plugins.length;h++){var u=i.config.plugins[h](i)||{};for(var p in u)Kl.indexOf(p)>-1?i.config[p]=ec(u[p]).map(n).concat(i.config[p]):void 0===o[p]&&(i.config[p]=u[p])}o.altInputClass||(i.config.altInputClass=B().className+" "+i.config.altInputClass);G("onParseConfig")}(),L(),function(){if(i.input=B(),!i.input)return void i.config.errorHandler(new Error("Invalid input element specified"));i.input._type=i.input.type,i.input.type="text",i.input.classList.add("flatpickr-input"),i._input=i.input,i.config.altInput&&(i.altInput=rc(i.input.nodeName,i.config.altInputClass),i._input=i.altInput,i.altInput.placeholder=i.input.placeholder,i.altInput.disabled=i.input.disabled,i.altInput.required=i.input.required,i.altInput.tabIndex=i.input.tabIndex,i.altInput.type="text",i.input.setAttribute("type","hidden"),!i.config.static&&i.input.parentNode&&i.input.parentNode.insertBefore(i.altInput,i.input.nextSibling));i.config.allowInput||i._input.setAttribute("readonly","readonly");Y()}(),function(){i.selectedDates=[],i.now=i.parseDate(i.config.now)||new Date;var t=i.config.defaultDate||("INPUT"!==i.input.nodeName&&"TEXTAREA"!==i.input.nodeName||!i.input.placeholder||i.input.value!==i.input.placeholder?i.input.value:null);t&&H(t,i.config.dateFormat);i._initialDate=i.selectedDates.length>0?i.selectedDates[0]:i.config.minDate&&i.config.minDate.getTime()>i.now.getTime()?i.config.minDate:i.config.maxDate&&i.config.maxDate.getTime()<i.now.getTime()?i.config.maxDate:i.now,i.currentYear=i._initialDate.getFullYear(),i.currentMonth=i._initialDate.getMonth(),i.selectedDates.length>0&&(i.latestSelectedDateObj=i.selectedDates[0]);void 0!==i.config.minTime&&(i.config.minTime=i.parseDate(i.config.minTime,"H:i"));void 0!==i.config.maxTime&&(i.config.maxTime=i.parseDate(i.config.maxTime,"H:i"));i.minDateHasTime=!!i.config.minDate&&(i.config.minDate.getHours()>0||i.config.minDate.getMinutes()>0||i.config.minDate.getSeconds()>0),i.maxDateHasTime=!!i.config.maxDate&&(i.config.maxDate.getHours()>0||i.config.maxDate.getMinutes()>0||i.config.maxDate.getSeconds()>0)}(),i.utils={getDaysInMonth:function(t,e){return void 0===t&&(t=i.currentMonth),void 0===e&&(e=i.currentYear),1===t&&(e%4==0&&e%100!=0||e%400==0)?29:i.l10n.daysInMonth[t]}},i.isMobile||function(){var t=window.document.createDocumentFragment();if(i.calendarContainer=rc("div","flatpickr-calendar"),i.calendarContainer.tabIndex=-1,!i.config.noCalendar){if(t.appendChild((i.monthNav=rc("div","flatpickr-months"),i.yearElements=[],i.monthElements=[],i.prevMonthNav=rc("span","flatpickr-prev-month"),i.prevMonthNav.innerHTML=i.config.prevArrow,i.nextMonthNav=rc("span","flatpickr-next-month"),i.nextMonthNav.innerHTML=i.config.nextArrow,C(),Object.defineProperty(i,"_hidePrevMonthArrow",{get:function(){return i.R},set:function(t){i.R!==t&&(ic(i.prevMonthNav,"flatpickr-disabled",t),i.R=t)}}),Object.defineProperty(i,"_hideNextMonthArrow",{get:function(){return i.A},set:function(t){i.A!==t&&(ic(i.nextMonthNav,"flatpickr-disabled",t),i.A=t)}}),i.currentYearElement=i.yearElements[0],X(),i.monthNav)),i.innerContainer=rc("div","flatpickr-innerContainer"),i.config.weekNumbers){var e=function(){i.calendarContainer.classList.add("hasWeeks");var t=rc("div","flatpickr-weekwrapper");t.appendChild(rc("span","flatpickr-weekday",i.l10n.weekAbbreviation));var e=rc("div","flatpickr-weeks");return t.appendChild(e),{weekWrapper:t,weekNumbers:e}}(),r=e.weekWrapper,n=e.weekNumbers;i.innerContainer.appendChild(r),i.weekNumbers=n,i.weekWrapper=r}i.rContainer=rc("div","flatpickr-rContainer"),i.rContainer.appendChild(M()),i.daysContainer||(i.daysContainer=rc("div","flatpickr-days"),i.daysContainer.tabIndex=-1),x(),i.rContainer.appendChild(i.daysContainer),i.innerContainer.appendChild(i.rContainer),t.appendChild(i.innerContainer)}i.config.enableTime&&t.appendChild(function(){i.calendarContainer.classList.add("hasTime"),i.config.noCalendar&&i.calendarContainer.classList.add("noCalendar");var t=wc(i.config);i.timeContainer=rc("div","flatpickr-time"),i.timeContainer.tabIndex=-1;var e=rc("span","flatpickr-time-separator",":"),r=ac("flatpickr-hour",{"aria-label":i.l10n.hourAriaLabel});i.hourElement=r.getElementsByTagName("input")[0];var n=ac("flatpickr-minute",{"aria-label":i.l10n.minuteAriaLabel});i.minuteElement=n.getElementsByTagName("input")[0],i.hourElement.tabIndex=i.minuteElement.tabIndex=-1,i.hourElement.value=Zl(i.latestSelectedDateObj?i.latestSelectedDateObj.getHours():i.config.time_24hr?t.hours:function(t){switch(t%24){case 0:case 12:return 12;default:return t%12}}(t.hours)),i.minuteElement.value=Zl(i.latestSelectedDateObj?i.latestSelectedDateObj.getMinutes():t.minutes),i.hourElement.setAttribute("step",i.config.hourIncrement.toString()),i.minuteElement.setAttribute("step",i.config.minuteIncrement.toString()),i.hourElement.setAttribute("min",i.config.time_24hr?"0":"1"),i.hourElement.setAttribute("max",i.config.time_24hr?"23":"12"),i.hourElement.setAttribute("maxlength","2"),i.minuteElement.setAttribute("min","0"),i.minuteElement.setAttribute("max","59"),i.minuteElement.setAttribute("maxlength","2"),i.timeContainer.appendChild(r),i.timeContainer.appendChild(e),i.timeContainer.appendChild(n),i.config.time_24hr&&i.timeContainer.classList.add("time24hr");if(i.config.enableSeconds){i.timeContainer.classList.add("hasSeconds");var o=ac("flatpickr-second");i.secondElement=o.getElementsByTagName("input")[0],i.secondElement.value=Zl(i.latestSelectedDateObj?i.latestSelectedDateObj.getSeconds():t.seconds),i.secondElement.setAttribute("step",i.minuteElement.getAttribute("step")),i.secondElement.setAttribute("min","0"),i.secondElement.setAttribute("max","59"),i.secondElement.setAttribute("maxlength","2"),i.timeContainer.appendChild(rc("span","flatpickr-time-separator",":")),i.timeContainer.appendChild(o)}i.config.time_24hr||(i.amPM=rc("span","flatpickr-am-pm",i.l10n.amPM[Ql((i.latestSelectedDateObj?i.hourElement.value:i.config.defaultHour)>11)]),i.amPM.title=i.l10n.toggleTitle,i.amPM.tabIndex=-1,i.timeContainer.appendChild(i.amPM));return i.timeContainer}());ic(i.calendarContainer,"rangeMode","range"===i.config.mode),ic(i.calendarContainer,"animate",!0===i.config.animate),ic(i.calendarContainer,"multiMonth",i.config.showMonths>1),i.calendarContainer.appendChild(t);var o=void 0!==i.config.appendTo&&void 0!==i.config.appendTo.nodeType;if((i.config.inline||i.config.static)&&(i.calendarContainer.classList.add(i.config.inline?"inline":"static"),i.config.inline&&(!o&&i.element.parentNode?i.element.parentNode.insertBefore(i.calendarContainer,i._input.nextSibling):void 0!==i.config.appendTo&&i.config.appendTo.appendChild(i.calendarContainer)),i.config.static)){var a=rc("div","flatpickr-wrapper");i.element.parentNode&&i.element.parentNode.insertBefore(a,i.element),a.appendChild(i.element),i.altInput&&a.appendChild(i.altInput),a.appendChild(i.calendarContainer)}i.config.static||i.config.inline||(void 0!==i.config.appendTo?i.config.appendTo:window.document.body).appendChild(i.calendarContainer)}(),function(){i.config.wrap&&["open","close","toggle","clear"].forEach((function(t){Array.prototype.forEach.call(i.element.querySelectorAll("[data-"+t+"]"),(function(e){return h(e,"click",i[t])}))}));if(i.isMobile)return void function(){var t=i.config.enableTime?i.config.noCalendar?"time":"datetime-local":"date";i.mobileInput=rc("input",i.input.className+" flatpickr-mobile"),i.mobileInput.tabIndex=1,i.mobileInput.type=t,i.mobileInput.disabled=i.input.disabled,i.mobileInput.required=i.input.required,i.mobileInput.placeholder=i.input.placeholder,i.mobileFormatStr="datetime-local"===t?"Y-m-d\\TH:i:S":"date"===t?"Y-m-d":"H:i:S",i.selectedDates.length>0&&(i.mobileInput.defaultValue=i.mobileInput.value=i.formatDate(i.selectedDates[0],i.mobileFormatStr));i.config.minDate&&(i.mobileInput.min=i.formatDate(i.config.minDate,"Y-m-d"));i.config.maxDate&&(i.mobileInput.max=i.formatDate(i.config.maxDate,"Y-m-d"));i.input.getAttribute("step")&&(i.mobileInput.step=String(i.input.getAttribute("step")));i.input.type="hidden",void 0!==i.altInput&&(i.altInput.type="hidden");try{i.input.parentNode&&i.input.parentNode.insertBefore(i.mobileInput,i.input.nextSibling)}catch(t){}h(i.mobileInput,"change",(function(t){i.setDate(sc(t).value,!1,i.mobileFormatStr),G("onChange"),G("onClose")}))}();var t=tc(N,50);i._debouncedChange=tc(u,$c),i.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&h(i.daysContainer,"mouseover",(function(t){"range"===i.config.mode&&A(sc(t))}));h(i._input,"keydown",_),void 0!==i.calendarContainer&&h(i.calendarContainer,"keydown",_);i.config.inline||i.config.static||h(window,"resize",t);void 0!==window.ontouchstart?h(window.document,"touchstart",O):h(window.document,"mousedown",O);h(window.document,"focus",O,{capture:!0}),!0===i.config.clickOpens&&(h(i._input,"focus",i.open),h(i._input,"click",i.open));void 0!==i.daysContainer&&(h(i.monthNav,"click",tt),h(i.monthNav,["keyup","increment"],d),h(i.daysContainer,"click",q));if(void 0!==i.timeContainer&&void 0!==i.minuteElement&&void 0!==i.hourElement){var e=function(t){return sc(t).select()};h(i.timeContainer,["increment"],a),h(i.timeContainer,"blur",a,{capture:!0}),h(i.timeContainer,"click",f),h([i.hourElement,i.minuteElement],["focus","click"],e),void 0!==i.secondElement&&h(i.secondElement,"focus",(function(){return i.secondElement&&i.secondElement.select()})),void 0!==i.amPM&&h(i.amPM,"click",(function(t){a(t)}))}i.config.allowInput&&h(i._input,"blur",R)}(),(i.selectedDates.length||i.config.noCalendar)&&(i.config.enableTime&&l(i.config.noCalendar?i.latestSelectedDateObj:void 0),Q(!1)),o();var r=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!i.isMobile&&r&&E(),G("onReady")}(),i}function Mc(t,e){for(var i=Array.prototype.slice.call(t).filter((function(t){return t instanceof HTMLElement})),r=[],n=0;n<i.length;n++){var o=i[n];try{if(null!==o.getAttribute("data-fp-omit"))continue;void 0!==o._flatpickr&&(o._flatpickr.destroy(),o._flatpickr=void 0),o._flatpickr=Cc(o,e||{}),r.push(o._flatpickr)}catch(t){console.error(t)}}return 1===r.length?r[0]:r}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(t){return Mc(this,t)},HTMLElement.prototype.flatpickr=function(t){return Mc([this],t)});var Sc=function(t,e){return"string"==typeof t?Mc(window.document.querySelectorAll(t),e):t instanceof Node?Mc([t],e):Mc(t,e)};Sc.defaultConfig={},Sc.l10ns={en:xc({},Xl),default:xc({},Xl)},Sc.localize=function(t){Sc.l10ns.default=xc(xc({},Sc.l10ns.default),t)},Sc.setDefaults=function(t){Sc.defaultConfig=xc(xc({},Sc.defaultConfig),t)},Sc.parseDate=fc({}),Sc.formatDate=pc({}),Sc.compareDates=gc,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(t){return Mc(this,t)}),Date.prototype.fp_incr=function(t){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof t?parseInt(t,10):t))},"undefined"!=typeof window&&(window.flatpickr=Sc);var jc;!function(t){t.light="light",t.dark="dark",t.materialBlue="material_blue",t.materialGreen="material_green",t.materialOrange="material_orange",t.materialRed="material_red",t.airbnb="airbnb",t.confetti="confetti",t.none="none"}(jc||(jc={}));class Dc{constructor(t){this.theme=t,this.theme=t}async initStyles(){const t=`https://npmcdn.com/flatpickr@4.6.9/dist/themes/${this.theme}.css`;this.isThemeLoaded()||(this.appendThemeStyles(t),await this.waitForStyleToLoad((()=>this.isThemeLoaded())))}waitForStyleToLoad(t){return new Promise(((e,i)=>{const r=(i=0)=>{if(t())return e();if(i>10)throw Error("Styles took too long to load, or were not able to be loaded");setTimeout((()=>r(i++)),100)};r()}))}isThemeLoaded(){if(this.theme===jc.none)return!0;return Array.from(document.styleSheets).map((t=>t.href)).some((t=>null!=t&&new RegExp("https://npmcdn.com/flatpickr@4.6.9/dist/themes").test(t)))}appendThemeStyles(t){const e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.href=t,document.head.append(e)}}const Oc="https://npmcdn.com/flatpickr@4.6.9/dist";let zc=class extends Wl{constructor(){super(...arguments),this.placeholder="",this.altFormat="F j, Y",this.altInput=!1,this.altInputClass="",this.allowInput=!1,this.ariaDateFormat="F j, Y",this.clickOpens=!0,this.dateFormat="Y-m-d",this.defaultHour=12,this.defaultMinute=0,this.disable=[],this.disableMobile=!1,this.enable=void 0,this.enableTime=!1,this.enableSeconds=!1,this.hourIncrement=1,this.minuteIncrement=5,this.inline=!1,this.mode="single",this.nextArrow=">",this.prevArrow="<",this.noCalendar=!1,this.position="auto",this.shorthandCurrentMonth=!1,this.showMonths=1,this.static=!1,this.time_24hr=!1,this.weekNumbers=!1,this.wrap=!1,this.theme="light",this.firstDayOfWeek=1,this.defaultToToday=!1,this.weekSelect=!1,this.monthSelect=!1,this.confirmDate=!1,this._hasSlottedElement=!1}static get styles(){return[Vs`
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
      `]}firstUpdated(){this._hasSlottedElement=this.checkForSlottedElement()}updated(){this.init()}getToday(){const t=new Date;return`${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`}checkForSlottedElement(){var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("slot"),i=e?e.assignedNodes().filter(this.removeTextNodes):[];return null!=e&&i&&i.length>0}getSlottedElement(){var t;if(!this._hasSlottedElement)return;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("slot"),i=null==e?void 0:e.assignedNodes().filter(this.removeTextNodes);return!i||i.length<1?void 0:i[0]}removeTextNodes(t){return"#text"!==t.nodeName}async init(){const t=new Dc(this.theme);await t.initStyles(),this.locale&&await async function(t){const e="https://npmcdn.com/flatpickr@4.6.9/dist/l10n/"+t+".js";await import(e)}(this.locale),await this.initializeComponent()}async getOptions(){let t={altFormat:this.altFormat,altInput:this.altInput,altInputClass:this.altInputClass,allowInput:this.allowInput,ariaDateFormat:this.ariaDateFormat,clickOpens:this.clickOpens,dateFormat:this.dateFormat,defaultDate:this.defaultToToday?this.getToday():this.defaultDate,defaultHour:this.defaultHour,defaultMinute:this.defaultMinute,disable:this.disable,disableMobile:this.disableMobile,enable:this.enable,enableTime:this.enableTime,enableSeconds:this.enableSeconds,formatDate:this.formatDateFn,hourIncrement:this.hourIncrement,inline:this.inline,maxDate:this.maxDate,minDate:this.minDate,minuteIncrement:this.minuteIncrement,mode:this.mode,nextArrow:this.nextArrow,prevArrow:this.prevArrow,noCalendar:this.noCalendar,onChange:this.onChange,onClose:this.onClose,onOpen:this.onOpen,onReady:this.onReady,onMonthChange:this.onMonthChange,onYearChange:this.onYearChange,onValueUpdate:this.onValueUpdate,parseDate:this.parseDateFn,position:this.position,shorthandCurrentMonth:this.shorthandCurrentMonth,showMonths:this.showMonths,static:this.static,time_24hr:this.time_24hr,weekNumbers:this.weekNumbers,wrap:this.wrap,locale:this.locale,plugins:[]};return t=await async function(t,e){if(t.weekSelect){const t=(await import(Oc+"/esm/plugins/weekSelect/weekSelect.js")).default;e={...e,plugins:[...e.plugins,t()],onChange:function(){const t=this.selectedDates[0]?this.config.getWeek(this.selectedDates[0]):null;this.input.value=t}}}if(t.monthSelect){const i=(await import(Oc+"/esm/plugins/monthSelect/index.js")).default;e={...e,plugins:[...e.plugins,i({shorthand:!1,dateFormat:t.dateFormat,altFormat:t.altFormat})]};const r=document.createElement("link");r.rel="stylesheet",r.href=Oc+"/plugins/monthSelect/style.css",document.head.appendChild(r)}return e}(this,t),Object.keys(t).forEach((e=>{void 0===t[e]&&delete t[e]})),t}async initializeComponent(){var t;let e;if(this._instance&&Object.prototype.hasOwnProperty.call(this,"destroy")&&this._instance.destroy(),e=this._hasSlottedElement?this.findInputField():null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("input"),e){this._inputElement=e,flatpickr.l10ns.default.firstDayOfWeek=this.firstDayOfWeek;const t=await this.getOptions();this._instance=flatpickr(e,t)}}findInputField(){let t=null;if(t=this.querySelector("input"),t)return t;const e=this.getSlottedElement();return void 0!==typeof e&&(t=this.searchWebComponentForInputElement(e)),t||null}searchWebComponentForInputElement(t){let e=this.getInputFieldInElement(t);if(e)return e;const i=this.getWebComponentsInsideElement(t);for(let t=0;t<i.length&&(e=this.searchWebComponentForInputElement(i[t]),!e);t++);return e}getInputFieldInElement(t){let e=null;return e=t.shadowRoot?t.shadowRoot.querySelector("input"):t.querySelector("input"),e}getWebComponentsInsideElement(t){return t.shadowRoot?[...Array.from(t.querySelectorAll("*")),...Array.from(t.shadowRoot.querySelectorAll("*"))].filter((t=>t.shadowRoot)):Array.from(t.querySelectorAll("*")).filter((t=>t.shadowRoot))}changeMonth(t,e=!0){this._instance&&this._instance.changeMonth(t,e)}clear(){this._instance&&this._instance.clear()}close(){this._instance&&this._instance.close()}destroy(){this._instance&&this._instance.destroy()}formatDate(t,e){return this._instance?this._instance.formatDate(t,e):""}jumpToDate(t,e){this._instance&&this._instance.jumpToDate(t,e)}open(){this._instance&&this._instance.open()}parseDate(t,e){if(this._instance)return this._instance.parseDate(t,e)}redraw(){this._instance&&this._instance.redraw()}set(t,e){this._instance&&this._instance.set(t,e)}setDate(t,e,i){this._instance&&this._instance.setDate(t,e,i)}toggle(){this._instance}getSelectedDates(){return this._instance?this._instance.selectedDates:[]}getCurrentYear(){return this._instance?this._instance.currentYear:-1}getCurrentMonth(){return this._instance?this._instance.currentMonth:-1}getConfig(){return this._instance?this._instance.config:{}}getValue(){return this._inputElement?this._inputElement.value:""}render(){return Cl`
      ${this._hasSlottedElement?Cl``:Cl`<input class="lit-flatpickr flatpickr flatpickr-input" placeholder=${this.placeholder} />`}
      <slot></slot>
    `}};Es([Yl({type:String})],zc.prototype,"placeholder",void 0),Es([Yl({type:String})],zc.prototype,"altFormat",void 0),Es([Yl({type:Boolean})],zc.prototype,"altInput",void 0),Es([Yl({type:String})],zc.prototype,"altInputClass",void 0),Es([Yl({type:Boolean})],zc.prototype,"allowInput",void 0),Es([Yl({type:String})],zc.prototype,"ariaDateFormat",void 0),Es([Yl({type:Boolean})],zc.prototype,"clickOpens",void 0),Es([Yl({type:String})],zc.prototype,"dateFormat",void 0),Es([Yl({type:Object})],zc.prototype,"defaultDate",void 0),Es([Yl({type:Number})],zc.prototype,"defaultHour",void 0),Es([Yl({type:Number})],zc.prototype,"defaultMinute",void 0),Es([Yl({type:Array})],zc.prototype,"disable",void 0),Es([Yl({type:Boolean})],zc.prototype,"disableMobile",void 0),Es([Yl({type:Array})],zc.prototype,"enable",void 0),Es([Yl({type:Boolean})],zc.prototype,"enableTime",void 0),Es([Yl({type:Boolean})],zc.prototype,"enableSeconds",void 0),Es([Yl({type:Function})],zc.prototype,"formatDateFn",void 0),Es([Yl({type:Number})],zc.prototype,"hourIncrement",void 0),Es([Yl({type:Number})],zc.prototype,"minuteIncrement",void 0),Es([Yl({type:Boolean})],zc.prototype,"inline",void 0),Es([Yl({type:String})],zc.prototype,"maxDate",void 0),Es([Yl({type:String})],zc.prototype,"minDate",void 0),Es([Yl({type:String})],zc.prototype,"mode",void 0),Es([Yl({type:String})],zc.prototype,"nextArrow",void 0),Es([Yl({type:String})],zc.prototype,"prevArrow",void 0),Es([Yl({type:Boolean})],zc.prototype,"noCalendar",void 0),Es([Yl({type:Function})],zc.prototype,"onChange",void 0),Es([Yl({type:Function})],zc.prototype,"onClose",void 0),Es([Yl({type:Function})],zc.prototype,"onOpen",void 0),Es([Yl({type:Function})],zc.prototype,"onReady",void 0),Es([Yl({type:Function})],zc.prototype,"onMonthChange",void 0),Es([Yl({type:Function})],zc.prototype,"onYearChange",void 0),Es([Yl({type:Function})],zc.prototype,"onValueUpdate",void 0),Es([Yl({type:Function})],zc.prototype,"parseDateFn",void 0),Es([Yl({type:String})],zc.prototype,"position",void 0),Es([Yl({type:Boolean})],zc.prototype,"shorthandCurrentMonth",void 0),Es([Yl({type:Number})],zc.prototype,"showMonths",void 0),Es([Yl({type:Boolean})],zc.prototype,"static",void 0),Es([Yl({type:Boolean})],zc.prototype,"time_24hr",void 0),Es([Yl({type:Boolean})],zc.prototype,"weekNumbers",void 0),Es([Yl({type:Boolean})],zc.prototype,"wrap",void 0),Es([Yl({type:String})],zc.prototype,"theme",void 0),Es([Yl({type:Number})],zc.prototype,"firstDayOfWeek",void 0),Es([Yl({type:String})],zc.prototype,"locale",void 0),Es([Yl({type:Boolean,attribute:"default-to-today"})],zc.prototype,"defaultToToday",void 0),Es([Yl({type:Boolean,attribute:"week-select"})],zc.prototype,"weekSelect",void 0),Es([Yl({type:Boolean,attribute:"month-select"})],zc.prototype,"monthSelect",void 0),Es([Yl({type:Boolean,attribute:"confirm-date"})],zc.prototype,"confirmDate",void 0),Es([Yl({type:Boolean})],zc.prototype,"_hasSlottedElement",void 0),zc=Es([(t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:r}=e;return{kind:i,elements:r,finisher(e){customElements.define(t,e)}}})(t,e))("lit-flatpickr")],zc);var Tc=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Ic=class extends G{constructor(){super(...arguments),this.disabled=!1}static get styles(){return[...super.styles]}render(){return o`
      <button
        class="${this.className}"
        @click=${t=>{t.preventDefault(),rt(this.history,this.query,this.to),this.onClick&&this.onClick(t),this.history.push({pathname:window.location.pathname,search:it(this.to)})}}
        type="button"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `}};Tc([i({type:Boolean})],Ic.prototype,"disabled",void 0),Tc([i({type:Object})],Ic.prototype,"query",void 0),Tc([i({type:Object})],Ic.prototype,"onClick",void 0),Tc([i({type:Object})],Ic.prototype,"history",void 0),Tc([i({type:Object})],Ic.prototype,"to",void 0),Ic=Tc([n("pl-query-button")],Ic);var Rc=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let _c=class extends G{constructor(){super(),this.onClickFunction=this.onClick.bind(this)}onClick(t){t.preventDefault(),rt(this.history,this.query,this.to),this.onClickFunction&&this.onClickFunction(t)}static get styles(){return[...super.styles]}render(){return o`
      <pl-link
        .history=${this.history}
        .query=${this.query}
        .to=${{pathname:window.location.pathname,search:it(this.to)}}
        ><slot></slot></pl-link>
    `}};Rc([i({type:Object})],_c.prototype,"onClickFunction",void 0),Rc([i({type:Object})],_c.prototype,"query",void 0),Rc([i({type:Object})],_c.prototype,"to",void 0),Rc([i({type:Object})],_c.prototype,"history",void 0),_c=Rc([n("pl-query-link")],_c);var Ac=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Nc=class extends ht{constructor(){super(),this.mode="menu",this.open=!1,this.handleKeydown=this.handleKeydown.bind(this),this.handleClick=this.handleClick.bind(this),this.setCustomDate=this.setCustomDate.bind(this),this.openCalendar=this.openCalendar.bind(this),this.close=this.close.bind(this),this.toggle=this.toggle.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.handleKeydown),document.addEventListener("mousedown",this.handleClick,!1);const t=new Date(this.site.statsBegin);this.dayBeforeCreation=t.getTime()-864e5}disconnectedCallback(){document.removeEventListener("keydown",this.handleKeydown),document.removeEventListener("mousedown",this.handleClick,!1)}static get styles(){return[...super.styles,e`
        .pointer {
          cursor: pointer;
        }
      `]}updated(t){super.updated(t),t.has("query")&&this.close()}renderArrow(t,e,i){const r=I(this.site.statsBegin),n=A(I(e),r,t),a=N(I(i),R(this.site),t),s="flex items-center px-1 sm:px-2 border-r border-gray-300 rounded-l\n        dark:border-gray-500 dark:text-gray-100 "+(n?"bg-gray-300 dark:bg-gray-950":"hover:bg-gray-100 dark:hover:bg-gray-900"),l="flex items-center px-1 sm:px-2 rounded-r dark:text-gray-100 "+(a?"bg-gray-300 dark:bg-gray-950":"hover:bg-gray-100 dark:hover:bg-gray-900");return o`
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
          .to=${{date:i}}
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
    `}datePickerArrows(){if("year"===this.query.period){const t=C(M(this.query.date,-12)),e=C(M(this.query.date,12));return this.renderArrow("year",t,e)}if("month"===this.query.period){const t=C(M(this.query.date,-1)),e=C(M(this.query.date,1));return this.renderArrow("month",t,e)}if("day"===this.query.period){const t=C(S(this.query.date,-1)),e=C(S(this.query.date,1));return this.renderArrow("day",t,e)}return a}handleKeydown(t){if("INPUT"===t.target.tagName)return!0;if(t.ctrlKey||t.metaKey||t.altKey||t.isComposing||229===t.keyCode)return!0;const e={period:"",from:"",to:"",date:""},i=I(this.site.statsBegin);if("ArrowLeft"===t.key){const t=C(S(this.query.date,-1)),r=C(M(this.query.date,-1)),n=C(M(this.query.date,-12));"day"!==this.query.period||A(I(t),i,this.query.period)?"month"!==this.query.period||A(I(r),i,this.query.period)?"year"!==this.query.period||A(I(n),i,this.query.period)||(e.period="year",e.date=n):(e.period="month",e.date=r):(e.period="day",e.date=t)}else if("ArrowRight"===t.key){const t=R(this.site),i=C(S(this.query.date,1)),r=C(M(this.query.date,1)),n=C(M(this.query.date,12));"day"!==this.query.period||N(I(i),t,this.query.period)?"month"!==this.query.period||N(I(r),t,this.query.period)?"year"!==this.query.period||N(I(n),t,this.query.period)||(e.period="year",e.date=n):(e.period="month",e.date=r):(e.period="day",e.date=i)}this.open=!1;const r=["d","e","r","w","m","y","t","s","l","a"],n=[{date:!1,period:"day"},{date:C(S(R(this.site),-1)),period:"day"},{period:"realtime"},{date:!1,period:"7d"},{date:!1,period:"month"},{date:!1,period:"year"},{date:!1,period:"30d"},{date:!1,period:"6mo"},{date:!1,period:"12mo"},{date:!1,period:"all"}];return r.includes(t.key.toLowerCase())?rt(this.history,this.query,{...e,...n[r.indexOf(t.key.toLowerCase())]}):"c"===t.key.toLowerCase()?this.openCalendar():e.date&&rt(this.history,this.query,e),!1}handleClick(t){!this.dropdownNode||this.dropdownNode.contains(t.target)}setCustomDate(t){if(2===t.length){const[e,i]=t;C(e)===C(i)?rt(this.history,this.query,{period:"day",date:C(e),from:"",to:""}):rt(this.history,this.query,{period:"custom",date:"",from:C(e),to:C(i)}),this.close()}}timeFrameText(){return"day"===this.query.period?_(this.site,this.query.date)?this.t("Today"):z(this.query.date):"7d"===this.query.period?this.t("Last 7 days"):"30d"===this.query.period?this.t("Last 30 days"):"month"===this.query.period?function(t,e){return O(e)===O(R(t))}(this.site,this.query.date)?this.t("Month to Date"):O(this.query.date):"6mo"===this.query.period?this.t("Last 6 months"):"12mo"===this.query.period?this.t("Last 12 months"):"year"===this.query.period?function(t,e){return e.getFullYear()===R(t).getFullYear()}(this.site,this.query.date)?this.t("Year to Date"):function(t){return`Year of ${t.getFullYear()}`}(this.query.date):"all"===this.query.period?this.t("All time"):"custom"===this.query.period?`${T(this.query.from)} - ${T(this.query.to)}`:this.t("Realtime")}toggle(){const t="calendar"!==this.mode||this.open?this.mode:"menu";this.mode=t,this.open=!this.open,this.requestUpdate()}close(){this.open=!1}async openCalendar(){this.mode="calendar",this.open=!0;(await this.calendar).open()}renderLink(t,e,i={}){let r;if("day"===this.query.period&&"day"===t)r=_(this.site,this.query.date)?"font-bold":"";else if("month"===this.query.period&&"month"===t){const t=i.date||R(this.site);n=t,a=this.query.date,r=O(n)===O(a)?"font-bold":""}else r=this.query.period===t?"font-bold":"";var n,a;i.date=!!i.date&&C(i.date);return o`
      <pl-query-link
        .to=${{from:!1,to:!1,period:t,...i}}
        .onClick=${this.close}
        .history="${this.history}"
        .query=${this.query}
        class=${`${r} px-4 py-2 text-sm leading-tight hover:bg-gray-100 hover:text-gray-900\n          dark:hover:bg-gray-900 dark:hover:text-gray-100 flex items-center justify-between`}
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
              ${this.renderLink("month",this.t("Last month"),{date:(t=this.site,M(R(t),-1))})}
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
            ${qt}
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
    `}};Ac([i({type:Object})],Nc.prototype,"history",void 0),Ac([l("#dropdownNode")],Nc.prototype,"dropdownNode",void 0),Ac([function(e){return(i,r)=>t(i,r,{async get(){return await this.updateComplete,this.renderRoot?.querySelector(e)??null}})}("#calendar")],Nc.prototype,"calendar",void 0),Ac([i({type:String})],Nc.prototype,"leadingText",void 0),Ac([i({type:String})],Nc.prototype,"mode",void 0),Ac([i({type:Boolean})],Nc.prototype,"open",void 0),Nc=Ac([n("pl-date-picker")],Nc);const Uc={page:["page","entry_page","exit_page"],source:["source","referrer"],location:["country","region","city"],screen:["screen"],browser:["browser","browser_version"],os:["os","os_version"],utm:["utm_medium","utm_source","utm_campaign","utm_term","utm_content"],goal:["goal"],props:["prop_key","prop_value"]},Bc={isNot:"is not",contains:"contains",is:"is"},Lc={[Bc.isNot]:"!",[Bc.contains]:"~",[Bc.is]:""};function Ec(t){return Object.keys(Lc).find((e=>Lc[e]===t[0]))||Bc.is}function Fc(t){return[Bc.isNot,Bc.contains].includes(Ec(t))?t.substring(1):t}function Pc(t){return Object.entries(Uc).reduce(((t,[e,i])=>{const r={};return i.forEach((t=>{r[t]=e})),{...t,...r}}),{})[t]||t}var qc=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Wc=class extends ht{constructor(){super(...arguments),this.viewport=1080,this.wrapped=1,this.addingFilter=!1,this.menuOpen=!1}connectedCallback(){super.connectedCallback(),this.renderDropDown=this.renderDropDown.bind(this),this.handleResize=this.handleResize.bind(this),this.handleKeyup=this.handleKeyup.bind(this),document.addEventListener("mousedown",this.handleClick,!1),window.addEventListener("resize",this.handleResize,!1),document.addEventListener("keyup",this.handleKeyup)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keyup",this.handleKeyup),document.removeEventListener("mousedown",this.handleClick,!1),window.removeEventListener("resize",this.handleResize,!1)}updated(t){(t.get("query")||t.get("viewport"))&&(this.wrapped=1),t.get("wrapped")&&1===this.wrapped&&-1!==t.get("wrapped")&&this.rewrapFilters(),this.rewrapFilters()}firstUpdated(){this.handleResize(),this.rewrapFilters()}static get styles(){return[...super.styles,e`
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
      `]}handleClick(t){this.menuOpen&&!this.contains(t.target)&&(this.menuOpen=!1),this.menuOpen=!1}removeFilter(t){const e={[t]:!1};"country"===t&&(e.country_name=!1),"region"===t&&(e.region_name=!1),"city"===t&&(e.city_name=!1),this.menuOpen=!1,rt(this.history,this.query,e)}clearAllFilters(){const t=Object.keys(this.query.filters).reduce(((t,e)=>({...t,[e]:!1})),{});rt(this.history,this.query,t),this.menuOpen=!1}filterText(t,e){const i=Ec(e),r=this.t(i),n=Fc(e);if("goal"===t)return o`${this.t("Completed goal")}: <b>${this.t(n)}</b>`;if("props"===t){const[t,e]=Object.entries(n)[0],i=this.query.filters.goal?this.query.filters.goal:"event";return o`${i}.${t} ${Ec(e)}
        <b>${Fc(e)}</b>`}if("browser_version"===t){const t=this.query.filters.browser?this.query.filters.browser:this.t("Browser");return o`${t}.Version ${r} <b>${n}</b>`}if("os_version"===t){const t=this.query.filters.os?this.query.filters.os:"OS";return o`${t}.Version ${r} <b>${n}</b>`}if("country"===t){const t=new URLSearchParams(window.location.search).get("country_name");return o`${this.t("Country")} ${r} <b>${t}</b>`}if("region"===t){const t=new URLSearchParams(window.location.search).get("region_name");return o`${this.t("Region")} ${r} <b>${t}</b>`}if("city"===t){const t=new URLSearchParams(window.location.search).get("city_name");return o`${this.t("City")} ${r} <b>${t}</b>`}const a=nt[t];if(a)return o`${this.t(a)} ${r} <b>${n}</b>`;throw new Error(`Unknown filter: ${t}`)}renderDropdownFilter(t){const e=t[0],i=t[1];return o`
      <div key=${e}>
        <div
          class="px-3 md:px-4 sm:py-2 py-3 text-sm leading-tight flex items-center justify-between"
          key="{key"
          +
          value}
        >
          <pl-link
            title=${`Edit filter: ${nt[e]}`}
            .to=${{pathname:`/${encodeURIComponent(this.site.domain)}/filter/${Pc(e)}`,search:window.location.search}}
            class="group flex w-full justify-between items-center"
            .style=${{width:"calc(100% - 1.5rem)"}}
          >
            <span class="inline-block w-full truncate"
              >${this.filterText(e,i)}</span
            >
            <div hidden
              class="w-4 h-4 ml-1 cursor-pointer group-hover:text-indigo-700 dark:group-hover:text-indigo-500"
            >
              ${Pt}
            </div>
          </pl-link>
          <b
            title=${`Remove filter: ${nt[e]}`}
            class="ml-2 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-500"
            @click=${()=>this.removeFilter(e)}
          >
            <div class="w-4 h-4">${Ft}</div>
          </b>
        </div>
      </div>
    `}filterDropdownOption(t){return o`
      <div key=${t}>
        <pl-link
          .to=${{pathname:`/${encodeURIComponent(this.site.domain)}/filter/${t}`,search:window.location.search}}
          class="${"bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"} block px-4 py-2 text-sm font-medium"
        >
          ${function(t){return"utm"===t?"UTM tags":"location"===t?"Location":"props"===t?"Property":this.t(nt[t])}(t)}
        </pl-link>
      </div>
    `}renderDropdownContentOriginal(){return 0===this.wrapped||this.addingFilter?Object.keys(Uc).filter((t=>"props"!==t||this.site.flags.custom_dimension_filter)).map((t=>this.filterDropdownOption(t))):o`
        <div
          class="border-b border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
          @click=${()=>this.addingFilter=!0}
        >
          + Add filter
        </div>
        ${et(this.query).map((t=>this.renderDropdownFilter(t)))}
        <div key="clear">
          <div
            class="border-t border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
            @click=${()=>this.clearAllFilters()}
          >
           ${this.t("Clear All Filters")}
          </div>
        </div>
      `}renderDropdownContent(){return 0===this.wrapped||this.addingFilter?a:o`
        ${et(this.query).map((t=>this.renderDropdownFilter(t)))}
        <div key="clear">
          <div
            class="pointer border-t border-gray-200 dark:border-gray-500 px-4 sm:py-2 py-3 text-sm leading-tight hover:text-indigo-700 dark:hover:text-indigo-500 hover:cursor-pointer"
            @click=${()=>this.clearAllFilters()}
          >
            ${this.t("Clear All Filters")}
          </div>
        </div>
      `}handleKeyup(t){t.ctrlKey||t.metaKey||t.altKey||"Escape"===t.key&&this.clearAllFilters()}handleResize(){this.viewport=window.innerWidth||639}rewrapFilters(){const t=this.$$("#filters");if(et(this.query).length>0&&this.viewport<=768)return void(this.wrapped=2);if(1!==this.wrapped||!t||1===et(this.query).length)return;let e;[...t.childNodes].forEach((t=>{if("function"==typeof t.getBoundingClientRect){const i=t.getBoundingClientRect();e&&e.top<i.top&&(this.wrapped=2),e=i}}))}renderListFilter(t){const e=t[0],i=t[1];return o`
      <div
        .key=${e}
        .title=${i}
        class="flex bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow text-sm rounded mr-2 items-center filterContainer"
      >
        <pl-link
          .title=${`Edit filter: ${nt[e]}`}
          class="flex w-full h-full items-center py-2 pl-3"
          .to=${{pathname:`/${encodeURIComponent(this.site.domain)}/filter/${Pc(e)}`,search:window.location.search}}
        >
          <span class="filterKeys inline-block max-w-2xs md:max-w-xs truncate"
            >${this.filterText(e,i)}</span
          >
        </pl-link>
        <span
          .title=${`Remove filter: ${nt[e]}`}
          class="flex h-full w-full px-2 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-500 items-center"
          @click=${()=>this.removeFilter(e)}
        >
          <div class="w-4 h-4">${Ft}</div>
        </span>
      </div>
    `}renderDropdownButton(){if(2===this.wrapped){const t=et(this.query).length;return o`
        <div class="flex">
          <div class="-ml-1 mr-1 h-4 w-4 layout horizontal" aria-hidden="true">
            ${Lt}
          </div>
          <div>${t} Filter${1===t?"":"s"}</div>
        </div>
      `}return 1===this.wrapped?a:o`
        <div class="flex">
          <div class="ml-1 mr-1 h-4 w-4 h-4 w-4" aria-hidden="true">
            ${Et}
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
          ${et(this.query).map((t=>this.renderListFilter(t)))}
        </div>
      `:a}render(){return o`
      <div class="flex ml-auto pl-2 filterMain">
        ${this.renderFilterList()} ${this.renderDropDown()}
      </div>
    `}};qc([i({type:String})],Wc.prototype,"url",void 0),qc([i({type:Number})],Wc.prototype,"viewport",void 0),qc([i({type:Number})],Wc.prototype,"wrapped",void 0),qc([i({type:Object})],Wc.prototype,"history",void 0),qc([i({type:Boolean})],Wc.prototype,"addingFilter",void 0),qc([i({type:Boolean})],Wc.prototype,"menuOpen",void 0),Wc=qc([n("pl-filters")],Wc);var Hc=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Vc=class extends ht{constructor(){super(...arguments),this.stuck=!1}updated(t){super.updated(t)}static get styles(){return[...super.styles,e`
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
      `:a}};Hc([i({type:Object})],Vc.prototype,"history",void 0),Hc([i({type:Boolean})],Vc.prototype,"stuck",void 0),Hc([i({type:Array})],Vc.prototype,"highlightedGoals",void 0),Vc=Hc([n("pl-realtime")],Vc);const Yc="object"==typeof self?self:globalThis,Gc=t=>((t,e)=>{const i=(e,i)=>(t.set(i,e),e),r=n=>{if(t.has(n))return t.get(n);const[o,a]=e[n];switch(o){case 0:case-1:return i(a,n);case 1:{const t=i([],n);for(const e of a)t.push(r(e));return t}case 2:{const t=i({},n);for(const[e,i]of a)t[r(e)]=r(i);return t}case 3:return i(new Date(a),n);case 4:{const{source:t,flags:e}=a;return i(new RegExp(t,e),n)}case 5:{const t=i(new Map,n);for(const[e,i]of a)t.set(r(e),r(i));return t}case 6:{const t=i(new Set,n);for(const e of a)t.add(r(e));return t}case 7:{const{name:t,message:e}=a;return i(new Yc[t](e),n)}case 8:return i(BigInt(a),n);case"BigInt":return i(Object(BigInt(a)),n)}return i(new Yc[o](a),n)};return r})(new Map,t)(0),Kc="",{toString:Jc}={},{keys:Xc}=Object,Zc=t=>{const e=typeof t;if("object"!==e||!t)return[0,e];const i=Jc.call(t).slice(8,-1);switch(i){case"Array":return[1,Kc];case"Object":return[2,Kc];case"Date":return[3,Kc];case"RegExp":return[4,Kc];case"Map":return[5,Kc];case"Set":return[6,Kc]}return i.includes("Array")?[1,i]:i.includes("Error")?[7,i]:[2,i]},Qc=([t,e])=>0===t&&("function"===e||"symbol"===e),td=(t,{json:e,lossy:i}={})=>{const r=[];return((t,e,i,r)=>{const n=(t,e)=>{const n=r.push(t)-1;return i.set(e,n),n},o=r=>{if(i.has(r))return i.get(r);let[a,s]=Zc(r);switch(a){case 0:{let e=r;switch(s){case"bigint":a=8,e=r.toString();break;case"function":case"symbol":if(t)throw new TypeError("unable to serialize "+s);e=null;break;case"undefined":return n([-1],r)}return n([a,e],r)}case 1:{if(s)return n([s,[...r]],r);const t=[],e=n([a,t],r);for(const e of r)t.push(o(e));return e}case 2:{if(s)switch(s){case"BigInt":return n([s,r.toString()],r);case"Boolean":case"Number":case"String":return n([s,r.valueOf()],r)}if(e&&"toJSON"in r)return o(r.toJSON());const i=[],l=n([a,i],r);for(const e of Xc(r))!t&&Qc(Zc(r[e]))||i.push([o(e),o(r[e])]);return l}case 3:return n([a,r.toISOString()],r);case 4:{const{source:t,flags:e}=r;return n([a,{source:t,flags:e}],r)}case 5:{const e=[],i=n([a,e],r);for(const[i,n]of r)(t||!Qc(Zc(i))&&!Qc(Zc(n)))&&e.push([o(i),o(n)]);return i}case 6:{const e=[],i=n([a,e],r);for(const i of r)!t&&Qc(Zc(i))||e.push(o(i));return i}}const{message:l}=r;return n([a,{name:s,message:l}],r)};return o})(!(e||i),!!e,new Map,r)(t),r};var ed="function"==typeof structuredClone?(t,e)=>e&&("json"in e||"lossy"in e)?Gc(td(t,e)):structuredClone(t):(t,e)=>Gc(td(t,e)),id=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let rd=class extends ht{constructor(){super(...arguments),this.useTopStatsForCurrentVisitors=!1}connectedCallback(){super.connectedCallback(),this.timer.onTick(this.updateCount.bind(this)),this.updateCount()}static get styles(){return[...super.styles,e`
        pl-link {
          width: 100%;
        }

        [hidden] {
          display: none !important;
        }
      `]}updateCount(){if(this.useTopStatsForCurrentVisitors){const t=ed(this.query);return t.period="realtime",F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`,t).then((t=>{this.currentVisitors=t.top_stats[1].value})).catch((t=>(console.error(t),null)))}return F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/current-visitors`,{}).then((t=>{this.currentVisitors=t})).catch((t=>(console.error(t),null)))}render(){return et(this.query).length>=1?null:null!==this.currentVisitors?o`
        <pl-link
          .to=${{search:ct("period","realtime")}}
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
      `:a}};id([i({type:Number})],rd.prototype,"currentVisitors",void 0),id([i({type:Boolean})],rd.prototype,"useTopStatsForCurrentVisitors",void 0),rd=id([n("pl-current-visitors")],rd);var nd=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let od=class extends ht{constructor(){super(...arguments),this.stuck=!1}static get styles(){return[...super.styles,e`
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
      `:a}};var ad;nd([i({type:Object})],od.prototype,"history",void 0),nd([i({type:Boolean})],od.prototype,"stuck",void 0),nd([i({type:Array})],od.prototype,"highlightedGoals",void 0),od=nd([n("pl-historical")],od),function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"}(ad||(ad={}));const sd="beforeunload";function ld(t={}){let{window:e=document.defaultView}=t,i=e.history;function r(){let{pathname:t,search:r,hash:n}=e.location,o=i.state||{};return[o.idx,{pathname:t,search:r,hash:n,state:o.usr||null,key:o.key||"default"}]}let n=null;e.addEventListener("popstate",(function(){if(n)c.call(n),n=null;else{let t=ad.Pop,[e,i]=r();if(c.length)if(null!=e){let r=a-e;r&&(n={action:t,location:i,retry(){g(-1*r)}},g(r))}else!function(t,e){if(!t){"undefined"!=typeof console&&console.warn(e);try{throw new Error(e)}catch(t){}}}(!1,"You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");else f(t)}}));let o=ad.Pop,[a,s]=r(),l=dd(),c=dd();function d(t){return"string"==typeof t?t:function({pathname:t="/",search:e="",hash:i=""}){e&&"?"!==e&&(t+="?"===e.charAt(0)?e:"?"+e);i&&"#"!==i&&(t+="#"===i.charAt(0)?i:"#"+i);return t}(t)}function h(t,e=null){return{pathname:s.pathname,hash:"",search:"",..."string"==typeof t?hd(t):t,state:e,key:Math.random().toString(36).substr(2,8)}}function u(t,e){return[{usr:t.state,key:t.key,idx:e},d(t)]}function p(t,e,i){return!c.length||(c.call({action:t,location:e,retry:i}),!1)}function f(t){o=t,[a,s]=r(),l.call({action:o,location:s})}function g(t){i.go(t)}null==a&&(a=0,i.replaceState({...i.state,idx:a},""));let m={get action(){return o},get location(){return s},createHref:d,push:function t(r,n){let o=ad.Push,s=h(r,n);if(p(o,s,(function(){t(r,n)}))){let[t,r]=u(s,a+1);try{i.pushState(t,"",r)}catch(t){e.location.assign(r)}f(o)}},replace:function t(e,r){let n=ad.Replace,o=h(e,r);if(p(n,o,(function(){t(e,r)}))){let[t,e]=u(o,a);i.replaceState(t,"",e),f(n)}},go:g,back(){g(-1)},forward(){g(1)},listen:t=>l.push(t),block(t){let i=c.push(t);return 1===c.length&&e.addEventListener(sd,cd),function(){i(),c.length||e.removeEventListener(sd,cd)}}};return m}function cd(t){t.preventDefault(),t.returnValue=""}function dd(){let t=[];return{get length(){return t.length},push:e=>(t.push(e),function(){t=t.filter((t=>t!==e))}),call(e){t.forEach((t=>t&&t(e)))}}}function hd(t){let e={};if(t){let i=t.indexOf("#");i>=0&&(e.hash=t.substr(i),t=t.substr(0,i));let r=t.indexOf("?");r>=0&&(e.search=t.substr(r),t=t.substr(0,r)),t&&(e.pathname=t)}return e}var ud=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};class pd{constructor(){this.listeners=[],this.intervalId=setInterval(this.dispatchTick.bind(this),3e4)}onTick(t){this.listeners.push(t)}dispatchTick(){for(const t of this.listeners)t()}}let fd=class extends ht{constructor(){super(),this.metric="visitors"}resetState(){}connectedCallback(){super.connectedCallback(),this.timer=new pd,this.history=ld(),this.query=tt(location.search,this.site),window.addEventListener("popstate",(()=>{this.query=tt(location.search,this.site)}))}static get styles(){return[...super.styles]}updated(t){super.updated(t),t.has("query")&&(B.abort(),B=new AbortController,this.resetState())}render(){return this.site&&this.query?"realtime"===this.query.period?o`
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
        `:a}};ud([i({type:Object})],fd.prototype,"history",void 0),ud([i({type:String})],fd.prototype,"metric",void 0),fd=ud([n("pl-dashboard")],fd);var gd=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};class md extends ht{regenerateChart(){}fetchGraphData(){}constructor(){super(),this.darkTheme=!1,this.exported=!1,this.gradientColorStop1="rgba(101,116,205, 0.2)",this.gradientColorStop2="rgba(101,116,205, 0.2)",this.prevGradientColorStop1="rgba(101,116,205, 0.075)",this.prevGradientColorStop2="rgba(101,116,205, 0)",this.borderColor="rgba(101,116,205)",this.pointBackgroundColor="rgba(101,116,205)",this.pointHoverBackgroundColor="rgba(71, 87, 193)",this.prevPointHoverBackgroundColor="rgba(166,187,210,0.8)",this.prevBorderColor="rgba(166,187,210,0.5)",this.chartHeigh=342,this.chartWidth=1054,this.metrics="visitors",this.method="timeseries",this.repositionTooltip=this.repositionTooltip.bind(this)}static get styles(){return[...super.styles,e`.mainContainer{
      margin-top: 24px;
    }`]}connectedCallback(){super.connectedCallback(),window.addEventListener("mousemove",this.repositionTooltip),this.fetchGraphData=this.fetchGraphData.bind(this)}firstUpdated(t){this.fetchGraphData(),this.timer&&this.timer.onTick(this.fetchGraphData),this.graphData&&(this.chart=this.regenerateChart()),this.timer&&this.timer.onTick(this.fetchGraphData)}updated(t){super.updated(t),t.get("query")&&this.fetchGraphData();const e=this.$$("#chartjs-tooltip");this.graphData&&(t.has("graphData")||t.has("darkTheme"))&&(this.chart&&this.chart.destroy(),this.chart=this.regenerateChart(),this.chart.update(),e&&(e.style.display="none")),this.graphData||(this.chart&&this.chart.destroy(),e&&(e.style.display="none"))}disconnectedCallback(){super.disconnectedCallback();const t=document.getElementById("chartjs-tooltip");t&&(t.style.opacity="0",t.style.display="none"),window.removeEventListener("mousemove",this.repositionTooltip)}buildDataSet(t,e,i,r=!1){var n=i.createLinearGradient(0,0,0,300),o=i.createLinearGradient(0,0,0,300);if(n.addColorStop(0,this.gradientColorStop1),n.addColorStop(1,this.gradientColorStop2),o.addColorStop(0,this.prevGradientColorStop1),o.addColorStop(1,this.prevGradientColorStop2),r)return[{label:this.label,data:t,borderWidth:2,borderColor:this.prevBorderColor,pointHoverBackgroundColor:this.prevPointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverBorderColor:"transparent",pointHoverRadius:4,backgroundColor:o,fill:!0}];if(e){var a=t.slice(e-1,e+1),s=new Array(e-1).concat(a);const i=[...t];for(var l=e;l<i.length;l++)i[l]=void 0;return[{label:this.label,data:i,borderWidth:3,borderColor:this.borderColor,pointBackgroundColor:this.pointBackgroundColor,pointHoverBackgroundColor:this.pointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:n,fill:!0},{label:this.label,data:s,borderWidth:3,borderDash:[3,3],borderColor:this.borderColor,pointHoverBackgroundColor:this.pointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:n,fill:!0}]}return[{label:this.label,data:t,borderWidth:3,borderColor:this.borderColor,pointHoverBackgroundColor:this.pointHoverBackgroundColor,pointBorderColor:"transparent",pointHoverRadius:4,backgroundColor:n,fill:!0}]}transformCustomDateForStatsQuery(t){return"custom"==t.period?(t.date=`${C(t.from)},${C(t.to)}`,t.from=void 0,t.to=void 0,t):t}repositionTooltip(t){const e=this.$$("#chartjs-tooltip");e&&window.innerWidth>=768&&(t.clientX>.66*window.innerWidth?(e.style.right=window.innerWidth-t.clientX+window.pageXOffset+"px",e.style.left=""):(e.style.right="",e.style.left=t.clientX+window.pageXOffset+"px"),e.style.top=t.clientY+window.pageYOffset+"px",e.style.opacity="1")}updateWindowDimensions(t,e){t.options.scales.x.ticks.maxTicksLimit=e.width<720?5:8,t.options.scales.y.ticks.maxTicksLimit=e.height<233?3:8}pollExportReady(){document.cookie.includes("exporting")?setTimeout(this.pollExportReady.bind(this),1e3):this.exported=!1}downloadSpinner(){this.exported=!0,document.cookie="exporting=",setTimeout(this.pollExportReady.bind(this),1e3)}graphTooltip(t,e,i){return r=>{const n=r.tooltip,o=e.getBoundingClientRect();let a=i;if(a||(a=document.createElement("div"),a.id="chartjs-tooltip",a.style.display="none",a.style.opacity=0,document.body.appendChild(a)),a&&o&&window.innerWidth<768&&(a.style.top=o.y+o.height+window.scrollY+15+"px",a.style.left=o.x+"px",a.style.right=null,a.style.opacity=1),0!==n.opacity){if(n.body){var s=n.body.map((function(t){return t.lines}));3===s.length&&(s[1]=!1);const e=n.dataPoints[0],i=t.labels[e.dataIndex],r=e.raw||0;let o=`\n        <div class='text-gray-100 flex flex-col'>\n          <div class='flex justify-between items-center'>\n              <span class='font-bold mr-4 text-lg'>${this.label}</span>\n          </div>\n          <div class='flex flex-col'>\n            <div class='flex flex-row justify-between items-center'>\n              <span class='flex items-center mr-4'>\n                <div class='w-3 h-3 mr-1 rounded-full' style='background-color: rgba(101,116,205)'></div>\n                <span>${function(e,i){const r=ot(t.interval,!0)(e),n=i&&ot(t.interval,!0)(i);return"month"===t.interval||"date"===t.interval?i?n:r:"hour"===t.interval?i?`${ot("date",!0)(i)}, ${ot(t.interval,!0)(i)}`:`${ot("date",!0)(e)}, ${r}`:i?n:r}(i)}</span>\n              </span>\n              <span>${k(r)}</span>\n            </div>\n          </div>\n          <span class='font-bold text-'>${"month"===t.interval?"Click to view month":"date"===t.interval?"Click to view day":""}</span>\n        </div>\n        `;a.innerHTML=o}a.style.display=null}else a.style.display="none"}}onClick(t){const e=this.chart.getElementsAtEventForMode(t,"index",{intersect:!1},!1)[0],i=this.chart.data.labels[e.index];"month"===this.graphData.interval?rt(this.history,this.query,{period:"month",date:i}):"date"===this.graphData.interval&&rt(this.history,this.query,{period:"day",date:i})}downloadLink(){if("realtime"!==this.query.period){if(this.exported)return o`
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
        `;{const t=`/${encodeURIComponent(this.site.domain)}/export${E(this.query)}`;return o`
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
      `}return a}}gd([i({type:Object})],md.prototype,"graphData",void 0),gd([i({type:Object})],md.prototype,"ctx",void 0),gd([i({type:Boolean})],md.prototype,"darkTheme",void 0),gd([i({type:Object})],md.prototype,"chart",void 0),gd([l("canvas")],md.prototype,"canvasElement",void 0),gd([i({type:Boolean})],md.prototype,"exported",void 0),gd([i({type:Object})],md.prototype,"history",void 0),gd([i({type:String})],md.prototype,"chartTitle",void 0),gd([i({type:String})],md.prototype,"label",void 0),gd([i({type:String})],md.prototype,"gradientColorStop1",void 0),gd([i({type:String})],md.prototype,"gradientColorStop2",void 0),gd([i({type:String})],md.prototype,"prevGradientColorStop1",void 0),gd([i({type:String})],md.prototype,"prevGradientColorStop2",void 0),gd([i({type:String})],md.prototype,"borderColor",void 0),gd([i({type:String})],md.prototype,"pointBackgroundColor",void 0),gd([i({type:String})],md.prototype,"pointHoverBackgroundColor",void 0),gd([i({type:String})],md.prototype,"prevPointHoverBackgroundColor",void 0),gd([i({type:String})],md.prototype,"prevBorderColor",void 0),gd([i({type:Number})],md.prototype,"chartHeigh",void 0),gd([i({type:Number})],md.prototype,"chartWidth",void 0),gd([i({type:String})],md.prototype,"metrics",void 0),gd([i({type:String})],md.prototype,"method",void 0);var vd=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let bd=class extends md{static get styles(){return[...super.styles,e`
        .topContainer {
          margin-top: 24px;
        }
      `]}get filterInStatsFormat(){let t="",e=[];return Object.keys(this.query.filters).map((i=>{this.query.filters[i]&&("page"==this.query.filters[i]?t+=`${i}==${this.query.filters[i]};`:"goal"==i?e.push(this.query.filters[i]):t+=`visit:${i}==${this.query.filters[i]};`)})),t&&(t=`;${t}`,t=t.slice(0,-1)),e.length>0?`|${e.join("|")}`+t:t}async fetchGraphData(){return new Promise(((t,e)=>{if("realtime"!=this.query.period){let i=structuredClone(this.query);i=this.transformCustomDateForStatsQuery(i),F(this.proxyUrl,`/api/v1/stats/${this.method}`,i,{metrics:this.metrics,statsBegin:this.site.statsBegin,site_id:encodeURIComponent(this.site.domain),filters:`event:name==${this.events.join("|")}${this.filterInStatsFormat}`}).then((e=>{this.setGraphData(e),t(e)})).catch((t=>e(t)))}else t([])}))}setGraphData(t){const e={labels:[],plot:[],interval:"day"==this.query.period?"hour":"date"};for(let i=0;t.results.length>i;i++)e.labels.push(t.results[i].date),e.plot.push(t.results[i][this.metrics]);this.graphData=e}regenerateChart(){let t=this.$$("canvas");t||(t=this.canvasElement),this.ctx=t.getContext("2d");const e=this.buildDataSet(this.graphData.plot,this.graphData.present_index,this.ctx),i=this.graphData;return new b(this.ctx,{type:"line",data:{labels:this.graphData.labels,datasets:e},options:{animation:!1,plugins:{legend:{display:!1},tooltip:{enabled:!1,mode:"index",intersect:!1,position:"average",external:this.graphTooltip(this.graphData,t,this.$$("#chartjs-tooltip"))}},responsive:!0,onResize:this.updateWindowDimensions,elements:{line:{tension:0},point:{radius:0}},onClick:this.onClick.bind(this),scales:{y:{beginAtZero:!0,ticks:{callback:k,maxTicksLimit:8,color:this.darkTheme?"rgb(243, 244, 246)":void 0},grid:{zeroLineColor:"transparent",drawBorder:!1}},x:{grid:{display:!1},ticks:{maxTicksLimit:8,callback:function(t,e,r){return ot(i.interval)(this.getLabelForValue(t))},color:this.darkTheme?"rgb(243, 244, 246)":void 0}}},interaction:{mode:"index",intersect:!1}}})}renderHeader(){return o` <h1>${this.t(this.chartTitle)}</h1>`}};vd([i({type:Array})],bd.prototype,"events",void 0),bd=vd([n("pl-goal-graph")],bd);const yd=["newPost - completed","newPost - started","pointHelpful - completed","endorse_down - completed","endorse_up - completed","Login and Signup - Signup Fail","Login and Signup - Signup/Login Opened","newPointFor - completed","newPointAgainst - completed","Login and Signup - Login Success","Login and Signup - Signup Success","pages - open","pointNotHelpful - completed","startTranslation - click","video - completed","audio - completed","videoUpload - complete","audioUpload - complete","imageUpload - complete","mediaUpload - error","twitter - pointShareOpen","point.report - open","email - pointShareOpen","post.report - open","whatsapp - pointShareOpen","twitter - postShareCardOpen","facebook - postShareCardOpen","email - postShareCardOpen","whatsapp - postShareCardOpen","filter - click","search - click","marker - clicked","newUserImage","filter - change","newPost - open","post.ratings - completed","post.ratings.dialog - open","recommendations - goForward","recommendations - goBack","setEmail - cancel","setEmail - logout","forgotPasswordFromSetEmail - open","linkAccountsAjax - confirm","setEmail - confirm","registrationAnswers - submit","evaluated - point toxicity low","evaluated - point toxicity medium","evaluated - point toxicity high","evaluated - post toxicity low","evaluated - post toxicity medium","evaluated - post toxicity high","open - share dialog options","open - share dialog - brand:whatsapp","open - share dialog - brand:facebook","open - share dialog - brand:twitter","open - share dialog - clipboard"];var wd=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let xd=class extends Vc{static get styles(){return[...super.styles,e``]}constructor(){super(),this.highlightedGoals=yd}render(){const t=this.site.embedded?"relative":"sticky";return o`
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
    `}};wd([i({type:Object})],xd.prototype,"collection",void 0),wd([i({type:String})],xd.prototype,"collectionType",void 0),wd([i({type:Number})],xd.prototype,"collectionId",void 0),xd=wd([n("yp-realtime")],xd);class kd extends d{createCampaign(t,e,i){return this.fetchWrapper(this.baseUrlPath+`/${kd.transformCollectionTypeToApi(t)}/${e}/create_campaign`,{method:"POST",body:JSON.stringify(i)},!1)}updateCampaign(t,e,i,r){return this.fetchWrapper(this.baseUrlPath+`/${kd.transformCollectionTypeToApi(t)}/${e}/${i}/update_campaign`,{method:"PUT",body:JSON.stringify(r)},!1)}deleteCampaign(t,e,i){return this.fetchWrapper(this.baseUrlPath+`/${kd.transformCollectionTypeToApi(t)}/${e}/${i}/delete_campaign`,{method:"DELETE",body:JSON.stringify({})},!1)}getCampaigns(t,e){return this.fetchWrapper(this.baseUrlPath+`/${kd.transformCollectionTypeToApi(t)}/${e}/get_campaigns`)}}var $d=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Cd=class extends h{constructor(){super(...arguments),this.confirmedActive=!1,this.haveCopied=!1}async deleteCampaign(){this.fire("deleteCampaign",this.campaign.id)}static get styles(){return[super.styles,e`
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
      `]}get configuration(){return this.campaign.configuration}getMediumImageUrl(t){switch(t){case"facebook":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/facebook.png";case"adwords":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/adwords.png";case"snapchat":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/snapchat.png";case"instagram":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/instagram.png";case"twitter":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/twitter.png";case"youtube":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/youtube.png";case"linkedin":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/linkedin.png";case"email":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/email.png";case"tiktok":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/tiktok.png";case"whatsapp":return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/whatsapp.png";default:return"https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/other.png"}}async activate(t){this.mediumToActivate=t,this.confirmedActive=!1,this.haveCopied=!1,await this.updateComplete,this.$$("#activateDialog").show()}async showMedium(t){this.mediumToShow=t,await this.updateComplete,this.$$("#showMediumDialog").show()}cancelActivation(){this.mediumToActivate=void 0}reallyActivate(){this.mediumToActivate?(this.mediumToActivate.active=!0,this.fire("configurationUpdated",{campaignId:this.campaign.id,configuration:this.configuration}),this.mediumToActivate=void 0):console.error("No medium to activate")}activeCheckboxChanged(t){this.confirmedActive=t.currentTarget.checked}copyCurrentTextWithLink(t){const e=`${this.configuration.promotionText} ${t.finaUrl}`;navigator.clipboard.writeText(e),this.haveCopied=!0;let i=this.t(t.utm_medium);this.fire("display-snackbar",this.t("promotionWithLinksCopiedToClipboard")+` ${i}`)}copyCurrentText(t){navigator.clipboard.writeText(this.configuration.promotionText),this.haveCopied=!0;let e=this.t(t.utm_medium);this.fire("display-snackbar",this.t("promotionTextCopiedToClipboard")+` ${e}`)}copyCurrentLink(t){navigator.clipboard.writeText(t.finaUrl),this.haveCopied=!0;let e=this.t(t.utm_medium);this.fire("display-snackbar",this.t("promotionLinkCopiedToClipboard")+` ${e}`)}closeShowMedium(){this.mediumToShow=void 0}renderTextWithLink(t){const e=this.t(t.utm_medium);return["facebook","twitter","linkedin"].includes(t.utm_medium)?o`
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
    `}};$d([i({type:String})],Cd.prototype,"collectionType",void 0),$d([i({type:Number})],Cd.prototype,"collectionId",void 0),$d([i({type:Object})],Cd.prototype,"collection",void 0),$d([i({type:Object})],Cd.prototype,"campaign",void 0),$d([i({type:Object})],Cd.prototype,"campaignApi",void 0),$d([i({type:Object})],Cd.prototype,"mediumToActivate",void 0),$d([i({type:Object})],Cd.prototype,"mediumToShow",void 0),$d([i({type:Boolean})],Cd.prototype,"confirmedActive",void 0),$d([i({type:Boolean})],Cd.prototype,"haveCopied",void 0),Cd=$d([n("yp-campaign")],Cd);var Md=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Sd=class extends Cd{static get styles(){return[super.styles,e`
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
    `}};Sd=Md([n("yp-campaign-analysis")],Sd);var jd=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Dd=class extends ht{constructor(){super(...arguments),this.noData=!1,this.campaignApi=new kd}connectedCallback(){super.connectedCallback(),this.timer&&this.timer.onTick(this.getCampaigns.bind(this))}static get styles(){return[e`
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
      `]}updated(t){super.updated(t),t.has("query")&&(this.foundCampaigns=void 0,this.getCampaigns())}async getCampaigns(){this.campaigns=await this.campaignApi.getCampaigns(this.collectionType,this.collectionId);const t=await F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/utm_contents`,this.query);if(t&&t.length>0){const e=t.map((t=>isNaN(t.name)?t.name||"":parseInt(t.name)));if(e.length>0){const t=await F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/utm_mediums`,this.query);if(t&&t.length>0){const i=this.campaigns?.filter((t=>e.includes(t.id)));if(i&&i.length>0)for(let e=0;e<i.length;e++)i[e]=await this.getSourceData(i[e],t);this.foundCampaigns=i}}}this.foundCampaigns||(this.foundCampaigns=[])}async getSourceData(t,e){const i=ed(this.query),r=e.map((t=>t.name.toLowerCase())),n=t.configuration.mediums.filter((t=>r.includes(t.utm_medium)));i.filters.utm_content=`${t.id}`;for(let t=0;t<n.length;t++){const e=n[t];i.filters.utm_medium=e.utm_medium;const r=await F(this.proxyUrl,`/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`,i);e.topStats=[r.top_stats[0],r.top_stats[1]]}return t.configuration.mediums=n,t}renderCampaign(t){return o`<yp-campaign-analysis
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
      </div>`}};jd([i({type:String})],Dd.prototype,"collectionType",void 0),jd([i({type:Number})],Dd.prototype,"collectionId",void 0),jd([i({type:Object})],Dd.prototype,"collection",void 0),jd([i({type:Array})],Dd.prototype,"campaigns",void 0),jd([i({type:Array})],Dd.prototype,"foundCampaigns",void 0),jd([i({type:Boolean})],Dd.prototype,"noData",void 0),Dd=jd([n("yp-campaigns-analytics")],Dd);var Od=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let zd=class extends od{static get styles(){return[...super.styles,e``]}constructor(){super(),this.highlightedGoals=yd}render(){const t=this.site.embedded?"relative":"sticky";return o`
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
    `}};Od([i({type:Object})],zd.prototype,"collection",void 0),Od([i({type:String})],zd.prototype,"collectionType",void 0),Od([i({type:Number})],zd.prototype,"collectionId",void 0),zd=Od([n("yp-historical")],zd);var Td=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Id=class extends fd{connectedCallback(){try{fetch("/api/users/has/PlausibleSiteName",{headers:{"Content-Type":"application/json"}}).then((t=>t.json())).then((t=>{this.plausibleSiteName=t.plausibleSiteName,this.site={domain:this.plausibleSiteName,hasGoals:!0,embedded:!1,offset:1,statsBegin:this.collection.created_at,isDbip:!1,flags:{custom_dimension_filter:!1}},super.connectedCallback()}))}catch(t){console.error(t)}}static get styles(){return[e`
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
            .proxyUrl="${`/api/${u.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useCommunityId?`?communityId=${this.useCommunityId}`:""}`}"
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
            .proxyUrl="${`/api/${u.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useCommunityId?`?communityId=${this.useCommunityId}`:""}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-historical>
        `:a}};Td([i({type:String})],Id.prototype,"plausibleSiteName",void 0),Td([i({type:Object})],Id.prototype,"collection",void 0),Td([i({type:String})],Id.prototype,"collectionType",void 0),Td([i({type:Number})],Id.prototype,"collectionId",void 0),Td([i({type:Number})],Id.prototype,"useCommunityId",void 0),Id=Td([n("yp-promotion-dashboard")],Id);var Rd=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let _d=class extends p{constructor(){super(...arguments),this.buttonIcon="file_upload"}static get styles(){return[super.styles,e``]}render(){return o`
      <md-outlined-icon-button
        id="button"
        .icon="${this.buttonIcon}"
        class="blue"
        ?raised="${this.raised}"
        .label="${this.buttonText}"
        @click="${this._fileClick}"
      >
      </md-outlined-icon-button>
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}"
      />
    `}};Rd([i({type:String})],_d.prototype,"buttonIcon",void 0),_d=Rd([n("yp-file-upload-icon")],_d);var Ad=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Nd=class extends h{constructor(){super(...arguments),this.previewEnabled=!1}static get styles(){return[super.styles,e`
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

        mwc-textarea {
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
          mwc-textarea {
            width: 290px;
          }
        }

        @media (max-width: 400px) {
          md-outlined-text-field {
            width: 270px;
          }
          mwc-textarea {
            width: 270px;
          }
        }

        mwc-textarea.rounded {
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
      `]}open(){this.$$("#newCampaignDialog").show()}getMediums(){let t=[];return this.shadowRoot.querySelectorAll("md-checkbox").forEach((e=>{e.checked&&t.push(e.name)})),t}async inputsChanged(){const t=this.$$("md-tonal-button"),e=this.$$("#campaignDescription"),i=this.$$("#campaignName");setTimeout((()=>{this.campaignName=i.value,this.promotionText=e.value;this.getMediums().length>0&&i.value.length>0&&e.value.length>0?(this.previewEnabled=!0,t.disabled=!1):(this.previewEnabled=!1,t.disabled=!0)}),50)}save(){this.fire("save",{targetAudience:this.targetAudience,promotionText:this.promotionText,name:this.campaignName,shareImageUrl:this.uploadedImageUrl,mediums:this.getMediums()}),this.close()}discard(){this.close()}close(){this.$$("#newCampaignDialog").close()}cancel(){if(this.previewEnabled){this.$$("#confirmationDialog").show()}else this.discard()}renderAdMediums(){return o`
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
    `}imageUploadCompleted(t){const e=JSON.parse(t.detail.xhr.response),i=JSON.parse(e.formats);this.uploadedImageUrl=i[0]}get collectionImageUrl(){return this.uploadedImageUrl||f.logoImagePath(this.collectionType,this.collection)}renderPreview(){return o`
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
    `}};Ad([i({type:String})],Nd.prototype,"collectionType",void 0),Ad([i({type:Number})],Nd.prototype,"collectionId",void 0),Ad([i({type:Object})],Nd.prototype,"collection",void 0),Ad([i({type:Object})],Nd.prototype,"campaign",void 0),Ad([i({type:Boolean})],Nd.prototype,"previewEnabled",void 0),Ad([i({type:String})],Nd.prototype,"uploadedImageUrl",void 0),Ad([i({type:String})],Nd.prototype,"targetAudience",void 0),Ad([i({type:String})],Nd.prototype,"campaignName",void 0),Ad([i({type:String})],Nd.prototype,"promotionText",void 0),Nd=Ad([n("yp-new-campaign")],Nd);var Ud=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};let Bd=class extends h{constructor(){super(...arguments),this.campaignApi=new kd}firstUpdated(){this.getCampaigns()}newCampaign(){this.newCampaignElement.open()}getTrackingUrl(t,e){const i=`${location.protocol+"//"+location.host}/${this.collectionType}/${this.collectionId}?utm_source=${t.configuration.utm_source}&utm_medium=${e}&utm_campaign=${t.configuration.utm_campaign}&utm_content=${t.id}`;return encodeURI(i)}async createCampaign(t){const e=t.detail,i={utm_campaign:e.name,utm_source:this.collection.name,audience:e.targetAudience,promotionText:e.promotionText,shareImageUrl:e.shareImageUrl,mediums:[]},r=await this.campaignApi.createCampaign(this.collectionType,this.collectionId,{configuration:i});r.configuration.utm_content=`${r.id}`;const n=[];for(let t=0;t<e.mediums.length;t++){const i=e.mediums[t];n.push({utm_medium:i,finaUrl:this.getTrackingUrl(r,i),active:!1})}r.configuration.mediums=n,await this.campaignApi.updateCampaign(this.collectionType,this.collectionId,r.id,{configuration:r.configuration}),this.getCampaigns()}async campaignConfigurationUpdated(t){await this.campaignApi.updateCampaign(this.collectionType,this.collectionId,t.detail.campaignId,{configuration:t.detail.configuration})}async getCampaigns(){this.campaignToDelete=void 0,this.campaigns=await this.campaignApi.getCampaigns(this.collectionType,this.collectionId)}async reallyDeleteCampaign(){try{await this.campaignApi.deleteCampaign(this.collectionType,this.collectionId,this.campaignToDelete)}catch(t){this.campaignToDelete=void 0,console.error(t)}this.getCampaigns()}deleteCampaign(t){this.campaignToDelete=t.detail,this.$$("#deleteConfirmationDialog").show()}cancelDeleteCampaign(){this.campaignToDelete=void 0}static get styles(){return[super.styles,e`
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
    `}};Ud([i({type:String})],Bd.prototype,"collectionType",void 0),Ud([i({type:Number})],Bd.prototype,"collectionId",void 0),Ud([i({type:Object})],Bd.prototype,"collection",void 0),Ud([i({type:Array})],Bd.prototype,"campaigns",void 0),Ud([l("yp-new-campaign")],Bd.prototype,"newCampaignElement",void 0),Bd=Ud([n("yp-campaign-manager")],Bd);var Ld=function(t,e,i,r){for(var n,o=arguments.length,a=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r,s=t.length-1;s>=0;s--)(n=t[s])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};const Ed=1,Fd=2,Pd=3,qd=4,Wd=5;let Hd=class extends h{static get styles(){return[super.styles,e`
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
                  src="${s(f.logoImagePath(this.collectionType,this.collection))}"
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
        <mwc-button dialogAction="cancel" slot="secondaryAction">
          ${this.t("ok")}
        </mwc-button>
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
                  .src="${f.logoImagePath(this.collectionType,this.collection)}"
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
      `}tabChanged(t){0==t.detail.activeIndex?this.pageIndex=1:1==t.detail.activeIndex?this.pageIndex=2:2==t.detail.activeIndex&&(this.pageIndex=5)}exitToMainApp(){window.location.href=`/${this.originalCollectionType}/${this.collectionId}`}_setupEventListeners(){this.addListener("exit-to-app",this.exitToMainApp),this.addGlobalListener("yp-got-admin-rights",this._gotAdminRights.bind(this)),this.addGlobalListener("yp-got-promoter-rights",this._gotPromoterRights.bind(this))}_removeEventListeners(){this.removeGlobalListener("yp-got-admin-rights",this._gotAdminRights.bind(this)),this.removeGlobalListener("yp-got-promoter-rights",this._gotPromoterRights.bind(this))}_gotAdminRights(t){this.haveCheckedAdminRights=!0}_gotPromoterRights(t){this.haveCheckedPromoterRights=!0}_setAdminConfirmed(){if(this.collection)switch(this.collectionType){case"domain":this.adminConfirmed=m.checkDomainAccess(this.collection);break;case"community":this.adminConfirmed=m.checkCommunityAccess(this.collection);break;case"group":this.adminConfirmed=m.checkGroupAccess(this.collection);break;case"post":this.adminConfirmed=m.checkPostAccess(this.collection)}if(!this.adminConfirmed)switch(this.collectionType){case"community":this.adminConfirmed=m.checkCommunityPromoterAccess(this.collection);break;case"group":this.adminConfirmed=m.checkGroupPromoterAccess(this.collection)}this.adminConfirmed||this.fire("yp-network-error",{message:this.t("unauthorized")})}updated(t){super.updated(t),(t.has("loggedInUser")||t.has("haveCheckedAdminRights")||t.has("haveCheckedPromoterRights"))&&this.loggedInUser&&!0===this.haveCheckedAdminRights&&1==this.haveCheckedPromoterRights&&this._getCollection()}_appError(t){let e=t.detail.message;t.detail&&t.detail.response&&(e=t.detail.response.statusText),console.error(e),this.currentError=e,this.$$("#errorDialog").open=!0}_renderPage(){if(console.error(`admin confirmed: ${this.adminConfirmed}`),!this.adminConfirmed)return a;switch(console.error(this.pageIndex),this.pageIndex){case Ed:switch(this.collectionType){case"domain":case"community":case"group":case"post":return o`
                ${v(this.collection?o`<yp-promotion-dashboard
                        .collectionType="${this.collectionType}"
                        .collection="${this.collection}"
                        .collectionId="${this.collectionId}"
                        .useCommunityId="${this.useCommunityId}"
                      >
                      </yp-promotion-dashboard>`:a)}
              `;default:return o`<p>
                Page not found try going to <a href="#main">Main</a>
              </p>`}case Fd:return o`
            ${v(this.collection?o`<yp-campaign-manager
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-campaign-manager>`:a)}
          `;case qd:return o`
            ${v(this.collection?o`<yp-ai-text-analysis
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-ai-text-analysis>`:a)}
          `;case Pd:return o`
            ${v(this.collection?o`<yp-email-lists
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-email-lists>`:a)}
          `;case Wd:return o`
            ${v(this.collection?o`<yp-promotion-settings
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                    @color-changed="${this._settingsColorChanged}"
                  >
                  </yp-promotion-settings>`:a)}
          `;default:return o`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `}}_settingsColorChanged(t){this.fireGlobal("yp-theme-color",t.detail.value)}};Ld([i({type:String})],Hd.prototype,"collectionType",void 0),Ld([i({type:Number})],Hd.prototype,"collectionId",void 0),Ld([i({type:String})],Hd.prototype,"collectionAction",void 0),Ld([i({type:String})],Hd.prototype,"page",void 0),Ld([i({type:Number})],Hd.prototype,"pageIndex",void 0),Ld([i({type:Object})],Hd.prototype,"collection",void 0),Ld([i({type:String})],Hd.prototype,"currentError",void 0),Ld([i({type:Boolean})],Hd.prototype,"adminConfirmed",void 0),Ld([i({type:Boolean})],Hd.prototype,"haveCheckedAdminRights",void 0),Ld([i({type:Boolean})],Hd.prototype,"haveCheckedPromoterRights",void 0),Ld([i({type:Boolean,reflect:!0})],Hd.prototype,"active",void 0),Ld([i({type:String})],Hd.prototype,"lastSnackbarText",void 0),Ld([i({type:String})],Hd.prototype,"useCommunityId",void 0),Hd=Ld([n("yp-promotion-app")],Hd);export{Hd as YpPromotionApp};
