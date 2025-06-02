import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    // Simple echo bot for now - replace with your actual AI logic
    const reply = `You said: ${message}`;
    
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}