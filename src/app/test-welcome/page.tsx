'use client'
import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomScreen';

export default function TestWelcome() {
  const [done, setDone] = useState(false);

  return (
    <div>
      {!done && <WelcomeScreen onFinish={() => { setDone(true); alert('WelcomeScreen finished!'); }} />}
      {done && <div className="text-center mt-20 text-2xl">WelcomeScreen finished!</div>}
    </div>
  );
}