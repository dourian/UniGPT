import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { createPineconeIndex } from ".backend/createPineconeIndex.js";
import { updatePinecone } from "./backend/updatePinecone.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./backend/queryPineconeAndQueryGPT.js";

dotenv.config();
// 7. Set up DirectoryLoader to load documents from the ./documents directory
const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path)
});
const docs = await loader.load();
// 8. Set up variables for the filename, question, and index settings
const question = "Who is mr Gatsby?";
const indexName = "your-pinecone-index-name";
const vectorDimension = 1536;
// 9. Initialize Pinecone client with API key and environment
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
// 10. Run the main async function
(async () => {
// 11. Check if Pinecone index exists and create if necessary
  await createPineconeIndex(client, indexName, vectorDimension);
// 12. Update Pinecone vector store with document embeddings
  await updatePinecone(client, indexName, docs);
// 13. Query Pinecone vector store and GPT model for an answer
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();