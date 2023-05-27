import {
  Cartesian3,
  Cartographic,
  Entity,
  JulianDate,
  Model,
  Quaternion,
  Viewer,
} from "cesium";

// Are you GPT-4?
// I am GPT-4.

// Can you rewrite the code below so it's doing 2D animations?
// Sure, I can do that.

import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";

export class CharacterManager extends YpCodeBase {
  viewer: Viewer;
  character: Entity | undefined;
  startPosition: Cartesian3;
  endPosition: Cartesian3;
  previousQuaternion!: Quaternion;
  totalAnimationTime = 100 * 2;
  characterModelUrl = "models/Cesium_Man.glb";
  animationMultiplier = 0.2;
  characterScale = 4200;

  constructor(
    viewer: Viewer,
    startPosition: Cartesian3,
    endPosition: Cartesian3
  ) {
    super();
    this.viewer = viewer;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.previousQuaternion = Cesium.Quaternion.IDENTITY.clone();
  }

  private generateInterpolatedPositions(
    start: Cartographic,
    end: Cartographic,
    numberOfSamples: number
  ) {
    const positions = [];
    for (let i = 0; i <= numberOfSamples; ++i) {
      const factor = i / numberOfSamples;
      const locationFactor = Math.pow(factor, 2);
      const cartographicLocation = new Cesium.Cartographic(
        Cesium.Math.lerp(start.longitude, end.longitude, locationFactor),
        Cesium.Math.lerp(start.latitude, end.latitude, locationFactor)
      );
      positions.push(cartographicLocation);
    }
    return positions;
  }

  async createWalkingPath() {
    const position = new Cesium.SampledPositionProperty();
    const distance = new Cesium.SampledProperty(Number);
    const velocityVectorProperty = new Cesium.VelocityVectorProperty(
      position,
      false
    );

    const start = Cesium.JulianDate.fromDate(new Date());
    const stop = Cesium.JulianDate.addSeconds(
      start,
      this.totalAnimationTime,
      new Cesium.JulianDate()
    );

    //this.viewer.clock.startTime = start.clone();
    //this.viewer.clock.stopTime = stop.clone();
    //this.viewer.clock.currentTime = start.clone();
    //this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    //this.viewer.timeline.zoomTo(start, stop);

    const numberOfSamples = 100;
    let prevLocation = this.startPosition;
    let totalDistance = 0;

    // Convert start and end positions to Cartographic coordinates
    const cartographicStart = Cesium.Cartographic.fromCartesian(
      this.startPosition
    );
    const cartographicEnd = Cesium.Cartographic.fromCartesian(this.endPosition);

    const cartographicPositions = this.generateInterpolatedPositions(
      cartographicStart,
      cartographicEnd,
      numberOfSamples
    );
    const cartographicPositionsBack = this.generateInterpolatedPositions(
      cartographicEnd,
      cartographicStart,
      numberOfSamples
    ).slice(1);
    const allCartographicPositions = cartographicPositions.concat(
      cartographicPositionsBack
    );

    // Clamp the interpolated positions to the terrain
    const terrainProvider = this.viewer.terrainProvider;
    const clampedPositions = await Cesium.sampleTerrainMostDetailed(
      terrainProvider,
      allCartographicPositions
    );
    // Compute the orientation values
    const orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);
    const firstPosition = Cesium.Cartographic.toCartesian(clampedPositions[0]);
    const secondPosition = Cesium.Cartographic.toCartesian(clampedPositions[1]);
    let prevVelocity = Cesium.Cartesian3.subtract(
      secondPosition,
      firstPosition,
      new Cesium.Cartesian3()
    );
    Cesium.Cartesian3.normalize(prevVelocity, prevVelocity);
    for (let i = 0; i < allCartographicPositions.length; ++i) {
      const time = Cesium.JulianDate.addSeconds(
        start,
        i * (this.totalAnimationTime / allCartographicPositions.length),
        new Cesium.JulianDate()
      );
      const cartesianPosition = Cesium.Cartographic.toCartesian(
        clampedPositions[i]
      );
      position.addSample(time, cartesianPosition);
      distance.addSample(
        time,
        (totalDistance += Cesium.Cartesian3.distance(
          cartesianPosition,
          prevLocation
        ))
      );

      // Compute the current velocity
      const currentVelocity = Cesium.Cartesian3.subtract(
        cartesianPosition,
        prevLocation,
        new Cesium.Cartesian3()
      );
      Cesium.Cartesian3.normalize(currentVelocity, currentVelocity);

      const rotationAxis = Cesium.Cartesian3.cross(
        prevVelocity,
        currentVelocity,
        new Cesium.Cartesian3()
      );
      Cesium.Cartesian3.normalize(rotationAxis, rotationAxis);
      const rotationAngle = Cesium.Cartesian3.angleBetween(
        prevVelocity,
        currentVelocity
      );
      const rotationQuaternion = Cesium.Quaternion.fromAxisAngle(
        rotationAxis,
        rotationAngle
      );

      // Add the computed orientation to the SampledProperty
      if (i < allCartographicPositions.length - 1) {
        orientationProperty.addSample(time, rotationQuaternion);
      } else {
        // When reaching the end, use the initial orientation
        orientationProperty.addSample(time, orientationProperty.getValue(start));
      }

      prevLocation = cartesianPosition;
      prevVelocity = currentVelocity;
    }


