import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PineconeClient } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import * as dotenv from "dotenv";
import queryPineconeVectorStoreAndQueryLLM from "./pinecone/queryPineconeAndQueryGPT.js";

dotenv.config()

// configs
const indexName = "unigpt";
const vectorDimension = 1536;
const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path)
});
const docs = await loader.load();
const client = new PineconeClient();

/**
 * Initializes Pinecone client in main
 */
async function init() {
  
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
}

// IMPORTANT: run init, update and query from entry point 
(async () => {
  await init()

  // await createPineconeIndex(client, indexName, vectorDimension);

  // await updatePinecone(client, indexName, docs);

  await queryPineconeVectorStoreAndQueryLLM(client, indexName, "What is love?", null, false);
})();

