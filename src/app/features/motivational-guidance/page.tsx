import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MotivationalGuidancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Motivational Guidance</h1>
        <p className="text-lg text-gray-600 mb-8">This feature is coming soon!</p>
        <Link href="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold transition-all hover:bg-indigo-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
} 