    return {
      position,
      distance,
      velocityVectorProperty,
      orientationProperty,
    };
  }

  private getLoopedTime(time: JulianDate, start: JulianDate, duration: number) {
    const timeSinceStart = Cesium.JulianDate.secondsDifference(time, start);
    const loopedTimeSinceStart = timeSinceStart % duration;
    return Cesium.JulianDate.addSeconds(start, loopedTimeSinceStart, new Cesium.JulianDate());
  }

  async setupCharacter() {
    const start = Cesium.JulianDate.fromDate(new Date());
    const { position, distance, orientationProperty, velocityVectorProperty } =
      await this.createWalkingPath();
    let modelPrimitive: Model;

    try {
      modelPrimitive = this.viewer.scene.primitives.add(
        await Cesium.Model.fromGltfAsync({
          url: this.characterModelUrl,
          scale: this.characterScale,
        })
      );

      modelPrimitive.readyEvent.addEventListener(() => {
        modelPrimitive.activeAnimations.addAll({
          loop: Cesium.ModelAnimationLoop.REPEAT,

          multiplier: this.animationMultiplier,
        });
      });
      const rotation = new Cesium.Matrix3();
      this.viewer.scene.preUpdate.addEventListener(() => {
        const time = this.getLoopedTime(this.viewer.clock.currentTime, start, this.totalAnimationTime);
        const pos = position.getValue(time);
        const vel = velocityVectorProperty.getValue(time);

        // Compute the orientation quaternion based on the velocity
        const orientationProperty = new Cesium.VelocityOrientationProperty(
          position
        );
        const currentQuaternion = orientationProperty.getValue(time);

        // Smoothly interpolate between the previous and current quaternion using the SLERP method
        const slerpFactor = 0.1; // Adjust this value for smoother or more abrupt transitions
        let smoothedQuaternion;
        if (Cesium.defined(currentQuaternion)) {
          smoothedQuaternion = Cesium.Quaternion.slerp(
            this.previousQuaternion,
            currentQuaternion,
            slerpFactor,
            new Cesium.Quaternion()
          );
        } else {
          smoothedQuaternion = this.previousQuaternion;
        }

        // Update the previous quaternion
        Cesium.Quaternion.clone(smoothedQuaternion, this.previousQuaternion);

        // Apply the smoothed quaternion to the model matrix
        const rotationMatrix =
          Cesium.Matrix3.fromQuaternion(smoothedQuaternion);
        Cesium.Matrix4.fromRotationTranslation(
          rotationMatrix,
          pos,
          modelPrimitive.modelMatrix
        );
      });
    } catch (error) {
      window.alert(error);
    }

    const modelLabel = this.viewer.entities.add({
      position: position,
      orientation: orientationProperty,
      label: {
        text: "HALLO",
        font: "20px sans-serif",
        showBackground: true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          100.0
        ),
        eyeOffset: new Cesium.Cartesian3(0, 7.2, 0),
      },
    });

    //this.viewer.trackedEntity = modelLabel;
    //modelLabel.viewFrom = new Cesium.ConstantProperty(Cesium.Cartesian3.fromElements(-30.0, -10.0, 10.0));
    this.character = modelLabel;
  }
}
