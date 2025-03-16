'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, startChatSession } from '@/lib/api';
import styles from './chat.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await startChatSession('intermediate', 'conversation');
        setSessionId(session.session_id);
      } catch (error) {
        console.error('Failed to initialize chat session:', error);
        // Continue without session ID if it fails
      }
    };
    
    initSession();
  }, []);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Use the API library to send chat message
      const data = await sendChatMessage(input, sessionId);
      
      // Add AI response to chat
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1>English Learning Assistant</h1>
        <p>Practice your English conversation skills with AI</p>
      </div>
      
      <div className={styles.messageList}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p>Start a conversation to practice your English skills</p>
            <div className={styles.suggestedPrompts}>
              <button onClick={() => setInput("Introduce yourself")}>
                Introduce yourself
              </button>
              <button onClick={() => setInput("Let's practice daily conversation")}>
                Daily conversation
              </button>
              <button onClick={() => setInput("Can you correct my grammar?")}>
                Grammar help
              </button>
              <button onClick={() => setInput("Let's discuss a topic")}>
                Discuss a topic
              </button>
              <button onClick={() => setInput("Help me prepare for an interview")}>
                Interview prep
              </button>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${styles.messageWrapper} ${message.isUser ? styles.userMessage : styles.aiMessage}`}
          >
            <div className={styles.messageContent}>
              <p>{message.content}</p>
            </div>
            <div className={styles.messageTimestamp}>
              {message.timestamp}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className={`${styles.messageWrapper} ${styles.aiMessage}`}>
            <div className={`${styles.messageContent} ${styles.typingIndicator}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className={styles.inputField}
          disabled={isProcessing}
        />
        <button 
          onClick={handleSendMessage} 
          className={styles.sendButton}
          disabled={isProcessing || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
