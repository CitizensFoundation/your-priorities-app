// Interface for GeoJSON feature properties
interface FeatureProperties {
  Name: string;
  LandUse: string;
}

// Interface for GeoJSON feature
interface GeoJSONFeature {
  type: string;
  properties: FeatureProperties;
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}
