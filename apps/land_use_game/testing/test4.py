import fiona
import geopandas as gpd

gpkg_file = "is_50v_haedargogn_isn2016_lambert_2016.gpkg"
layer_name = "is_50v_haedargogn_isn2016_lambert_2016"

# Read features using Fiona
with fiona.open(gpkg_file, layer=layer_name) as src:
    crs = src.crs
    features = list(src)

# Create a DataFrame from the features
df = gpd.GeoDataFrame.from_features(features)

# Set the CRS and geometry column
df.crs = crs
df.set_geometry(df.geometry.name, inplace=True)

print(df)
print(df["geometry"])

