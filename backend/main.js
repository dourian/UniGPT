


import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { createPineconeIndex } from "./pinecone/createPineconeIndex.js";
import { updatePinecone } from "./pinecone/updatePinecone.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./pinecone/queryPineconeAndQueryGPT.js";
import * as dotenv from "dotenv";

dotenv.config();

// 7. Set up DirectoryLoader to load documents from the ./documents directory
const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path)
});
const docs = await loader.load();
// 8. Set up variables for the filename, question, and index settings
// const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID.";
const indexName = "unigpt";
const vectorDimension = 1536;
// 9. Initialize Pinecone client with API key and environment
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
// 10. Run the main async function
// (async () => {
// // 11. Check if Pinecone index exists and create if necessary
//   await createPineconeIndex(client, indexName, vectorDimension);
// // 12. Update Pinecone vector store with document embeddings
//   await updatePinecone(client, indexName, docs);
// // 13. Query Pinecone vector store and GPT model for an answer
//   await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
// })();


export function generateAnswer (question, response) {
  return queryPineconeVectorStoreAndQueryLLM(client, indexName, question, response);
}

generateAnswer("What is CS105?")

