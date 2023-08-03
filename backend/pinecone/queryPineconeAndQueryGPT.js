import { Document } from "langchain/document";
import { loadQAStuffChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import streamAnswerGPT from "../controller/streamanswer.js";

/**
 * Queries the Pinecone database for the nearest matches and returns as a string
 * 
 * @param {PineConeClient} client Pinecone Client
 * @param {string} indexName Name of the Pinecone index
 * @param {string} question The question to be queried
 * @param {*} response Response object from express route
 * @param {boolean} streamTrue True: want streaming, False: no streaming
 * @returns answer to queried quesion
 */
const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question,
  response,
  streamTrue
) => {
  const index = client.Index(indexName);

  // create embeddings
  const queryEmbedding = await new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_API_KEY,
  }).embedQuery(question);

  // query question
  let queryResponse = await index.query({
    queryRequest: {
      topK: 4,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });

  // match query to answer
  if (queryResponse.matches.length) {
    const llm = new OpenAI({
      openAIApiKey: process.env.OPEN_API_KEY,
      streaming: true,
    });

    // STREAMING CALLBACKS, UNDER WORK RIGHT NOW!!
    if (streamTrue) {
      llm.callbacks = [
        {
          handleLLMNewToken(token) {
            console.log(token);
            streamAnswerGPT(response, token);
          },
        },
      ];
    }

    const chain = loadQAStuffChain(llm);

    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");

    const temperature = 1;
    const maxTokens = 100;

    // query the chain
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
      temperature,
      max_tokens: maxTokens,
    });
    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    return "Since there are no matches, GPT-3 will not be queried.";
  }
};

export default queryPineconeVectorStoreAndQueryLLM