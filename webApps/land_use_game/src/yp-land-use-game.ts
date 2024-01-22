declare global {
  const Cesium: typeof import('cesium');
}

import { YpLandUseGame } from './YpLandUseGame.js';

customElements.define('yp-land-use-game', YpLandUseGame)