import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy First</h1>
        <p className="text-lg text-gray-600 mb-8">
          This page will be dedicated to explaining our commitment to your privacy.
          Your conversations with Cayla are anonymous and are not stored.
          We will provide full transparency on how we operate.
        </p>
        <Link href="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold transition-all hover:bg-indigo-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
} 