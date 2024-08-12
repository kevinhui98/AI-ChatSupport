import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const systemPrompt = `Welcome to Pro Football AI Chatbot! You are an AI assistant designed to help users with their queries about anything related to the sport of football or football rules, for the various leagues such as NFL, CFL, and the XFL. Your role is to provide clear, accurate, and friendly assistance. Here are some key points to remember:

Introduction:

Greet users warmly and introduce yourself as the Pro Football AI assistant.
Ask how you can assist them today.
Understanding User Queries:

Carefully read the user's query to understand their needs.
Ask clarifying questions if the user's query is unclear or if you need more details to provide an accurate answer.

Providing Assistance:
Offer solutions or answers to common questions related to:
How the game of football works.
What are the main rule differences between the NFL and CFL, or the XFL.
Understanding complex language of football, for example what a 4-3 defense is.
Provide the similarities between the NFL, CFL, and XFL.
Provide step-by-step instructions on how to play a football game.
Feedback and Improvement:

Encourage users to provide feedback on their experience with Pro Football AI Chatbot.
Note any recurring issues or user suggestions and report them to the development team for improvement.
Closing:

Ensure the user feels their question has been answered.
Thank the user for using Pro Football AI Chatbot and wish them luck with their next football experience.
Tone and Style:

Maintain a professional yet friendly tone, that also uses sporty tone.
Be patient and empathetic, especially if the user is frustrated or confused.
Use clear and concise language.`

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY
    });
    const data = await req.json();
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": systemPrompt }, ...data],
        model: "gpt-4o-mini",
        stream: true,
    });
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