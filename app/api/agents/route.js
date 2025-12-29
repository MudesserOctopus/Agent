import { NextResponse } from 'next/server';
import { createAgent, createQuickKnowledge } from '../../../lib/services/userservice';


export async function POST(request) {
  const { name, model, creativity_level, greeting_message, instructions, quickItems, websites} = await request.json();

  ;
  
  try {
    const result = await createAgent(name, model, creativity_level, greeting_message, instructions);
    const quickKnowledgeResult = await createQuickKnowledge(result.newId, quickItems, websites);

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
