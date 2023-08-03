import {PineconeClient} from "@pinecone-database/pinecone"
import express from 'express'
import bodyParser from "body-parser"
import cors from 'cors'
import queryQuestion from "./pinecone/queryPineconeAndQueryGPT.js"
import * as dotenv from "dotenv";

const app = express();
const jsonParser = bodyParser.json()

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
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
}

// ask question route
app.get('/ask', jsonParser, async (req, res) => {
  try {
    // init pinecone client
    initPinecone()
    await pclient.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    // fetch data from json
    const question = req.body.question || ""

    // handle empty question
    if (question === "" || question === null) {
      res.send("Data is not in the right format, try again.")
    }

    const useStream = true;

    // query and send answer
    const answer = await queryQuestion(pclient, indexName, question, res, useStream)

    if (!useStream) res.send(answer);

    res.end();
  } catch {
    res.send("Something went wrong")
  }
  
});

// listen to app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
