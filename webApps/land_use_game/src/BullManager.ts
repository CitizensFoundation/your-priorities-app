import {
  Cartesian3,
  Cartographic,
  Entity,
  JulianDate,
  Model,
  Quaternion,
  Viewer,
} from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";
import { CharacterManager } from "./CharacterManager";

export class BullManager extends CharacterManager {
  characterModelUrl = "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/Bull.glb";
  animationMultiplier = 1.0;
  characterScale = 2050;
}
