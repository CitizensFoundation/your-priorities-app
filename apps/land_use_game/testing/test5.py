import fiona
import geopandas as gpd

gpkg_file = "is_50v_haedargogn_isn2016_lambert_2016.gpkg"
layer_name = "is_50v_haedargogn_isn2016_lambert_2016"

# Read features using Fiona
with fiona.open(gpkg_file, layer=layer_name) as src:
    schema = src.schema
    crs = src.crs
    features = list(src)

# Create an empty GeoDataFrame with the schema and CRS
gdf = gpd.GeoDataFrame(columns=schema['properties'], crs=crs)

# Append features to the GeoDataFrame
for feature in features:
    gdf = gdf.append(gpd.GeoDataFrame(feature['properties'], crs=crs, geometry=[feature['geometry']]))

# Reset the index
gdf.reset_index(drop=True, inplace=True)

print(gdf)
print(gdf["geometry"])

