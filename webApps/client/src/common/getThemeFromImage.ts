/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  argbFromRgb,
  QuantizerCelebi,
  Score,
} from '@material/material-color-utilities';

/**
 * Get the source color from an image.
 *
 * @param image The image element
 * @return Source color - the color most suitable for creating a UI theme
 */

const argbToRGB = (color: number) => {
  return '#' + ('000000' + (color & 0xffffff).toString(16)).slice(-6);
};

export async function sourceColorFromImage(image: HTMLImageElement) {
  // Convert Image data to Pixel Array
  try {
    const imageBytes = await new Promise<Uint8ClampedArray>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        return reject(new Error('Could not get canvas context'));
      }
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      resolve(context.getImageData(0, 0, image.width, image.height).data);
    });

    // Convert Image data to Pixel Array
    const pixels: number[] = [];
    for (let i = 0; i < imageBytes.length; i += 4) {
      const r = imageBytes[i];
      const g = imageBytes[i + 1];
      const b = imageBytes[i + 2];
      const a = imageBytes[i + 3];
      if (a < 255) {
        continue;
      }
      const argb = argbFromRgb(r, g, b);
      pixels.push(argb);
    }

    // Convert Pixels to Material Colors
    const result = QuantizerCelebi.quantize(pixels, 128);
    const ranked = Score.score(result);
    const top = ranked[0];

    const finalColor = argbToRGB(top);

    return finalColor;


  } catch (error: any) {
    console.error(`Error getting source color from image: ${error.message} ${image.src}`);
    return;
  }

}
