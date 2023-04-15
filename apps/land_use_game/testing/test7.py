import rasterio
from rasterio.mask import mask
import geopandas as gpd
from shapely.geometry import shape

multipolygon_file = 'Bláskógabyggð_full.geojson'

# Your example MultiPolygon GeoJSON
multipolygon_geojson = gpd.read_file(multipolygon_file)

# Convert the GeoJSON object to a GeoDataFrame
#multipolygon_gdf = gpd.GeoDataFrame.from_features(multipolygon_geojson["features"])
multipolygon_gdf = gpd.GeoDataFrame.from_features(multipolygon_geojson)
# Set the CRS explicitly
multipolygon_gdf.crs = "EPSG:4326"

zmasl_file = "IslandsDEMv1.0_10x10m_isn2016_zmasl.tif"
shade_file = "IslandsDEMv1.0_10x10m_isn2016_shade.tif"
daylight_file = "IslandsDEMv1.0_10x10m_isn2016_daylight.tif"

# Ensure that the multipolygon CRS matches the DEM file CRS
# If it doesn't, reproject the multipolygon to the same CRS as the DEM file
with rasterio.open(zmasl_file) as src:
    dem_crs = src.crs
    if multipolygon_gdf.crs != dem_crs:
        multipolygon_gdf = multipolygon_gdf.to_crs(dem_crs)

# Convert the GeoDataFrame to a list of geometries
multipolygon_geom = multipolygon_gdf.geometry.values.tolist()

# Clip the DEM file using the multipolygon
with rasterio.open(zmasl_file) as src:
    out_image, out_transform = mask(src, multipolygon_geom, crop=True)
    out_meta = src.meta

# Update the metadata with the new clipped raster properties
out_meta.update({
    "driver": "GTiff",
    "height": out_image.shape[1],
    "width": out_image.shape[2],
    "transform": out_transform
})

# Save the clipped DEM to a new file
with rasterio.open('clipped_dem.tif', 'w', **out_meta) as dest:
    dest.write(out_image)

