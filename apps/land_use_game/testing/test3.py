import fiona
import geopandas as gpd

gpkg_file = "is_50v_haedargogn_isn2016_lambert_2016.gpkg"
layer_name = "is_50v_haedargogn_isn2016_lambert_2016"

# Read features using Fiona
with fiona.open(gpkg_file, layer=layer_name) as src:
    crs = src.crs
    features = list(src)

# Create a GeoDataFrame from the features
gdf = gpd.GeoDataFrame.from_features(features, crs=crs)

print(gdf)
print(gdf["geometry"])

