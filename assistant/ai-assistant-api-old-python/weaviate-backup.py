import weaviate

client = weaviate.Client("http://localhost:8080")

result = client.backup.create(
  backup_id="my-very-first-backup",
  backend="filesystem",
  include_classes=["PostsIs", "Posts"],
  wait_for_completion=True,
)

print(result)
