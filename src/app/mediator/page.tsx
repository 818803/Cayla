'use client';

import React, { useState } from 'react';
import { Scale, Brain, Target, AlertTriangle, CheckCircle, XCircle, Users, Zap, TrendingUp, TrendingDown, Eye, Shield } from 'lucide-react';
import { Mediator, MediationResult, ParticipantAnalysis } from '@/lib/mediator';
import { Message } from '@/lib/chat-utils';
import ConversationInput from '@/components/ConversationInput';

const MediatorPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MediationResult | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState({
    factualWeight: 0.35,
    logicalWeight: 0.25,
    evidenceWeight: 0.25,
    rhetoricWeight: 0.15
  });

  const analyzeConversation = async (text: string) => {
    setIsAnalyzing(true);
    setResult(null);

    const lines = text.trim().split(/\\n|\n/);
    const messages: Message[] = lines.map((line, index) => {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) {
            return { id: (index + 1).toString(), userId: 'unknown', content: line, timestamp: new Date() };
        }
        const userId = line.substring(0, separatorIndex).trim().toLowerCase().replace(/\s/g, '');
        const content = line.substring(separatorIndex + 1).trim();
        return {
            id: (index + 1).toString(),
            userId,
            content,
            timestamp: new Date()
        };
    }).filter(m => m.content);

    const mediator = new Mediator(selectedCriteria);
    const analysisResult = await mediator.mediate(messages);
    
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreBackground = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const WinnerBadge = ({ winner, confidence }: { winner: string, confidence: number }) => {
    if (winner === 'draw') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-full">
          <Scale className="w-5 h-5 text-gray-300" />
          <span className="text-gray-300 font-semibold uppercase">DRAW</span>
          <span className="text-gray-400 text-sm">{confidence}% confidence</span>
        </div>
      );
    }
     if (winner === 'insufficient_data') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-600 rounded-full">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold uppercase">INSUFFICIENT DATA</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600">
        <Target className="w-5 h-5 text-white" />
        <span className="text-white font-semibold uppercase">{winner} WINS</span>
        <span className="text-gray-200 text-sm">{confidence}% confidence</span>
      </div>
    );
  };

  const ScoreBar = ({ label, analysis, participantNames, icon: Icon }: { label: keyof ParticipantAnalysis, analysis: Record<string, ParticipantAnalysis>, participantNames: string[], icon: React.ElementType }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-300">
        <Icon className="w-5 h-5" />
        <span className="font-medium capitalize">{label.replace(/([A-Z])/g, ' $1')}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {participantNames.map(name => {
          const score = analysis[name]?.[label] as number || 0;
          return (
            <div key={name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 capitalize">{name}</span>
                <span className={getScoreColor(score)}>{Math.round(score)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreBackground(score)} transition-all duration-1000`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const BiasIndicator = ({ biases, participant }: { biases: string[], participant: string }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-300 capitalize">{participant}</h4>
      {biases.length === 0 ? (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">No significant bias detected</span>
        </div>
      ) : (
        <div className="space-y-1">
          {biases.map((bias, index) => (
            <div key={index} className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm capitalize">{bias.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  const participantNames = result ? Object.keys(result.analysis) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-purple-600 rounded-full">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Mediator
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced conversation analysis to determine who presents the stronger argument based on facts, logic, and evidence.
          </p>
        </div>

        {/* Criteria Adjustment */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Analysis Criteria
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(selectedCriteria).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm text-gray-300 capitalize">
                  {key.replace('Weight', '').replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={value}
                    onChange={(e) => setSelectedCriteria(prev => ({
                      ...prev,
                      [key]: parseFloat(e.target.value)
                    }))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-sm text-gray-400 w-12">
                    {Math.round(value * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ConversationInput onAnalyze={analyzeConversation} isAnalyzing={isAnalyzing} />

        {/* Results */}
        {result && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-4 md:mb-0">Analysis Results</h2>
              <WinnerBadge winner={result.winner} confidence={result.confidence} />
            </div>
            
            <p className="text-gray-300 mb-6">{result.reasoning}</p>
            {result.suggestedResolution && <p className="text-purple-300 italic mb-6">{result.suggestedResolution}</p>}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Scores */}
              <div className="space-y-4">
                <ScoreBar label="factualAccuracy" analysis={result.analysis} participantNames={participantNames} icon={CheckCircle} />
                <ScoreBar label="logicalConsistency" analysis={result.analysis} participantNames={participantNames} icon={Brain} />
                <ScoreBar label="evidenceQuality" analysis={result.analysis} participantNames={participantNames} icon={Eye} />
              </div>
              
              {/* Bias and Key Points */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-purple-400" /> Bias Detection</h3>
                  <div className="grid grid-cols-2 gap-4">
                     {participantNames.map(name => (
                        <BiasIndicator key={name} biases={result.analysis[name]?.biasDetection || []} participant={name} />
                     ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-purple-400" /> Key Points</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     {participantNames.map(name => (
                      <div key={name}>
                        <h4 className="font-semibold text-gray-300 mb-2 capitalize">{name}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          {(result.analysis[name]?.keyPoints || []).map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediatorPage; 