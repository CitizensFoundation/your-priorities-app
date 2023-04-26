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
  characterModelUrl = "models/Bull.glb";
  animationMultiplier = 1.0;
  characterScale = 2050;
}
