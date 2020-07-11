/**
@license
Copyright (c) 2010-2020 Citizens Foundation
*/

import { css } from 'lit-element';

export const YpAppStyles = css`
  :host {
    --main-stats-color-on-white: #878787;

    --paper-dialog-button-color: var(--accent-color);
    --paper-tabs-selection-bar-color: var(--accent-color);
    --paper-input-container-focus-color: var(--accent-color);

    --paper-dropdown-menu: {
      background-color: #FFF;
    };

    --icon-general-color: '#fff';
    --master-point-up-color: rgba(0,127,0,0.62);
    --master-point-down-color: rgba(127,0,0,0.62);
  }

  :host  {
    --paper-dropdown-menu: {
      background-color: #FFF;
    };

    --light-primary-color: #FFCC80;
    --text-primary-color: #fff;
    --dark-primary-color: #F57C00;
    --primary-text-color: #212121;
    --secondary-text-color: #727272;
    --disabled-text-color: #bdbdbd;
    --divider-color: #FF5722;

    --paper-tabs: {
      font-size: 18px;
      text-transform: uppercase;
    };

    --paper-fab-mini: {
      background: var(--primary-background-color);
      color: #555 !important;
    };

    /* Components */

    --paper-tabs-selection-bar: {
      border-bottom: 4px solid !important;
      border-bottom-color: var(--accent-color, #000) !important;
    };

    /* paper-drawer-panel */
    --drawer-menu-color: #ffffff;
    --drawer-border-color: 1px solid #ccc;
    /* paper-menu */
    --paper-menu-background-color: var(--primary-background-color);
    --menu-link-color: #111111;
  }

  :host {
    background-color: var(--primary-background-color);
  }

  app-header {
    color: #fff;
    background-color: var(--primary-background-color);
  }

  app-toolbar {
    color: #FFF;
  }

  iron-pages {
    background-color: var(--primary-background-color);
  }

  [condensed-title] {
    font-size: 16px;
  }

  [title] {
    padding-top: 8px;
    padding-left: 8px;
    padding-bottom: 8px;
  }

  .backIcon {
    width: 32px !important;
    height: 32px !important;
    margin-right: 12px;
    margin-left: 12px;
    padding: 0;
    margin-top: 4px;
  }

  .backIcon[hide] {
    display: none;
  }

  .masterActionIcon {
    width: 52px;
    height: 52px;
  }

  .main-header {
    border-bottom: 1px solid var(--primary-color-800);
    background-color: var(--primary-color-800);
    color: #333;
    height: 64px;
  }

  .dropdown-content {
    width: 200px;
  }

  #paperToggleNavMenu {
    min-width: 40px;
  }

  #translationButton {
    color: #FFF;
    background-color: var(--accent-color);
    padding: 6px;
    min-width: 0 !important;
    margin-left: 8px;
    margin-right: 8px;
  }

  .stopIcon {
    margin-left: 6px;
  }

  .helpButton {
    margin-right: 8px;
  }

  .forwardPostName {
    margin-left: 4px;
    margin-top: 14px;
    color: #C5C5C5;
  }

  @media (max-width: 480px) {
    #forwardPostName {
      display: none !important;
    }

    .stopIcon {
      display: none;
    }

    .forwardPostName {
      margin-left: 4px;
      margin-top: 14px;
      font-size: 15px;
    }

    #translationButton {
      width: 40px !important;
      max-width: 40px !important;
      margin-left: 8px;
    }

    div[title] {
      font-size: 17px;
      white-space: normal !important;
      padding-left: 0;
    }

    .backIcon {
      min-width: 28px !important;
      min-height: 28px !important;
    }

    .masterActionIcon {
      width: 48px;
      height: 48px;
    }

    .loginButton {
      font-size: 15px;
      padding: 4px;
    }

    paper-menu-button {
      padding: 0;
    }

    mwc-button {
      padding:0;
      margin: 0;
    }

    #translationIcon {
      width: 30px;
      height: 30px;
      padding: 6px;
    }
  }

  @media (max-width: 340px) {
    div[title] {
      font-size: 17px;
      white-space: normal !important;
      padding-left: 0;
    }

    .backIcon {
      min-width: 26px !important;
      min-height: 26px !important;
    }

    .loginButton {
      font-size: 12px;
      padding: 0;
    }
  }

  .userImageNotificationContainer {
    cursor: pointer;
    margin-right: 8px;
    display:inline-block;
  }

  .activeBadge {
    --paper-badge-background: var(--accent-color);
  }

  .helpButton[hide] {
    display: none;
  }

  .navContainer[hide] {
    display: none;
  }

  [hidden] {
    display: none !important;
  }

  #headerTitle {
    padding-right: 0 !important;
  }

  app-toolbar {
    padding-left: 8px;
    padding-right: 16px;
  }
`;