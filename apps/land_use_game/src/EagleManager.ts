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

export class EagleManager extends CharacterManager {
  characterModelUrl = "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/landuse_game/Dragon.glb";
  animationMultiplier = 0.7;
  characterScale = 430;
}
