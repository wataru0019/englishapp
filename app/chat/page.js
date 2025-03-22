'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter, useParams } from 'next/navigation';
import { sendChatMessage, startChatSession } from '@/lib/api';
import WordPanel from '../components/WordPanel';
import { useWordContext } from '../context/WordContext';
import styles from './chat.module.css';
import SpeechButton, { useSpeechSynthesis } from '../components/SpeechSynthesis';
import SelectableText from '../components/SelectableText';

// モックデータ（バックエンド実装時に置き換え）
const MOCK_THREADS = {
  1: {
    id: 1,
    title: 'Daily conversation practice',
    messages: [
      {
        id: '1-1',
        content: 'Hello! How can I help you practice English today?',
        isUser: false,
        timestamp: '09:30'
      },
      {
        id: '1-2',
        content: 'Hi! I want to practice daily conversation.',
        isUser: true,
        timestamp: '09:31'
      },
      {
        id: '1-3',
        content: 'Great! Let\'s start. How was your weekend?',
        isUser: false,
        timestamp: '09:31'
      }
    ]
  },
  2: {
    id: 2,
    title: 'English grammar Q&A',
    messages: [
      {
        id: '2-1',
        content: 'Welcome to the grammar help session. What grammar point would you like to understand better?',
        isUser: false,
        timestamp: '14:40'
      },
      {
        id: '2-2',
        content: 'I\'m confused about when to use "since" and "for" in present perfect tense.',
        isUser: true,
        timestamp: '14:42'
      },
      {
        id: '2-3',
        content: 'That\'s a common question! We use "since" with a specific point in time when something began (since 2010, since Monday). We use "for" with a duration or period of time (for 5 years, for a long time).',
        isUser: false,
        timestamp: '14:45'
      }
    ]
  }
};

// チャットページ用のスタイルを適用するためのスタイル要素
const chatPageStyle = {
  marginTop: 0,
  marginBottom: 0,
  padding: 0,
  maxWidth: '100%',
  width: '100%'
};

export default function ChatPage() {
  // ルーターとパラメータの取得
  const router = useRouter();
  const params = useParams();
  const threadId = params?.threadId;
  
  // 音声合成関連の機能をインポート
  const { speak, cancel, speaking, supported: speechSupported, englishVoices } = useSpeechSynthesis();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(true); // 自動読み上げ設定
  const [currentThread, setCurrentThread] = useState(null);
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
  
  // スレッドデータの初期化
  useEffect(() => {
    // スレッドIDがある場合、そのスレッドを表示
    if (threadId && MOCK_THREADS[threadId]) {
      setCurrentThread(MOCK_THREADS[threadId]);
      setMessages(MOCK_THREADS[threadId].messages);
    } else if (!threadId && !currentThread) {
      // スレッドIDがなく、現在のスレッドもない場合、新しいセッションを開始
      initNewSession();
    }
  }, [threadId]);
  
  // 新しいセッションを初期化
  const initNewSession = async () => {
    try {
      const session = await startChatSession('intermediate', 'conversation');
      setSessionId(session.session_id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      // セッションIDの取得に失敗した場合でも続行
    }
  };
  
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          <h1>{currentThread ? currentThread.title : 'New Conversation'}</h1>
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
                {message.isUser ? (
                  <p>{message.content}</p>
                ) : (
                  <div className={styles.markdownContent}>
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
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
