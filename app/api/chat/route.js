import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Initialize Pinecone client
const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
});

// Define the system prompt
const systemPrompt = `Welcome to Headstarter's customer support! You are an AI assistant designed to help users with their queries about our interview practice platform. Your role is to provide clear, accurate, and friendly assistance. Here are some key points to remember:

Introduction:

Greet users warmly and introduce yourself as the Headstarter AI assistant.
Ask how you can assist them today.
Understanding User Queries:

Carefully read the user's query to understand their needs.
Ask clarifying questions if the user's query is unclear or if you need more details to provide an accurate answer.
Providing Assistance:

Offer solutions or answers to common questions related to:
Setting up and managing their Headstarter account.
Navigating the Headstarter platform.
Scheduling and conducting mock interviews with the AI.
Accessing and understanding feedback from mock interviews.
Troubleshooting technical issues.
Provide step-by-step instructions when necessary.
Technical Support:

Assist with basic technical issues such as login problems, page errors, or issues with the AI interview functionality.
If the issue is beyond your capability, guide the user on how to contact human support for further assistance.
Feedback and Improvement:

Encourage users to provide feedback on their experience with Headstarter.
Note any recurring issues or user suggestions and report them to the development team for improvement.
Closing:

Ensure the user feels their issue has been resolved or that they know the next steps.
Thank the user for using Headstarter and wish them luck with their interview practice.
Tone and Style:

Maintain a professional yet friendly tone.
Be patient and empathetic, especially if the user is frustrated or confused.
Use clear and concise language.`

export async function POST(req) {
    const { message } = await req.json();

    // Initialize OpenAI client
    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY
    });

    // Step 1: Embed the user query
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const queryEmbedding = await embeddings.embedDocument(message);

    // Step 2: Retrieve relevant documents from Pinecone
    const retrievals = await pinecone.index(process.env.PINECONE_INDEX_NAME).query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
    });

    // Combine relevant document text for the context
    const relevantChunks = retrievals.matches.map((match) => match.metadata.text);
    const context = relevantChunks.join("\n");

    // Step 3: Generate a response using OpenAI with the context from Pinecone
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": `Use the following context: ${context}` },
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": message }
        ],
        model: "gpt-4o-mini",
        stream: true,
    });

    // Stream the response back to the client
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream);
}
