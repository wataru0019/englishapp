'use client';

import { useState, useEffect, useCallback } from 'react';

// 音声合成を管理するカスタムフック
export function useSpeechSynthesis() {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  // 音声が利用可能かチェック
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setSupported(false);
      console.error('このブラウザは音声合成をサポートしていません。');
      return;
    }

    // 音声リストの取得
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // 音声リストを初期読み込み
    loadVoices();

    // Chromeでは音声リスト読み込みに時間がかかるため、イベントリスナーを設定
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // クリーンアップ関数
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // テキストを音声で読み上げる関数
  const speak = useCallback((text, options = {}) => {
    if (!supported || !text) return;

    // 一旦キャンセル
    window.speechSynthesis.cancel();
    
    // 新しい発話インスタンスを作成
    const utterance = new SpeechSynthesisUtterance(text);
    
    // オプション設定
    utterance.rate = options.rate || 1; // 速度 (0.1-10)
    utterance.pitch = options.pitch || 1; // ピッチ (0-2)
    utterance.volume = options.volume || 1; // 音量 (0-1)
    
    // 言語設定（オプション）
    utterance.lang = options.lang || 'en-US';
    
    // 音声選択（オプション）
    if (options.voiceName && voices.length > 0) {
      const voice = voices.find(v => 
        v.name === options.voiceName || 
        (options.preferredVoice && v.name.includes(options.preferredVoice))
      );
      if (voice) utterance.voice = voice;
    }
    
    // イベントハンドラー
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setCurrentUtterance(null);
    };
    utterance.onerror = (event) => {
      console.error('音声合成エラー:', event);
      setSpeaking(false);
      setCurrentUtterance(null);
    };
    
    // 現在の発話を保存
    setCurrentUtterance(utterance);
    
    // 音声合成の開始
    window.speechSynthesis.speak(utterance);
  }, [supported, voices]);

  // 音声を停止する関数
  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentUtterance(null);
  }, [supported]);

  // 音声を一時停止する関数
  const pause = useCallback(() => {
    if (!supported || !speaking) return;
    window.speechSynthesis.pause();
  }, [supported, speaking]);

  // 音声を再開する関数
  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
  }, [supported]);

  // 英語の音声を取得（利用可能な場合）
  const getEnglishVoices = useCallback(() => {
    return voices.filter(voice => 
      voice.lang.includes('en-') || voice.lang === 'en'
    );
  }, [voices]);

  return {
    supported,
    speaking,
    voices,
    englishVoices: getEnglishVoices(),
    speak,
    cancel,
    pause,
    resume,
    currentUtterance
  };
}

// 音声合成ボタンコンポーネント
const SpeechButton = ({ text, options = {}, className = '', iconOnly = false }) => {
  const { speak, cancel, speaking, supported } = useSpeechSynthesis();
  
  if (!supported) return null;
  
  const handleClick = () => {
    if (speaking) {
      cancel();
    } else {
      speak(text, options);
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className={className}
      title={speaking ? '音声を停止' : '音声で読み上げる'}
      disabled={!text}
    >
      {iconOnly ? (
        <span aria-label={speaking ? '音声を停止' : '音声で読み上げる'}>
          {speaking ? '◼' : '▶'}
        </span>
      ) : (
        <span>{speaking ? '停止' : '読み上げる'}</span>
      )}
    </button>
  );
};

export default SpeechButton;
