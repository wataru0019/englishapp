'use client';

import { WordProvider } from '../context/WordContext';

export default function ChatLayout({ children }) {
  return (
    <WordProvider>
      <div style={{
        margin: 0,
        padding: 0,
        width: '100%',
        maxWidth: '100%'
      }}>
        {children}
      </div>
    </WordProvider>
  );
}
