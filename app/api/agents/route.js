import { NextResponse } from 'next/server';
import { createAgent } from '../../../lib/services/userservice';


export async function POST(request) {
  const { name, model, creativity_level, greeting_message, instructions } = await request.json();
 
  
  try {
    const result = await createAgent(name, model, creativity_level, greeting_message, instructions);
   

    if (result.newId) {
        return NextResponse.json({ success: true, id: result.newId });
      } else {
        return NextResponse.json({ success: false, message: 'Could not create agent' });
      }
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: 'Database error' });
  }
}
