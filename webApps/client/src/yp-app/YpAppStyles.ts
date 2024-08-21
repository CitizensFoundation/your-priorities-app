/**
@license
Copyright (c) 2010-2024 Citizens Foundation
*/

import { css } from "lit";

export const YpAppStyles = css`
  :host {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  main {
    flex-grow: 1;
  }

  md-icon-button.topActionItem {
    --md-icon-button-icon-color: var(--md-sys-color-on-surface);
  }

  .userImageNotificationContainer {
    margin-right: 16px;
    margin-left: 8px;
  }

  yp-user-image {
    width: 32px;
    height: 32px;
  }

  #leftDrawer {
    margin-left: -8px;
  }

  .loadingAppSpinnerPage {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #userDrawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 230px;
    z-index: 200;
  }

  #dialog {
    --md-dialog-container-color: var(--md-sys-color-error-container);
    --md-dialog-headline-color: var(--md-sys-color-on-error-container);
    --md-dialog-supporting-text-color: var(--md-sys-color-on-error-container);
    color: var(--md-sys-color-on-error-container);
  }

  .errorText {
    padding: 16px;
    font-size: 24px;
    line-height: 1.5;
  }

  #errorCloseButton {
    --md-filled-button-label-text-color: var(--md-sys-color-on-error-container);
    --md-sys-color-primary: var(--md-sys-color-error-container);
    --md-sys-color-on-primary: var(--md-sys-color-on-error-container);
  }

  .loadingAppSpinnerPage,
  yp-admin-app,
  yp-promotion-app {
    position: absolute; /* or absolute, depending on your layout */
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
  }

  .loadingAppSpinnerPage {
    /* Initial state: visible and on-screen */
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
    transition: transform 1.5s;
    z-index: 10; /* Ensure it's above the admin app */
  }

  .loadingAppSpinnerPage.hidden {
    /* Transition to hidden state */
    visibility: hidden;
    transform: translateX(100%);
  }

  yp-promotion-app,
  yp-admin-app {
    /* Initial state: hidden and off-screen */
    visibility: hidden;
    transform: translateX(100%);
    transition: transform 1.5s;
  }

  yp-promotion-app.active,
  yp-admin-app.active {
    /* Active state: visible and on-screen */
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
  }

  .mainPage {
    margin-top: 52px;
  }

  #helpIconButton {
    margin-right: 4px;
  }

  .activeBadge {
    margin-left: -16px;
    margin-top: 2px;
    --md-badge-color: var(--md-sys-color-primary);
    --md-badge-text-color: var(--md-sys-color-on-primary);
    --md-badge-large-color: var(--md-sys-color-primary);
    --md-badge-large-text-color: var(--md-sys-color-on-primary);
  }

  .activeBadge[has-static-theme] {
    --md-badge-color: var(--md-sys-color-primary-container);
    --md-badge-text-color: var(--md-sys-color-on-primary-container);
    --md-badge-large-color: var(--md-sys-color-primary-container);
    --md-badge-large-label-text-color: var(--md-sys-color-on-primary-container);
  }

  .closeButton {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.1s ease, visibility 0.1s ease;
  }

  .closeButton.visible {
    opacity: 1;
    visibility: visible;
  }

  yp-top-app-bar {
    max-width: 1048px;
    margin: 0 auto;
  }
`;
