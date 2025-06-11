'use client';

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

export default function SplineScene({ sceneUrl }: { sceneUrl: string }) {
  return (
    <div className="w-full h-[500px] flex items-center justify-center relative">
      <Suspense fallback={<div className="text-gray-400">Loading 3D Scene...</div>}>
        <Spline scene={sceneUrl} />
      </Suspense>
    </div>
  );
} 