
import { Cartesian3, Entity, JulianDate, Model, Quaternion, Viewer } from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";

export class CharacterManager extends YpCodeBase {
  viewer: Viewer;
  character: Entity | undefined;
  startPosition: Cartesian3;
  endPosition: Cartesian3;
  previousQuaternion!: Quaternion;

  constructor(viewer: Viewer, startPosition: Cartesian3, endPosition: Cartesian3) {
    super();
    this.viewer = viewer;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.previousQuaternion = new Cesium.Quaternion();
  }

  async createWalkingPath() {
    const position = new Cesium.SampledPositionProperty();
    const distance = new Cesium.SampledProperty(Number);
    const velocityVectorProperty = new Cesium.VelocityVectorProperty(position, false);
    const totalSeconds = 100;
    const start = Cesium.JulianDate.fromDate(new Date());
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    this.viewer.clock.startTime = start.clone();
    this.viewer.clock.stopTime = stop.clone();
    this.viewer.clock.currentTime = start.clone();
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    //this.viewer.timeline.zoomTo(start, stop);

    const numberOfSamples = 100;
    let prevLocation = this.startPosition;
    let totalDistance = 0;

    // Convert start and end positions to Cartographic coordinates
  const cartographicStart = Cesium.Cartographic.fromCartesian(this.startPosition);
  const cartographicEnd = Cesium.Cartographic.fromCartesian(this.endPosition);

  // Interpolate positions in Cartographic coordinates
  const cartographicPositions = [];
  for (let i = 0; i <= numberOfSamples; ++i) {
    const factor = i / numberOfSamples;
    const locationFactor = Math.pow(factor, 2);
    const cartographicLocation = new Cesium.Cartographic(
      Cesium.Math.lerp(cartographicStart.longitude, cartographicEnd.longitude, locationFactor),
      Cesium.Math.lerp(cartographicStart.latitude, cartographicEnd.latitude, locationFactor)
    );
    cartographicPositions.push(cartographicLocation);
  }

  // Clamp the interpolated positions to the terrain
  const terrainProvider = this.viewer.terrainProvider;
  const clampedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, cartographicPositions);

// Compute the orientation values
const orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);
let prevVelocity = Cesium.Cartesian3.ZERO;

for (let i = 0; i < clampedPositions.length; ++i) {
  const time = Cesium.JulianDate.addSeconds(start, i * (totalSeconds / numberOfSamples), new Cesium.JulianDate());
  const cartesianPosition = Cesium.Cartographic.toCartesian(clampedPositions[i]);
  position.addSample(time, cartesianPosition);
  distance.addSample(time, (totalDistance += Cesium.Cartesian3.distance(cartesianPosition, prevLocation)));

  // Compute the current velocity
  const currentVelocity = Cesium.Cartesian3.subtract(cartesianPosition, prevLocation, new Cesium.Cartesian3());
  Cesium.Cartesian3.normalize(currentVelocity, currentVelocity);

  const rotationAxis = Cesium.Cartesian3.cross(prevVelocity, currentVelocity, new Cesium.Cartesian3());
  Cesium.Cartesian3.normalize(rotationAxis, rotationAxis);
  const rotationAngle = Cesium.Cartesian3.angleBetween(prevVelocity, currentVelocity);
  const rotationQuaternion = Cesium.Quaternion.fromAxisAngle(rotationAxis, rotationAngle);

  // Add the computed orientation to the SampledProperty
  orientationProperty.addSample(time, rotationQuaternion);

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

  async setupCharacter() {
    const { position, distance, orientationProperty, velocityVectorProperty } = await this.createWalkingPath();
    let modelPrimitive: Model;

    try {
      modelPrimitive = this.viewer.scene.primitives.add(
        await Cesium.Model.fromGltfAsync({
          url: "models/Cesium_Man.glb",
          scale: 4200,
        })
      );

      modelPrimitive.readyEvent.addEventListener(() => {
        modelPrimitive.activeAnimations.addAll({
          loop: Cesium.ModelAnimationLoop.REPEAT,

          multiplier: 0.2,
        });
      });
      const rotation = new Cesium.Matrix3();
      this.viewer.scene.preUpdate.addEventListener(() => {
        const time = this.viewer.clock.currentTime;
        const pos = position.getValue(time);
        const vel = velocityVectorProperty.getValue(time);

        // Compute the orientation quaternion based on the velocity
        const orientationProperty = new Cesium.VelocityOrientationProperty(position);
        const currentQuaternion = orientationProperty.getValue(time);

        // Smoothly interpolate between the previous and current quaternion using the SLERP method
        const slerpFactor = 0.1; // Adjust this value for smoother or more abrupt transitions
        const smoothedQuaternion = Cesium.Quaternion.slerp(
          this.previousQuaternion,
          currentQuaternion,
          slerpFactor,
          new Cesium.Quaternion()
        );

        // Update the previous quaternion
        Cesium.Quaternion.clone(smoothedQuaternion, this.previousQuaternion);

        // Apply the smoothed quaternion to the model matrix
        const rotationMatrix = Cesium.Matrix3.fromQuaternion(smoothedQuaternion);
        Cesium.Matrix4.fromRotationTranslation(rotationMatrix, pos, modelPrimitive.modelMatrix);
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
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100.0),
        eyeOffset: new Cesium.Cartesian3(0, 7.2, 0),
      },
    });

    //this.viewer.trackedEntity = modelLabel;
    //modelLabel.viewFrom = new Cesium.ConstantProperty(Cesium.Cartesian3.fromElements(-30.0, -10.0, 10.0));
    this.character = modelLabel;
  }
}
