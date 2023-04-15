import fiona

gpkg_file = "is_50v_haedargogn_isn2016_lambert_2016.gpkg"
layers = fiona.listlayers(gpkg_file)
print("Available layers in the GPKG file:", layers)

import geopandas as gpd
gdf = gpd.read_file("is_50v_haedargogn_isn2016_lambert_2016.gpkg",layer="is_50v_haedargogn_isn2016_lambert_2016")
print(gdf)
#print(gdf["geometry"])
