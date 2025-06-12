'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, HeartHandshake, Zap, TrafficCone, MessageSquareQuote } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';

interface FeatureCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'indigo' | 'purple' | 'green' | 'sky';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ href, icon: Icon, title, description, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    sky: 'bg-sky-100 text-sky-600',
  };

  return (
    <Link href={href}>
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mt-6 text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-500 flex-grow">{description}</p>
        <div className="mt-6 font-semibold text-indigo-600 flex items-center group">
          Learn more <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default function Homepage() {
  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section
        className="relative pt-40 pb-32 px-6 text-center text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Image
              src="/assets/images/avataaars.png"
              alt="Cayla Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Confused? Overwhelmed?
          </h1>
          <div className="mt-4 text-3xl md:text-4xl text-indigo-200">
            Xin AI helps you <TypewriterText />
          </div>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
            Xin AI (心爱) helps you understand your feelings, navigate tricky social situations, and build your confidence.
            It&apos;s a safe space to get perspective, completely private.
          </p>
          <div className="mt-12 flex justify-center items-center gap-4">
            <Link href="/chat">
              <div className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-indigo-50 transition-transform transform hover:scale-105 duration-300 flex items-center">
                Start Chatting with Cayla <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>
            <Link href="/privacy">
              <div className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-300 flex items-center">
                <Lock className="w-5 h-5 mr-2" /> How Privacy Works
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800">Your Personal Guide to Emotional Clarity</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">Xin AI isn&apos;t just a chatbot. It&apos;s a suite of tools designed to empower you.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard
              href="/features/relationship-advice"
              icon={HeartHandshake}
              title="Relationship Advice"
              description="Navigate conflicts with friends, family, or partners. Get suggestions on what to say and how to approach difficult conversations."
              color="purple"
            />
            <FeatureCard
              href="/features/traffic-light"
              icon={TrafficCone}
              title="The 'Traffic Light' System"
              description="Is this a red, yellow, or green flag situation? Cayla helps you categorize the severity of a problem and react appropriately."
              color="green"
            />
            <FeatureCard
              href="/features/tone-analyzer"
              icon={Zap}
              title="Tone Analyzer"
              description="Paste in a text or email and get an analysis of the underlying tone. Is it angry, sarcastic, or just neutral?"
              color="sky"
            />
          </div>
        </div>
      </section>
    </div>
  );
} 