const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings");
const { TextChunker } = require("langchain/utils");

const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
});

const documents = [
    { id: "1", text: "Document 1 content" },
    { id: "2", text: "Document 2 content" },
    { id: "3", text: "Document 3 content" },
];

const embedDocuments = async () => {
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    for (const doc of documents) {
        const chunks = TextChunker.chunk(doc.text, 500);
        const vectors = await embeddings.embedDocuments(chunks);

        const upsertRequest = vectors.map((vector, idx) => ({
            id: `${doc.id}-${idx}`,
            values: vector,
            metadata: { text: chunks[idx] },
        }));

        await pinecone.index(process.env.PINECONE_INDEX_NAME).upsert({
            vectors: upsertRequest,
        });
    }
};

embedDocuments().then(() => console.log("Documents embedded successfully."));
