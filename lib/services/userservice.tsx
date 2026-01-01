import sql, { pool } from "../db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
});

export const authenticateUser = async (email: string, password: string) => {
  try {
    const result = await (await pool)
      .request()
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .query(
        "SELECT * FROM Users WHERE email = @email AND password = @password"
      );

    return result.recordset;
  } catch (error) {
    console.error("DB Error in authenticateUser:", error);
    throw error;
  }
};

export const createAgent = async (
  name: string,
  model_names: string,
  creativity_level: number,
  greeting_message: string,
  instructions: string,
  workspace_id: number
) => {
  try {
    const connection = await pool;

    // 1. Get the current maximum ID
    const maxIdResult = await connection
      .request()
      .query("SELECT MAX(ID) AS maxId FROM Agents");

    const maxId = maxIdResult.recordset[0].maxId || 0; // if table empty, start from 0
    const newId = maxId + 1;

    // 2. Insert new record with manual ID
    const insertResult = await connection
      .request()
      .input("ID", sql.Int, newId)
      .input("name", sql.NVarChar, name)
      .input("model_names", sql.NVarChar, model_names)
      .input("creativity_level", sql.Int, creativity_level)
      .input("created_on", sql.DateTime, new Date())
      .input("greeting_message", sql.NVarChar, greeting_message)
      .input("instructions", sql.NVarChar, instructions)
      .input("workspace_id", sql.Int, workspace_id)
      .query(
        `INSERT INTO Agents (ID, Name, model_names, creativity_level, created_on, greeting_message, instructions, workspace_id)
         VALUES (@ID, @name, @model_names, @creativity_level, @created_on, @greeting_message, @instructions, @workspace_id)`
      );

    return { newId }; // usually empty for INSERT, but you can return newId if needed
  } catch (error) {
    console.error("DB Error in createAgent:", error);
    throw error;
  }
};

export const createQuickKnowledge = async (
  agent_id: number,
  quickItems: { title: string; content: string }[]
) => {
  try {
    const connection = await pool;
    const maxIdResult = await connection
      .request()
      .query("SELECT MAX(ID) AS maxId FROM QuickKnowledge");

    let newId = maxIdResult.recordset[0].maxId || 0; // if table empty, start from 0

    for (const item of quickItems) {
      newId++;
      const insertResult = await connection
        .request()
        .input("ID", sql.Int, newId)
        .input("agentID", sql.Int, agent_id)
        .input("title", sql.NVarChar, item.title)
        .input("content", sql.NVarChar, item.content)
        .query(
          "INSERT INTO QuickKnowledge (ID, agentID, title, content) VALUES (@ID,   @agentID, @title, @content)"
        );
    }
    return { success: true };
  } catch (error) {
    console.error("DB Error in createQuickKnowledge:", error);
    throw error;
  }
};

export const getAgentById = async (agentId: number) => {
  try {
    
    const connection = await pool;
    const result = await connection
      .request()
      .input("agentId", sql.Int, agentId)
      .query("SELECT * FROM Agents WHERE ID = @agentId");

    if (result.recordset.length === 0) {
      return null;
    }
    

    const quickKnowledgeResult = await connection
      .request()
      .input("agentId", sql.Int, agentId)
      .query("SELECT * FROM QuickKnowledge WHERE agentID = @agentId");

    const agent = result.recordset[0];
    agent.quickKnowledge = quickKnowledgeResult.recordset;

    return agent;
  } catch (error) {
    console.error("DB Error in getAgentById:", error);
    throw error;
  }
};

