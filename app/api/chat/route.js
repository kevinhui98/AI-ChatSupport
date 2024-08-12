import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from '@pinecone-database/pinecone';

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
    // const openai = new OpenAI({
    //     baseURL: 'https://openrouter.ai/api/v1',
    //     apiKey: process.env.OPENROUTER_API_KEY
    // });
    // const data = await req.json();
    const message = await req.json();
    const lastMessage = message[message.length - 1];
    const otherMessages = message.slice(0, message.length - 1);
    // Initialize Pinecone client
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    // Initialize OpenAI client
    // const openai = new OpenAI({
    //     baseURL: 'https://openrouter.ai/api/v1',
    //     apiKey: process.env.OPENROUTER_API_KEY
    // });
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    // let index_name = "text-embedding-3-small"
    // let index_name = "amazon.titan-embed-text-v2:0"
    let index_name = "rag-project"
    // await pinecone.createIndex({
    //     name: index_name,
    //     dimension: 2,
    //     metric: 'euclidean',
    //     spec: {
    //         serverless: {
    //             cloud: 'aws',
    //             region: 'us-east-1'
    //         }
    //     }
    // });
    // const index = pinecone.index(index_name);
    console.log('message', message);
    // Step 1: Embed the user query
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": systemPrompt }, ...data],
        model: "gpt-4o-mini",
        stream: true,
    });
    try {
        const queryEmbedding = await embeddings.embedDocuments(message);
        await pinecone.index(index_name).namespace("( Default )").upsert({
            id: message.id,
            vector: queryEmbedding,
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.error("Permission Denied: You are not allowed to sample from this model. Check your API key and permissions.");
        } else {
            console.error("An error occurred:", error.message);
        }
    }
    // we have a readable stream that sends the data to the client
    const stream = new ReadableStream({
        // we use async so this doesn't stall the main thread while waiting for data. we can have multiple connection at the same time
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                // we need to close the stream when we are done
                controller.close();
            }
        }
    });
    return new NextResponse(stream);
    // console.log(data);
    // console.log(completion.choices[0].message.content);
    // return NextResponse.json(
    //     { message: completion.choices[0].message.content }, { status: 200 },
    // );
}