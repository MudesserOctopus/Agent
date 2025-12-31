import { NextResponse } from 'next/server';
import { createAgent, createQuickKnowledge, getAgents,getAgentById } from '../../../lib/services/userservice';


export async function POST(request) {
  const { name, model, creativity_level, greeting_message, instructions, quickItems, websites, workspace_id} = await request.json();

  ;
  
  try {
    const result = await createAgent(name, model, creativity_level, greeting_message, instructions, workspace_id);
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('id');
  const workspaceId = searchParams.get('workspace_id');

  try {
    if (agentId) {
      const agent = await getAgentById(parseInt(agentId));
      
      if (!agent) {
        return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, agent });
    }

    const agents = await getAgents(workspaceId ? parseInt(workspaceId) : null);
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
