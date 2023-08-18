import {PineconeClient} from "@pinecone-database/pinecone"
import express from 'express'
import bodyParser from "body-parser"
import cors from 'cors'
import queryQuestion from "./pinecone/queryPineconeAndQueryGPT.js"
import * as dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";

const app = express();
const jsonParser = bodyParser.json()

// configs for express
dotenv.config();
app.use(cors());

// inits for pinecone
const indexName = "unigpt";
let pclient = new PineconeClient();

// open ai key
let openAiKey = "";

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

// default
app.get('/', (req, res) => {
    res.send("Welcome to UniGPT!")
});

app.get('/initkey', jsonParser, async (req, res) => {
    const key = req.body.key || req.query.key || ""

    // verify the key works by creating a llm, send data
    try {
        new OpenAI({
          openAIApiKey: key,
        });
        openAiKey = key
        // console.log(key)
        res.json({status: "success"})
    } catch (err) {
        console.log(err)
        res.json({status: "failure"})
    }
})

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
    const question = req.body.question || req.query.question || ""

    // handle empty question
    if (question === "" || question === null) {
      res.send("Data is not in the right format, try again.")
    }

    const useStream = true;
    const prePrompt = "You are going to act as an advisor for the University of Waterloo. I will ask you a question, and I want you to answer it to the best of you abilities. Here is the question: "
    // query and send answer

    const promptedQuestion = prePrompt + question;
    const answer = await queryQuestion(pclient, indexName, promptedQuestion, res, useStream, openAiKey)

    if (!useStream) res.send(answer);

    res.end();
  } catch {
    res.send("Something went wrong")
  }
  
});

// generate prompts
app.get('/prompts', jsonParser, async (req, res) => {
  try {
    // initPinecone()
    // await pclient.init({
    //   apiKey: process.env.PINECONE_API_KEY,
    //   environment: process.env.PINECONE_ENVIRONMENT,
    // });

    // const useStream = false
    // const question = "What are 4 example questions a user can ask you? Number each example from 1 to 4."
    // const answer = await queryQuestion(pclient, indexName, question, res, useStream)
    // const questionsArray = answer.split(/\d+\.\s+/).filter(item => item.trim() !== '');
    // console.log(questionsArray)
    res.send("hi")

  } catch (error){
    console.error("Error:", error);
  }

});

// listen to app
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

