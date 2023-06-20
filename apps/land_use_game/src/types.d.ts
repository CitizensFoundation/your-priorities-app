// Interface for GeoJSON feature properties
interface FeatureProperties {
  Name: string;
  LandUse: string;
}

type TutorialStage =
  | "navigation"
  | "chooseType"
  | "clickOnMap"
  | "afterFirstSelection";

// Interface for GeoJSON feature
interface GeoJSONFeature {
  type: string;
  properties: FeatureProperties;
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

interface YpPostNewsStoryReturn {
  point_id: number;
}

interface TutorialPageData extends YpHelpPageData {
  stage: TutorialStage
}
