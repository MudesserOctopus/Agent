import { NextResponse } from 'next/server';
import { authenticateUser } from '../../../lib/services/userservice';

export async function POST(request) {
  const { email, password } = await request.json();
  console.log("Login attempt:", { email, password });

  try {
    const result = await authenticateUser(email, password);

    if (result.length > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: 'Database error' });
  }
}
