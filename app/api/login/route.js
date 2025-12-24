import { NextResponse } from 'next/server';
import sql, { pool } from '../../../lib/db'; // adjust path

export async function POST(request) {
  const { email, password } = await request.json();
  console.log("Login attempt:", { email, password });

  try {
    const result = await (await pool)
      .request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM Users WHERE email = @email AND password = @password');

    if (result.recordset.length > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: 'Database error' });
  }
}