export const getAgents = async (workspaceId?: number | null) => {
  try {
    const connection = await pool;
    let query = "SELECT * FROM Agents";
    let request = connection.request();

    if (workspaceId) {
      query += " WHERE workspace_id = @workspaceId";
      request = request.input("workspaceId", sql.Int, workspaceId);
    }

    query += " ORDER BY created_on DESC";

    const result = await request.query(query);
    return result.recordset || [];
  } catch (error) {
    console.error("DB Error in getAgents:", error);
    throw error;
  }
};

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const poolConn = await pool;
  const transaction = new sql.Transaction(poolConn);

  try {
    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

    // 1️⃣ Check if email exists
    const checkEmailRequest = new sql.Request(transaction);
    const checkEmail = await checkEmailRequest.input(
      "email",
      sql.NVarChar,
      email
    ).query(`
        SELECT COUNT(*) AS count
        FROM Users WITH (UPDLOCK, HOLDLOCK)
        WHERE email = @email
      `);

    if (checkEmail.recordset[0].count > 0) {
      throw new Error("Email already exists");
    }

    // 2️⃣ Get MAX(User.ID)
    const maxIdRequest = new sql.Request(transaction);
    const maxIdResult = await maxIdRequest.query(`
      SELECT ISNULL(MAX(ID), 0) AS maxId
      FROM Users WITH (UPDLOCK, HOLDLOCK)
    `);

    const newId = maxIdResult.recordset[0].maxId + 1;
    const now = new Date();

    // 3️⃣ Insert User
    const insertUserRequest = new sql.Request(transaction);
    await insertUserRequest
      .input("ID", sql.Int, newId)
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password).query(`
        INSERT INTO Users (ID, username, email, password)
        VALUES (@ID, @username, @email, @password)
      `);

    // 4️⃣ Insert Workspace (linked to user)
    const insertWorkspaceRequest = new sql.Request(transaction);
    await insertWorkspaceRequest
      .input("ID", sql.Int, newId)

      .input("created_at", sql.DateTime, now).query(`
        INSERT INTO Workspaces (ID, user_id, password, email, created_at, updated_at)
        VALUES (@ID, NULL, NULL, NULL, @created_at, NULL)
      `);

    await transaction.commit();
    return { id: newId };
  } catch (error) {
    await transaction.rollback();
    console.error("DB Error in signUp:", error);
    throw error;
  }
};

export const createVectorStoreAndUploadFiles = async (
  agentId: number,
  files: File[],
  instructions: string
) => {
  try {
    // 1️⃣ Create a vector store
    const vectorStore = await openai.vectorStores.create({
      name: `Agent-${agentId}-Documents`,
    });

    console.log('Vector store created:', vectorStore.id);

    // 2️⃣ Upload files to the vector store using file batches
    const fileStreams = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new File([buffer], file.name, { type: file.type });
      })
    );

    console.log('Uploading files to vector store...');
    const fileBatch = await openai.vectorStores.fileBatches.uploadAndPoll(
      vectorStore.id,
      {
        files: fileStreams,
      }
    );

    console.log('Files uploaded successfully');

    // 3️⃣ Create an assistant with the vector store
    const assistant = await openai.beta.assistants.create({
      name: `Agent-${agentId}`,
      instructions: instructions,
      model: 'gpt-4o',
      tools: [{ type: 'file_search' }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    console.log('Assistant created:', assistant.id);

    return {
      vectorStoreId: vectorStore.id,
      assistantId: assistant.id,
    };
  } catch (error) {
    console.error('Error creating vector store and assistant:', error);
    throw error;
  }
};

export const updateAgentVectorStore = async (
  agentId: number,
  vectorStoreId: string,
  assistantId: string
) => {
  try {
    const connection = await pool;
    await connection
      .request()
      .input("agentId", sql.Int, agentId)
      .input("vectorStoreId", sql.NVarChar, vectorStoreId)
      .input("assistantId", sql.NVarChar, assistantId)
      .query(
        "UPDATE Agents SET vector_store_id = @vectorStoreId, assistant_id = @assistantId WHERE ID = @agentId"
      );
  } catch (error) {
    console.error("DB Error in updateAgentVectorStore:", error);
    throw error;
  }
};

export const getRecordVectorID = async (agent_id: number) => {
  try {
    console.log("##############")
    const connection = await pool;

    const query = `
      SELECT vector_store_ID
      FROM Agents
      WHERE agent_id = @agent_id
    `;

    const request = connection
      .request()
      .input("agent_id", sql.Int, agent_id);

    const result = await request.query(query);

    // If no record found
    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    // Return only the vector store ID
    return result.recordset[0].vector_store_ID;

  } catch (error) {
    console.error("DB Error in getRecordVectorID:", error);
    throw error;
  }
};

