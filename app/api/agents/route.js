import { NextResponse } from "next/server";
import {
  getAssistantID,
  getRecordVectorID,
  createAgent,
  createQuickKnowledge,
  getAgents,
  getAgentById,
  createVectorStoreAndUploadFiles,
  updateAgentVectorStore,
} from "../../../lib/services/userservice";

export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const model = formData.get("model");
  const creativity_level = parseInt(formData.get("creativity_level"));
  const greeting_message = formData.get("greeting_message");
  const instructions = formData.get("instructions");
  const websites = JSON.parse(formData.get("websites"));
  const quickItems = JSON.parse(formData.get("quickItems"));
  const workspace_id = parseInt(formData.get("workspace_id"));
  const documents = formData.getAll("documents"); // array of files

  try {
    const results = await createAgent(
      name,
      model,
      creativity_level,
      greeting_message,
      instructions,
      workspace_id
    );
    const quickKnowledgeResult = await createQuickKnowledge(
      results.newId,
      quickItems,
      websites
    );

    // Handle documents
    let vectorStoreId = null;
    let assistantId = null;
    if (documents && documents.length > 0) {
      const result = await createVectorStoreAndUploadFiles(
        results.newId,
        documents,
        instructions
      );
      vectorStoreId = result.vectorStoreId;
      assistantId = result.assistantId;
      // Update agent with vector_store_id and assistant_id
      await updateAgentVectorStore(results.newId, vectorStoreId, assistantId);
    }

    if (results.newId) {
      return NextResponse.json({ success: true, id: results.newId });
    } else {
      return NextResponse.json({
        success: false,
        message: "Could not create agent",
      });
    }
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: "Database error" });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("id");
  const workspaceId = searchParams.get("workspace_id");

  try {
    if (agentId) {
      const agent = await getAgentById(parseInt(agentId));
  
      

      if (!agent) {
        return NextResponse.json(
          { success: false, message: "Agent not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, agent });
    }

    const agents = await getAgents(workspaceId ? parseInt(workspaceId) : null);
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}
