import fiona
import geopandas as gpd
from shapely.geometry import shape

gpkg_file = "is_50v_haedargogn_isn2016_lambert_2016.gpkg"
layer_name = "is_50v_haedargogn_isn2016_lambert_2016"

# Read features using Fiona
with fiona.open(gpkg_file, layer=layer_name) as src:
    crs = src.crs
    features = list(src)

# Extract geometry and properties data from the features
geometry = [shape(feature["geometry"]) for feature in features]
properties = [feature["properties"] for feature in features]

# Create a GeoDataFrame from the geometry and properties data
gdf = gpd.GeoDataFrame(properties, geometry=geometry, crs=crs)

print(gdf)
print(gdf["geometry"])

