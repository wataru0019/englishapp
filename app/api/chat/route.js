// Next.js API route handler for chat API
import { NextResponse } from 'next/server';

// This would be replaced with an actual AI API call in production
export async function POST(request) {
  try {
    const { message } = await request.json();
    
    // For demo purposes, simple AI responses based on keywords
    // In a real application, you would call an external AI API here
    
    let aiResponse;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('introduce yourself')) {
      aiResponse = "Hello! I'm your English learning assistant. I'm here to help you practice your English conversation skills, correct your grammar, and provide feedback on your language usage. What would you like to practice today?";
    }
    else if (lowerMessage.includes('grammar')) {
      aiResponse = "I'd be happy to help with your grammar! Try writing a few sentences, and I'll provide corrections and explanations for any errors I find.";
    }
    else if (lowerMessage.includes('interview')) {
      aiResponse = "Preparing for an interview is a great way to practice English! What kind of position are you interviewing for? I can help you with common interview questions and phrases specific to your industry.";
    }
    else if (lowerMessage.includes('topic') || lowerMessage.includes('discuss')) {
      aiResponse = "I'd love to discuss a topic with you! Here are some suggestions: current events, technology, travel, culture, food, sports, movies, or books. What topic interests you the most?";
    }
    else if (lowerMessage.includes('daily') || lowerMessage.includes('conversation')) {
      aiResponse = "Let's practice some daily conversation! Imagine we're meeting at a coffee shop. How would you greet me and start a conversation?";
    }
    else {
      // Default response with follow-up question to keep conversation going
      aiResponse = `Thank you for your message! I understand you said: "${message}". How can I help you improve your English skills today? We could practice conversation, work on grammar, or discuss any topic you're interested in.`;
    }
    
    // Simulate AI thinking time for a more natural interaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      message: aiResponse 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
