import sql, { pool } from '../db';

export const authenticateUser = async (email:string , password:string) => {
  try {
    const result = await (await pool)
      .request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM Users WHERE email = @email AND password = @password');

    return result.recordset;
  } catch (error) {
    console.error("DB Error in authenticateUser:", error);
    throw error;
  }
};


export const createAgent = async (name:string, model_names:string, creativity_level:number, greeting_message:string, instructions:string, workspace_id:number) => {
  try {
    const connection = await pool;

    // 1. Get the current maximum ID
    const maxIdResult = await connection
      .request()
      .query('SELECT MAX(ID) AS maxId FROM Agents');

    const maxId = maxIdResult.recordset[0].maxId || 0; // if table empty, start from 0
    const newId = maxId + 1;
    
    // 2. Insert new record with manual ID
    const insertResult = await connection
      .request()
      .input('ID', sql.Int, newId)
      .input('name', sql.NVarChar, name)
      .input('model_names', sql.NVarChar, model_names)
      .input('creativity_level', sql.Int, creativity_level)
      .input('created_on', sql.DateTime, new Date())
      .input('greeting_message', sql.NVarChar, greeting_message)
      .input('instructions', sql.NVarChar, instructions)
      .input('workspace_id', sql.Int, workspace_id)
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

export const createQuickKnowledge = async (agent_id:number, quickItems: { title: string; content: string }[]) => {
  try {
    const connection = await pool;
    const maxIdResult = await connection
      .request()
      .query('SELECT MAX(ID) AS maxId FROM QuickKnowledge');

      let newId = maxIdResult.recordset[0].maxId || 0; // if table empty, start from 0
    
    
    
    for (const item of quickItems) {
      newId++;
      const insertResult = await connection
      .request()
      .input('ID', sql.Int, newId)
      .input('agentID', sql.Int, agent_id)
      .input('title', sql.NVarChar, item.title)
      .input('content', sql.NVarChar, item.content)
      .query('INSERT INTO QuickKnowledge (ID, agentID, title, content) VALUES (@ID,   @agentID, @title, @content)');
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
      .input('agentId', sql.Int, agentId)
      .query('SELECT * FROM Agents WHERE ID = @agentId');

    if (result.recordset.length === 0) {
      return null;
    }

    const quickKnowledgeResult = await connection
      .request()
      .input('agentId', sql.Int, agentId)
      .query('SELECT * FROM QuickKnowledge WHERE agentID = @agentId');

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
    let query = 'SELECT * FROM Agents';
    let request = connection.request();

    if (workspaceId) {
      query += ' WHERE workspace_id = @workspaceId';
      request = request.input('workspaceId', sql.Int, workspaceId);
    }

    query += ' ORDER BY created_on DESC';

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
    const checkEmail = await checkEmailRequest
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT COUNT(*) AS count
        FROM Users WITH (UPDLOCK, HOLDLOCK)
        WHERE email = @email
      `);

    if (checkEmail.recordset[0].count > 0) {
      throw new Error('Email already exists');
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
      .input('ID', sql.Int, newId)
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query(`
        INSERT INTO Users (ID, username, email, password)
        VALUES (@ID, @username, @email, @password)
      `);

    // 4️⃣ Insert Workspace (linked to user)
    const insertWorkspaceRequest = new sql.Request(transaction);
    await insertWorkspaceRequest
      .input('ID', sql.Int, newId)

      .input('created_at', sql.DateTime, now)
      .query(`
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

