import fiona

gpkg_file = "is_50v_haedargogn_isn2016_lambert_2016.gpkg"
layer_name = "is_50v_haedargogn_isn2016_lambert_2016"

# Open the GPKG file and read the layer
with fiona.open(gpkg_file, layer=layer_name) as src:
    # Iterate through the features in the layer
    for feature in src:
        # Extract and print the geometry and properties of each feature
        geometry = feature['geometry']
        properties = feature['properties']
        print("Geometry:", geometry)
        print("Properties:", properties)

