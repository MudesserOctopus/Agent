import sql, { pool } from '../db';

export const authenticateUser = async (email, password) => {
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


export const createAgent = async (name, model_names, creativity_level, greeting_message, instructions) => {
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
      .query(
        `INSERT INTO Agents (ID, Name, model_names, creativity_level, created_on, greeting_message, instructions)
         VALUES (@ID, @name, @model_names, @creativity_level, @created_on, @greeting_message, @instructions)`
      );

      return { newId }; // usually empty for INSERT, but you can return newId if needed
  } catch (error) {
    console.error("DB Error in createAgent:", error);
    throw error;
  }
};