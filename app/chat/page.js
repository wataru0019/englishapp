'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage, startChatSession } from '@/lib/api';
import WordPanel from '../components/WordPanel';
import { useWordContext } from '../context/WordContext';
import styles from './chat.module.css';
import SpeechButton, { useSpeechSynthesis } from '../components/SpeechSynthesis';
import SelectableText from '../components/SelectableText';

// チャットページ用のスタイルを適用するためのスタイル要素
const chatPageStyle = {
  marginTop: 0,
  marginBottom: 0,
  padding: 0,
  maxWidth: '100%',
  width: '100%'
};

export default function ChatPage() {
  // 音声合成関連の機能をインポート
  const { speak, cancel, speaking, supported: speechSupported, englishVoices } = useSpeechSynthesis();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(true); // 自動読み上げ設定
  const messagesEndRef = useRef(null);
  const { setSelectedText } = useWordContext();
  
  // テキストを選択したときの処理 - デスクトップとモバイル両方に対応
  const handleTextSelection = useCallback(() => {
    // 少し遅延させて選択が完了するのを待つ
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== '') {
        setSelectedText(selection.toString().trim());
      }
    }, 100);
  }, [setSelectedText]);
  
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
      
      // AIからの応答を自動的に読み上げる（オプションとして設定可能）
      if (speechSupported && autoSpeak) {
        // 音声設定オプション
        const speechOptions = {
          rate: 1, // 速度 (通常の速さ)
          pitch: 1, // ピッチ (通常のピッチ)
          volume: 1, // 音量 (最大)
          lang: 'en-US', // 英語音声
          preferredVoice: 'en-US' // 英語（米国）音声を優先
        };
        
        // 英語音声が利用可能なら、最初の英語音声を使用
        if (englishVoices.length > 0) {
          speechOptions.voiceName = englishVoices[0].name;
        }
        
        // 音声読み上げ実行
        speak(data.message, speechOptions);
      }
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
    <div className={styles.pageContainer} style={chatPageStyle}>
      <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1>English Learning Assistant</h1>
        <div className={styles.settings}>
          <label className={styles.autoSpeakToggle}>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            <span className={styles.toggleText}>Auto-speak AI messages</span>
          </label>
        </div>
      </div>
      
      <div className={styles.messageList}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p>Start a conversation to practice your English skills</p>
            <div className={styles.suggestedPrompts}>
              <button onClick={() => setInput("Introduce yourself")}>Introduce yourself</button>
              <button onClick={() => setInput("Let's practice daily conversation")}>Daily conversation</button>
              <button onClick={() => setInput("Can you correct my grammar?")}>Grammar help</button>
              <button onClick={() => setInput("Let's discuss a topic")}>Discuss a topic</button>
              <button onClick={() => setInput("Help me prepare for an interview")}>Interview prep</button>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${styles.messageWrapper} ${message.isUser ? styles.userMessage : styles.aiMessage}`}
          >
            <SelectableText 
              className={styles.messageContent} 
              onTextSelect={setSelectedText}
              >
            {!message.isUser && (
              <div className={styles.messageControls}>
                <SpeechButton 
                  text={message.content} 
                  iconOnly={true} 
                  className={styles.speechButton}
                  options={{
                    rate: 1,
                    lang: 'en-US',
                    preferredVoice: 'en-US'
                  }}
                />
              </div>
            )}
              <p>{message.content}</p>
            </SelectableText>
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
      <WordPanel />
    </div>
  );
}
