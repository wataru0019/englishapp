'use client';

import { useEffect, useRef, forwardRef } from 'react';

// テキスト選択をデスクトップとモバイル両方でサポートするコンポーネント
const SelectableText = forwardRef(({ 
  children, 
  onTextSelect, 
  className, 
  ...props 
}, ref) => {
  const containerRef = useRef(null);
  const mergedRef = (node) => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  // テキスト選択検出用ユーティリティ関数
  const checkSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // 選択範囲が存在し、このコンポーネント内で発生した選択であることを確認
    if (selectedText && containerRef.current) {
      const range = selection.getRangeAt(0);
      const container = containerRef.current;
      
      // 選択範囲がこのコンポーネント内に収まっているか確認
      if (container.contains(range.commonAncestorContainer)) {
        if (onTextSelect) {
          onTextSelect(selectedText);
        }
      }
    }
  };

  // タッチデバイス用のイベントハンドラ
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // セレクションチェンジイベントを使用（モバイルブラウザでより安定して動作）
    const handleSelectionChange = () => {
      // 選択が完了するまで少し遅延
      setTimeout(checkSelection, 50);
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [onTextSelect]);

  return (
    <div
      ref={mergedRef}
      className={className}
      onMouseUp={checkSelection}
      onTouchEnd={checkSelection}
      {...props}
    >
      {children}
    </div>
  );
});

SelectableText.displayName = 'SelectableText';

export default SelectableText;
