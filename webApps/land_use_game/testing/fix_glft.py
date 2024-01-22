import json

# Load the glTF file
#gltf_data = json.load("data/tofix.gltf")
with open("data/tofix.gltf", "r") as file:
    gltf_data = json.load(file)

# Add the accessors
gltf_data["accessors"] = [
    {
        "bufferView": 0,
        "componentType": 5126,
        "count": int(gltf_data["bufferViews"][0]["byteLength"] / 12),
        "type": "VEC3",
        "max": [1.0, 1.0, 1.0],
        "min": [-1.0, -1.0, -1.0]
    },
    {
        "bufferView": 2,
        "componentType": 5126,
        "count": int(gltf_data["bufferViews"][2]["byteLength"] / 8),
        "type": "VEC2"
    },
    {
        "bufferView": 1,
        "componentType": 5126,
        "count": int(gltf_data["bufferViews"][1]["byteLength"] / 12),
        "type": "VEC3"
    }
]

# Add the meshes
gltf_data["meshes"] = [
    {
        "primitives": [
            {
                "attributes": {
                    "POSITION": 0,
                    "TEXCOORD_0": 1,
                    "NORMAL": 2
                },
                "mode": 4
            }
        ]
    }
]

# Save the updated glTF file
with open("output_file.gltf", "w") as file:
    json.dump(gltf_data, file, indent=2)

