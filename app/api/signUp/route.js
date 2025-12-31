import { NextResponse } from 'next/server';
import { signUp } from '@/lib/services/userservice';

export async function POST(request) {
  const { username, email, password } = await request.json();
  console.log("Sign Up info:", { username, email, password });

  try {
    const result = await signUp(username, email, password);

    if (result?.id) {
      return NextResponse.json({ success: true, userId: result.id });
    }

    return NextResponse.json({
      success: false,
      message: 'Signup failed'
    });

  } catch (error) {
    console.error("DB Error:", error);

    return NextResponse.json({
      success: false,
      message: error.message === 'Email already exists'
        ? 'Email already exists'
        : 'Something went wrong'
    });
  }
}
