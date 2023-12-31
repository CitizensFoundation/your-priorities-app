from langchain.vectorstores.weaviate import Weaviate
from langchain.llms import OpenAI
from langchain.chains import ChatVectorDBChain
import weaviate
import os
import json

client = weaviate.Client("http://localhost:8080")
nearText = {"concepts": ["dogs"]}

result = (
    client.query
    .get("Posts", ["englishNameAndContent"])
    .with_near_text(nearText)
    .with_limit(5)
    .do()
)

print(json.dumps(result, indent=4))

vectorstore = Weaviate(client, "Posts", "englishNameAndContent")

MyOpenAI = OpenAI(temperature=0.7,
    openai_api_key=os.environ.get("OPENAI_API_KEY"))

qa = ChatVectorDBChain.from_llm(MyOpenAI, vectorstore, verbose=True)

chat_history = []

print("Welcome to the My Neighborhood AI Assistant!")
print("Ask me anything about our project.")

while True:
    print("")
    query = input("")
    result = qa({"question": query, "chat_history": chat_history})
    print(result["answer"])
    chat_history = [(query, result["answer"])]