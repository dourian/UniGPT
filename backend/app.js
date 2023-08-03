import {PineconeClient} from "@pinecone-database/pinecone"
import express from 'express'
import cors from 'cors'
import queryQuestion from "./pinecone/queryPineconeAndQueryGPT.js"
import * as dotenv from "dotenv";

const app = express();

// configs for express
dotenv.config();
app.use(cors());

// inits for pinecone
const indexName = "unigpt";
let pclient = new PineconeClient();

/**
 * Initializes Pinecone Client
 */
async function initPinecone() {
  pclient = new PineconeClient();
  await pclient.init({
    projectName: "unigpt",
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
}

// ask question route
app.get('/ask', async (req, res) => {
  initPinecone()
  await pclient.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID."
  const answer = await queryQuestion(pclient, indexName, question, res, true)
  res.send(answer);
});

// listen to app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

