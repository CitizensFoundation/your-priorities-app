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

export class DragonManager extends CharacterManager {
  characterModelUrl = "models/Dragon.glb";
  animationMultiplier = 0.9;
  characterScale = 1000;
}
