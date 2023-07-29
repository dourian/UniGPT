import { Document } from "langchain/document";
import { loadQAStuffChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { streamAnswerGPT } from "../controller/streamanswer.js";

export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question,
  response
) => {
  const index = client.Index(indexName);

  const queryEmbedding = await new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_API_KEY,
  }).embedQuery(question);

  let queryResponse = await index.query({
    queryRequest: {
      topK: 4,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });

  if (queryResponse.matches.length) {
    const llm = new OpenAI({
      openAIApiKey: process.env.OPEN_API_KEY,
      streaming: true,
    });
    llm.callbacks = [
      {
        handleLLMNewToken(token) {
          console.log(token);
          streamAnswerGPT(response, token);
        },
      },
    ];
    const chain = loadQAStuffChain(llm);

    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");

    const temperature = 1;
    const maxTokens = 100;

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
