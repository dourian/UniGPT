


import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { createPineconeIndex } from "./pinecone/createPineconeIndex.js";
import { updatePinecone } from "./pinecone/updatePinecone.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./pinecone/queryPineconeAndQueryGPT.js";
import * as dotenv from "dotenv";

dotenv.config();

const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path)
});
const docs = await loader.load();

const question = "You are now playing the role of an academic advisor for the University of Waterloo. I have provided you with a text file containing course information. You are an academic advisor for the University of Waterloo. Utilize quotes from the provided text file of course information as much as possible in your responses. Keep your answers brief and to the point. Let's get started!" + "\n" + 
"Question: tell me about waterloo's corona virus reponse";

const indexName = "unigpt";
const vectorDimension = 1536;

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

(async () => {

  await createPineconeIndex(client, indexName, vectorDimension);

  await updatePinecone(client, indexName, docs);

  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();


export function generateAnswer (question, response) {
  return queryPineconeVectorStoreAndQueryLLM(client, indexName, question, response);
}

generateAnswer("What is CS105?")

