import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAgentById } from "../../../lib/services/userservice";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { agentId, messages } = await request.json();

    if (!agentId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Agent ID and messages are required" },
        { status: 400 }
      );
    }

    const agent = await getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // 🔹 Extract latest user message as query
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user")?.content;

    if (!lastUserMessage) {
      return NextResponse.json(
        { success: false, message: "No user message found" },
        { status: 400 }
      );
    }

    // 🔹 Build system prompt - emphasize general knowledge + document access
    let systemPrompt = agent.instructions || "You are a helpful AI assistant.";

    // Add instruction about document usage
    if (agent.vector_store_ID) {
      systemPrompt +=
        "\n\nYou have access to uploaded documents that you can reference when relevant to the user's question. However, you should primarily use your general knowledge to answer questions. Only search and cite the uploaded documents when the user's question is specifically about content that would be found in those documents or when they explicitly ask about the uploaded files.";
    }

    // 🔹 Prepare tools for RAG with file_search (only if vector store exists)
    const tools = agent.vector_store_ID
      ? [
          {
            type: "file_search",
            vector_store_ids: [agent.vector_store_ID],
            max_num_results: 5,
          },
        ]
      : [];

    // 🔹 Create response using Responses API
    const apiCallParams = {
      model: "gpt-4o-2024-11-20",
      input: lastUserMessage,
      instructions: systemPrompt,
    };

    // Only add tools if they exist
    if (tools.length > 0) {
      apiCallParams.tools = tools;
    }

    const response = await openai.responses.create(apiCallParams);

    // 🔹 Extract the message content
    let assistantMessage = "Sorry, I could not generate a response.";

    if (response.output && response.output.length > 0) {
      for (const outputItem of response.output) {
        if (outputItem.type === "message" && outputItem.content) {
          for (const contentItem of outputItem.content) {
            if (contentItem.text) {
              assistantMessage = contentItem.text;
              break;
            }
          }
          break;
        }
      }
    }

    console.log("Response output:", response.output);

    // 🔹 Store response ID for next conversation turn
    let responseId = null;
    if (response.id) {
      responseId = response.id;
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      response_id: responseId,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get response from AI",
      },
      { status: 500 }
    );
  }
}
