// const DirectoryLoader = require("langchain/document_loaders/fs/directory")
// import * as DirectoryLoader from "langchain/document_loaders/fs/directory";
import {DirectoryLoader} from "langchain/document_loaders/fs/directory"
import {PineconeClient} from "@pinecone-database/pinecone"
// const PineconeClient = require("@pinecone-database/pinecone")
// const TextLoader = require("langchain/document_loaders/fs/text")
import {TextLoader} from "langchain/document_loaders/fs/text";
// const express = require('express');
import express from 'express'
// const cors = require('cors'); 
import cors from 'cors'
const app = express();
// const queryQuestion = require("./pinecone/queryPineconeAndQueryGPT")
import queryQuestion from "./pinecone/queryPineconeAndQueryGPT.js"
app.use(cors());

let loader = null;
// let docs = null
const indexName = "unigpt";
const vectorDimension = 1536;
let client = null;

async function init() {
  loader = new DirectoryLoader("./documents", {
      ".txt": (path) => new TextLoader(path)
  });
  // docs = await loader.load();
  
  const question = "You are now playing the role of an academic advisor for the University of Waterloo. I have provided you with a text file containing course information. You are an academic advisor for the University of Waterloo. Utilize quotes from the provided text file of course information as much as possible in your responses. Keep your answers brief and to the point. Let's get started!" + "\n" + 
  "Question: tell me about waterloo's corona virus reponse";
  
  client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
}

init()

app.get('/hello', async (req, res) => {
  //console.log("in backend: ", req.params.question);
  const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID."
  const answer = queryQuestion(client, indexName, question, res)
  res.send(answer);
});

const port = 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

// import('./main.js').then(({ generateAnswer }) => {

//   app.get('/hello', async (req, res) => {
//     //console.log("in backend: ", req.params.question);
//     const question = "Tell me about foundations of sequential programs? Include the prerequisites, corequisites, and antirequisites, and the course ID."
//     const answer = await generateAnswer(question);
//     res.send(answer);
//   });

//   const port = 3000;
//   app.listen(port, () => {
//     console.log(`server running on port ${port}`);
//   });
  
// }).catch((error) => {
//   console.error('error:', error);
// });
