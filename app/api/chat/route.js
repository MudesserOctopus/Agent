import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAgentById } from '../../../lib/services/userservice';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { agentId, messages } = await request.json();

    if (!agentId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: 'Agent ID and messages array are required' },
        { status: 400 }
      );
    }

    // Get agent data from database
    const agent = await getAgentById(agentId);
    
    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent not found' },
        { status: 404 }
      );
    }

    // Build system prompt from agent instructions
    let systemPrompt = agent.instructions || 'You are a helpful AI assistant.';
    
    // Add quick knowledge to system prompt if available
    if (agent.quickKnowledge && agent.quickKnowledge.length > 0) {
      const knowledgeText = agent.quickKnowledge
        .map((item) => `**${item.title}**: ${item.content}`)
        .join('\n\n');
      systemPrompt += `\n\nAdditional Knowledge:\n${knowledgeText}`;
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Calculate temperature from creativity level (0-100 -> 0-2)
    const temperature = (agent.creativity_level || 50) / 50;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: agent.model_names === 'GPT 5.1' ? 'gpt-4' : 'gpt-4', // Map model names to actual OpenAI models
      messages: openaiMessages,
      temperature: Math.min(temperature, 2), // Cap at 2
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get response from AI',
      },
      { status: 500 }
    );
  }
}


