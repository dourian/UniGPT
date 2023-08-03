/**
 * Creates Pinecone Index if not already created
 * 
 * @param {PineConeClient} client Pinecone client
 * @param {string} indexName Name of Pinecone index
 * @param {int} vectorDimension Dimension of Pinecone database
 */
const createPineconeIndex = async (
  client,
  indexName,
  vectorDimension
) => {
  // check for existing index
  console.log(`Checking "${indexName}"...`);
  const existingIndexes = await client.listIndexes();

  if (!existingIndexes.includes(indexName)) {
    console.log(`Creating "${indexName}"...`);

    const createClient = await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: "cosine",
      },
    });

    // create index with client
    console.log(`Created with client:`, createClient);

    await new Promise((resolve) => setTimeout(resolve, 60000));
  } else {
    console.log(`"${indexName}" already exists.`);
  }
};

export default createPineconeIndex