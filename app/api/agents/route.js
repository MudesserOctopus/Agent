import { NextResponse } from "next/server";
import {
  createAgent,
  createQuickKnowledge,
  getAgents,
  getAgentById,
  createVectorStoreAndUploadFiles,
  updateAgentVectorStore,
  updateAgent,
  createDocument,
  createWebAddress,
} from "../../../lib/services/userservice";
import { extractWebsiteText } from "../../../lib/utils/websiteExtractor";

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

    // 1️⃣ Start with uploaded documents
    const allDocuments = [...documents];

    // 2️⃣ Convert websites into text documents
    if (websites && websites.length > 0) {
      for (const url of websites) {
        try {
          const extractedText = await extractWebsiteText(url);
      

          // Safety limit (important)
          const MAX_CHARS = 200_000;
          const finalText = extractedText.slice(0, MAX_CHARS);

          const safeFileName = url
            .replace(/^https?:\/\//, "")
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();

          const websiteFile = new File([finalText], `${safeFileName}.txt`, {
            name: `${safeFileName}.txt`,
            type: "text/plain",
            size: Buffer.byteLength(finalText),
            arrayBuffer: async () => Buffer.from(finalText, "utf-8"),
          });

          allDocuments.push(websiteFile);
        } catch (err) {
          console.error(`Failed to process website: ${url}`, err);
        }
      }
    }

    // 3️⃣ Upload everything together
    if (allDocuments.length > 0) {
      const result = await createVectorStoreAndUploadFiles(
        results.newId,
        allDocuments,
        instructions
      );

      vectorStoreId = result.vectorStoreId;
      assistantId = result.assistantId;

      await updateAgentVectorStore(results.newId, vectorStoreId, assistantId);
    }

    // Save documents to Document table
    const docPromises = documents.map((file) => createDocument(results.newId, file.name));
    // Save websites to WebAddress table
    const webPromises = websites.map((url) => createWebAddress(results.newId, url));

    await Promise.all([...docPromises, ...webPromises]);

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

export async function PUT(request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const model = formData.get("model");
  const creativity_level = parseInt(formData.get("creativity_level"));
  const greeting_message = formData.get("greeting_message");
  const instructions = formData.get("instructions");
  const websites = JSON.parse(formData.get("websites"));
  const quickItems = JSON.parse(formData.get("quickItems"));
  const workspace_id = parseInt(formData.get("workspace_id"));
  const editId = parseInt(formData.get("editId"));
  const documents = formData.getAll("documents"); // array of files

  try {
    const results = await updateAgent(
      editId,
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

    // 1️⃣ Start with uploaded documents
    const allDocuments = [...documents];

    // 2️⃣ Convert websites into text documents
    if (websites && websites.length > 0) {
      for (const url of websites) {
        try {
          const extractedText = await extractWebsiteText(url);
          allDocuments.push(
            new File([extractedText], `${url}.txt`, { type: "text/plain" })
          );
        } catch (error) {
          console.error(`Error extracting text from ${url}:`, error);
        }
      }
    }

    // 3️⃣ Create vector store and upload files if there are documents
    if (allDocuments.length > 0) {
      const vectorResult = await createVectorStoreAndUploadFiles(
        results.newId,
        allDocuments
      );
      vectorStoreId = vectorResult.vectorStoreId;
      assistantId = vectorResult.assistantId;

      await updateAgentVectorStore(results.newId, vectorStoreId, assistantId);
    }

    // Save documents to Document table
    const docPromises = documents.map((file) => createDocument(results.newId, file.name));
    // Save websites to WebAddress table
    const webPromises = websites.map((url) => createWebAddress(results.newId, url));

    await Promise.all([...docPromises, ...webPromises]);

    if (results.newId) {
      return NextResponse.json({ success: true, id: results.newId });
    } else {
      return NextResponse.json({
        success: false,
        message: "Could not update agent",
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
