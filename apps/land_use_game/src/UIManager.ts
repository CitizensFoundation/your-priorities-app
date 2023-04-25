import {
  Viewer,
  Entity,
  Color,
  HeadingPitchRoll,
  Transforms,
  Cartesian3,
  SampledPositionProperty,
} from "cesium";

export class UIManager {
  private viewer: Viewer;
  private icons: Entity[] = [];
  private selectedIcon: Entity | null = null;

  constructor(viewer: Viewer, iconUrls: string[]) {
    this.viewer = viewer;
    this.loadIcons(iconUrls);
    this.setupEventListeners();
  }

  private loadIcons(iconUrls: string[]): void {
    for (const url of iconUrls) {
      const entity = this.loadModel(url);
      this.icons.push(entity);
      this.attachIconToCamera(entity);
      this.viewer.entities.add(entity);
    }
  }

  private loadModel(url: string): Entity {
    return new Cesium.Entity({
      model: {
        uri: url,
        show: true,
//        scale: 100
      },
    });
  }

  private setupEventListeners(): void {
    const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    screenSpaceEventHandler.setInputAction(
      (event: any) => this.handleLeftClick(event),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    const updateIcons = () => {
      for (const icon of this.icons) {
        this.attachIconToCamera(icon);
      }
      requestAnimationFrame(updateIcons);
    };

    updateIcons();
  }
  private attachIconToCamera(entity: Entity): void {
    const hpr = new Cesium.HeadingPitchRoll(
      this.viewer.camera.heading,
      this.viewer.camera.pitch,
      this.viewer.camera.roll
    );
    const position = new Cesium.Cartesian3();
    const iconIndex = this.icons.indexOf(entity);

    const offset = Cesium.Cartesian3.multiplyByScalar(
      this.viewer.camera.right,
      10 * iconIndex,
      new Cesium.Cartesian3()
    );

    Cesium.Cartesian3.add(
      this.viewer.camera.position,
      Cesium.Cartesian3.multiplyByScalar(this.viewer.camera.direction, 100, new Cesium.Cartesian3()),
      position
    );

    Cesium.Cartesian3.add(position, offset, position);

    entity.position = new Cesium.ConstantPositionProperty(position);
  }

  private handleLeftClick(event: any): void {
    const pickedObject = this.viewer.scene.pick(event.position);
    if (pickedObject && pickedObject.id instanceof Cesium.Entity) {
      this.selectIcon(pickedObject.id as Entity);
    }
  }

  private selectIcon(icon: Entity): void {
    if (this.selectedIcon) {
      //this.selectedIcon.model.color = new Color(1, 1, 1, 1); // White
    }

    this.selectedIcon = icon;
    //this.selectedIcon.model.color = new Color(1, 1, 0, 1); // Yellow
    this.startRotation();
  }

  private startRotation(): void {
    const rotate = () => {
      if (this.selectedIcon) {
        const currentPosition = this.selectedIcon.position!.getValue(this.viewer.clock.currentTime);
        const hpr = new Cesium.HeadingPitchRoll(0, 0, Cesium.Math.toRadians(0.5));
        const quaternion = new Cesium.Quaternion();
        Cesium.Quaternion.fromHeadingPitchRoll(hpr, quaternion);
        const rotation = Cesium.Matrix3.fromQuaternion(quaternion);
        const newPosition = new Cesium.Cartesian3();
        Cesium.Matrix3.multiplyByVector(rotation, currentPosition!, newPosition);

        const positionProperty = new Cesium.SampledPositionProperty();
        positionProperty.addSample(this.viewer.clock.currentTime, newPosition);
        this.selectedIcon.position = positionProperty;

        this.viewer.scene.requestRender();
        requestAnimationFrame(rotate);
      }
    };

    rotate();
  }
}
