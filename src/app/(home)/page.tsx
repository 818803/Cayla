'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock, HeartHandshake, Zap, TrafficCone, Scale } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';

const features = [
  {
    href: "/features/relationship-advice",
    icon: HeartHandshake,
    title: "Relationship Advice",
    description: "Navigate conflicts with friends, family, or partners. Get suggestions on what to say and how to approach difficult conversations.",
    color: "purple",
  },
  {
    href: "/features/traffic-light",
    icon: TrafficCone,
    title: "The 'Traffic Light' System",
    description: "Is this a red, yellow, or green flag situation? Cayla helps you categorize the severity of a problem and react appropriately.",
    color: "green",
  },
  {
    href: "/features/tone-analyzer",
    icon: Zap,
    title: "Response",
    description: "Paste in a text or email and get an analysis of the underlying tone. Is it angry, sarcastic, or just neutral?",
    color: "sky",
  },
  {
    href: "/mediator",
    icon: Scale,
    title: "AI Mediator",
    description: "Resolve disagreements impartially. The AI Mediator facilitates a balanced conversation, helping both sides find common ground.",
    color: "pink",
  },
];

const colorClasses = {
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    glow: 'shadow-purple-500/30'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    glow: 'shadow-green-500/30'
  },
  sky: {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    glow: 'shadow-sky-500/30'
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    glow: 'shadow-pink-500/30'
  },
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

      {/* Introduction/Tutorial Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">A New Way to Understand Yourself</h2>
            <p className="mt-6 text-lg text-gray-600">
              Navigating emotions and relationships can be tough. Xin AI provides a private, judgment-free space to explore your thoughts and gain clarity. Watch this short video to see how you can get the most out of our tools.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/chat">
                <div className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 duration-300 flex items-center">
                  Get Started for Free
                </div>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl bg-gray-200 flex items-center justify-center shadow-2xl overflow-hidden">
              {/* Video Placeholder */}
              <div className="text-center">
                <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="mt-2 text-gray-500 font-semibold">Intro Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800">Your Personal Guide to Emotional Clarity</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">Xin AI isn&apos;t just a chatbot. It&apos;s a suite of tools designed to empower you.</p>
          </div>
          <div className="space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = colorClasses[feature.color as keyof typeof colorClasses];
              return (
                <div key={feature.title} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <div className={`order-1 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                     <div className={`relative aspect-square rounded-3xl ${colors.bg} flex items-center justify-center shadow-2xl ${colors.glow}`}>
                        <Icon className={`w-1/3 h-1/3 ${colors.text} opacity-80`} />
                     </div>
                  </div>
                  <div className={`order-2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colors.bg}`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-3xl font-bold mt-6 text-gray-800">{feature.title}</h3>
                    <p className="mt-4 text-lg text-gray-600">{feature.description}</p>
                    <Link href={feature.href}>
                      <div className="mt-8 font-semibold text-indigo-600 flex items-center group">
                        Learn more <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <Image
                src="/assets/images/creator_placeholder.png" // Replace with your image
                alt="Creator Avatar"
                width={120}
                height={120}
                className="rounded-full mx-auto mb-6 ring-4 ring-indigo-100"
            />
            <h2 className="text-4xl font-bold text-gray-800">From the Creator</h2>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              I created Xin AI from a personal need for a safe space to untangle my thoughts and understand my emotions without judgment. My mission is to provide an accessible, intelligent tool that empowers you to build self-awareness and navigate life's complexities with more confidence. This is just the beginning, and I'm excited to have you on this journey.
            </p>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800">Get Started Today</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">Join our community and start your journey towards emotional clarity.</p>
          </div>
          <div className="flex justify-center">
              <div className="bg-white p-10 rounded-2xl shadow-2xl border-2 border-indigo-200 max-w-md w-full text-center">
                  <h3 className="text-2xl font-bold text-gray-800">Free Access</h3>
                  <p className="mt-4 text-5xl font-extrabold text-gray-900">
                    $0<span className="text-xl font-medium text-gray-500">/unlimited</span>
                  </p>
                  <p className="mt-4 text-gray-600">
                    While in beta, Xin AI is completely free to use. All features are unlocked. Your feedback is our most valuable asset.
                  </p>
                  <Link href="/chat">
                    <div className="mt-8 block w-full px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 duration-300">
                      Start Your Journey
                    </div>
                  </Link>
              </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left">
                  <p className="font-bold text-xl">Xin AI (心爱)</p>
                  <p className="text-gray-400 mt-2">Your guide to emotional clarity.</p>
              </div>
              <div className="flex gap-6 mt-8 md:mt-0">
                  <Link href="/features/relationship-advice"><div className="text-gray-300 hover:text-white transition-colors">Features</div></Link>
                  <Link href="/privacy"><div className="text-gray-300 hover:text-white transition-colors">Privacy</div></Link>
                  <Link href="/chat"><div className="text-gray-300 hover:text-white transition-colors">Chat</div></Link>
              </div>
          </div>
          <div className="bg-gray-900 py-4 px-6">
              <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} Xin AI. All Rights Reserved.
              </div>
          </div>
      </footer>
    </div>
  );
} 