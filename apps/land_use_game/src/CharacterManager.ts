
import { Cartesian3, Entity, JulianDate, Model, Viewer } from "cesium";
import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";

export class CharacterManager extends YpCodeBase {
  viewer: Viewer;
  character: Entity | undefined;
  startPosition: Cartesian3;
  endPosition: Cartesian3;

  constructor(viewer: Viewer, startPosition: Cartesian3, endPosition: Cartesian3) {
    super();
    this.viewer = viewer;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
  }

  async createWalkingPath() {
    const position = new Cesium.SampledPositionProperty();
    const distance = new Cesium.SampledProperty(Number);
    const velocityVectorProperty = new Cesium.VelocityVectorProperty(position, false);
    const totalSeconds = 80;
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

  // Convert the clamped positions back to Cartesian coordinates and add them to the SampledPositionProperty
  for (let i = 0; i < clampedPositions.length; ++i) {
    const time = Cesium.JulianDate.addSeconds(start, i * (totalSeconds / numberOfSamples), new Cesium.JulianDate());
    const cartesianPosition = Cesium.Cartographic.toCartesian(clampedPositions[i]);
    position.addSample(time, cartesianPosition);
    distance.addSample(time, (totalDistance += Cesium.Cartesian3.distance(cartesianPosition, prevLocation)));
    prevLocation = cartesianPosition;
  }

    return {
      position,
      distance,
      velocityVectorProperty,
    };
  }

  async setupCharacter() {
    const { position, distance, velocityVectorProperty } = await this.createWalkingPath();
    let modelPrimitive: Model;

    try {
      modelPrimitive = this.viewer.scene.primitives.add(
        await Cesium.Model.fromGltfAsync({
          url: "models/Cesium_Man.glb",
          scale: 2500,
        })
      );

      modelPrimitive.readyEvent.addEventListener(() => {
        modelPrimitive.activeAnimations.addAll({
          loop: Cesium.ModelAnimationLoop.REPEAT,
          animationTime: (duration: number) => {
            return distance.getValue(this.viewer.clock.currentTime) / duration;
          },
          multiplier: 0.004,
        });
      });
      const rotation = new Cesium.Matrix3();
      this.viewer.scene.preUpdate.addEventListener( () => {
        const time = this.viewer.clock.currentTime;
        const pos = position.getValue(time);
        const vel = velocityVectorProperty.getValue(time);
        Cesium.Cartesian3.normalize(vel, vel);
        if (pos !== undefined) {
          Cesium.Transforms.rotationMatrixFromPositionVelocity(
            pos,
            vel,
            this.viewer.scene.globe.ellipsoid,
            rotation
          );
          Cesium.Matrix4.fromRotationTranslation(
            rotation,
            pos,
            modelPrimitive.modelMatrix
          );
        }
      });
    } catch (error) {
      window.alert(error);
    }

    const modelLabel = this.viewer.entities.add({
      position: position,
      orientation: new Cesium.VelocityOrientationProperty(position),
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
