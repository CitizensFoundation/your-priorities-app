import numpy as np
import rasterio
import trimesh
from pygltflib import GLTF2, Node, Mesh, Primitive, Accessor, Buffer, BufferView, Scene

import base64
import os

import skimage.measure

import pygltflib

def dem_to_gltf(dem_file, output_gltf_file, downsample_factor=2):
    # Load DEM data
    with rasterio.open(dem_file) as src:
        dem_data = src.read(1, out_dtype=np.float64)
        transform = src.transform.scale(downsample_factor, downsample_factor)
        crs = src.crs

    # Downsample the DEM data
    dem_data = skimage.measure.block_reduce(dem_data, (downsample_factor, downsample_factor), np.mean)

    # Generate vertices and faces from DEM data
    vertices, faces = generate_mesh_from_dem(dem_data, transform)

    # Create a trimesh object
    terrain_mesh = trimesh.Trimesh(vertices=vertices, faces=faces)

    # Export trimesh object to glTF
    export_gltf(terrain_mesh, output_gltf_file)

def generate_mesh_from_dem(dem_data, transform):
    rows, cols = dem_data.shape

    # Generate vertices
    vertices = []
    for i in range(rows):
        for j in range(cols):
            x, y = transform * (j, i)
            z = dem_data[i, j]
            vertices.append([x, y, z])

    # Generate faces
    faces = []
    for i in range(rows - 1):
        for j in range(cols - 1):
            lower_left = i * cols + j
            lower_right = i * cols + (j + 1)
            upper_left = (i + 1) * cols + j
            upper_right = (i + 1) * cols + (j + 1)

            faces.append([lower_left, lower_right, upper_left])
            faces.append([lower_right, upper_right, upper_left])

    return np.array(vertices, dtype=np.float32), np.array(faces, dtype=np.uint32)

def export_gltf(terrain_mesh, output_gltf_file):
    def compute_accessor_bounds(data):
        data_min = data.min(axis=0).tolist()
        data_max = data.max(axis=0).tolist()
        if data.ndim == 1 or data.shape[1] == 3:
            data_type = "VEC3"
        elif data.shape[1] == 4:
            data_type = "VEC4"
        else:
            raise ValueError("Unsupported data shape")
        return data_type, data_min, data_max


    def create_accessor(bufferView, data, componentType):
        accessor = Accessor()
        accessor.bufferView = bufferView
        accessor.byteOffset = 0
        accessor.componentType = componentType
        accessor.normalized = False
        accessor.count = data.shape[0]
        accessor.type, accessor.min, accessor.max = compute_accessor_bounds(data)
        return accessor

    # Generate a glTF object from the trimesh object
    gltf = GLTF2()

    # Create buffer
    buffer = Buffer()
    gltf.buffers.append(buffer)
    buffer_index = len(gltf.buffers) - 1

    # Create buffer view and accessor for vertices
    vertices_buffer_view = BufferView(buffer=buffer_index, target=34962, byteLength=terrain_mesh.vertices.nbytes)
    gltf.bufferViews.append(vertices_buffer_view)
    vertices_accessor = create_accessor(len(gltf.bufferViews) - 1, terrain_mesh.vertices, 5126)
    gltf.accessors.append(vertices_accessor)
    vertices_accessor_index = len(gltf.accessors) - 1

    # Create buffer view and accessor for faces (indices)
    faces_buffer_view = BufferView(buffer=buffer_index, target=34963, byteLength=terrain_mesh.faces.nbytes)
    gltf.bufferViews.append(faces_buffer_view)
    faces_accessor = create_accessor(len(gltf.bufferViews) - 1, terrain_mesh.faces.flatten(), 5125)
    gltf.accessors.append(faces_accessor)
    faces_accessor_index = len(gltf.accessors) - 1

    # Create a mesh primitive
    primitive = Primitive(attributes={'POSITION': vertices_accessor_index}, indices=faces_accessor_index)
    mesh = Mesh(primitives=[primitive])

    # Add mesh to the glTF scene
    gltf.meshes.append(mesh)
    mesh_index = len(gltf.meshes) - 1
    gltf.nodes.append(Node(mesh=mesh_index))
    scene = Scene(nodes=[mesh_index])
    gltf.scenes.append(scene)
    gltf.scene = len(gltf.scenes) - 1

    # Combine vertices and faces data
    flattened_vertices = terrain_mesh.vertices.flatten()
    flattened_faces = terrain_mesh.faces.flatten().astype(np.uint32)  # Convert faces data type to uint32
    combined_data = np.concatenate([flattened_vertices, flattened_faces])

    # Convert combined data to base64 and update the buffer uri
    buffer_data = combined_data.tobytes()

    gltf.buffers[0].uri = os.path.abspath("./buffer.bin")
    vertices_buffer_view.byteOffset = 0
    faces_buffer_view.byteOffset = terrain_mesh.vertices.nbytes

    buffer_length = len(buffer_data)
    gltf.buffers[0].byteLength = buffer_length

    # Save the glTF file
    gltf.save(output_gltf_file)
    with open("out/buffer.bin", "wb") as f:
        f.write(buffer_data)

    # Load the saved glTF file
    with open(output_gltf_file, "r") as f:
        gltf_data = f.read()

    gltf_test = gltf.load(output_gltf_file)
    #print(gltf_test)

if __name__ == "__main__":
    # Replace these with the paths to your input DEM file and output glTF file
    dem_file = "data/clipped_dem.tif"
    output_gltf_file = "out/output_mesh.gltf"

    downsample_factor = 8

    dem_to_gltf(dem_file, output_gltf_file, downsample_factor)