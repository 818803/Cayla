// lib/mediator.ts
import { Message } from './chat-utils';

export interface MediationResult {
  winner: 'participant_a' | 'participant_b' | 'draw' | 'insufficient_data';
  confidence: number; // 0-100
  reasoning: string;
  factualAccuracy: {
    participant_a: number;
    participant_b: number;
  };
  logicalConsistency: {
    participant_a: number;
    participant_b: number;
  };
  evidenceQuality: {
    participant_a: number;
    participant_b: number;
  };
  biasDetection: {
    participant_a: string[];
    participant_b: string[];
  };
  keyPoints: {
    participant_a: string[];
    participant_b: string[];
  };
  suggestedResolution?: string;
}

export interface MediationCriteria {
  factualWeight: number; // 0-1
  logicalWeight: number; // 0-1
  evidenceWeight: number; // 0-1
  rhetoricWeight: number; // 0-1
  contextSensitive: boolean;
  minimumMessages: number;
}

export class Mediator {
  private criteria: MediationCriteria;
  private knowledgeBase: Map<string, any>;

  constructor(criteria: Partial<MediationCriteria> = {}) {
    this.criteria = {
      factualWeight: 0.35,
      logicalWeight: 0.25,
      evidenceWeight: 0.25,
      rhetoricWeight: 0.15,
      contextSensitive: true,
      minimumMessages: 4,
      ...criteria
    };
    this.knowledgeBase = new Map();
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase(): void {
    // Initialize with common facts, logical fallacies, etc.
    this.knowledgeBase.set('logical_fallacies', [
      'ad hominem', 'straw man', 'false dichotomy', 'appeal to authority',
      'slippery slope', 'circular reasoning', 'red herring', 'bandwagon'
    ]);
    
    this.knowledgeBase.set('fact_patterns', [
      /\d{4}-\d{2}-\d{2}/, // dates
      /\$\d+/, // monetary values
      /\d+%/, // percentages
      /according to .+/i, // source citations
    ]);
  }

  async mediate(messages: Message[], participants: string[]): Promise<MediationResult> {
    if (messages.length < this.criteria.minimumMessages) {
      return this.createInsufficientDataResult();
    }

    const participantMessages = this.categorizeMessages(messages, participants);
    
    const factualScores = await this.analyzeFacts(participantMessages);
    const logicalScores = this.analyzeLogic(participantMessages);
    const evidenceScores = this.analyzeEvidence(participantMessages);
    const biasAnalysis = this.detectBias(participantMessages);
    const keyPoints = this.extractKeyPoints(participantMessages);

    const finalScores = this.calculateFinalScores(
      factualScores,
      logicalScores,
      evidenceScores
    );

    const winner = this.determineWinner(finalScores);
    const confidence = this.calculateConfidence(finalScores, participantMessages);
    const reasoning = this.generateReasoning(
      finalScores,
      factualScores,
      logicalScores,
      evidenceScores,
      biasAnalysis
    );

    return {
      winner,
      confidence,
      reasoning,
      factualAccuracy: factualScores,
      logicalConsistency: logicalScores,
      evidenceQuality: evidenceScores,
      biasDetection: biasAnalysis,
      keyPoints,
      suggestedResolution: this.generateResolution(participantMessages, winner)
    };
  }

  private categorizeMessages(messages: Message[], participants: string[]): Map<string, Message[]> {
    const categorized = new Map<string, Message[]>();
    
    participants.forEach(p => categorized.set(p, []));
    
    messages.forEach(msg => {
      const participant = participants.find(p => msg.userId === p);
      if (participant) {
        categorized.get(participant)?.push(msg);
      }
    });
    
    return categorized;
  }

  private async analyzeFacts(participantMessages: Map<string, Message[]>): Promise<{participant_a: number, participant_b: number}> {
    const scores = { participant_a: 0, participant_b: 0 };
    const participants = Array.from(participantMessages.keys());
    
    for (let i = 0; i < participants.length && i < 2; i++) {
      const participant = participants[i];
      const messages = participantMessages.get(participant) || [];
      const key = i === 0 ? 'participant_a' : 'participant_b';
      
      let factScore = 0;
      let totalClaims = 0;
      
      messages.forEach(msg => {
        const claims = this.extractFactualClaims(msg.content);
        totalClaims += claims.length;
        
        claims.forEach(claim => {
          const accuracy = this.verifyFactualClaim(claim);
          factScore += accuracy;
        });
      });
      
      scores[key] = totalClaims > 0 ? (factScore / totalClaims) * 100 : 50;
    }
    
    return scores;
  }

  private analyzeLogic(participantMessages: Map<string, Message[]>): {participant_a: number, participant_b: number} {
    const scores = { participant_a: 0, participant_b: 0 };
    const participants = Array.from(participantMessages.keys());
    
    for (let i = 0; i < participants.length && i < 2; i++) {
      const participant = participants[i];
      const messages = participantMessages.get(participant) || [];
      const key = i === 0 ? 'participant_a' : 'participant_b';
      
      let logicScore = 100; // Start with perfect score
      let totalDeductions = 0;
      
      messages.forEach(msg => {
        const fallacies = this.detectLogicalFallacies(msg.content);
        totalDeductions += fallacies.length * 15; // -15 points per fallacy
        
        const coherence = this.assessCoherence(msg.content);
        logicScore += coherence - 50; // coherence is 0-100, adjust to +/- 50
      });
      
      scores[key] = Math.max(0, Math.min(100, logicScore - totalDeductions));
    }
    
    return scores;
  }

  private analyzeEvidence(participantMessages: Map<string, Message[]>): {participant_a: number, participant_b: number} {
    const scores = { participant_a: 0, participant_b: 0 };
    const participants = Array.from(participantMessages.keys());
    
    for (let i = 0; i < participants.length && i < 2; i++) {
      const participant = participants[i];
      const messages = participantMessages.get(participant) || [];
      const key = i === 0 ? 'participant_a' : 'participant_b';
      
      let evidenceScore = 0;
      let evidenceCount = 0;
      
      messages.forEach(msg => {
        const evidence = this.extractEvidence(msg.content);
        evidenceCount += evidence.length;
        
        evidence.forEach(ev => {
          const quality = this.assessEvidenceQuality(ev);
          evidenceScore += quality;
        });
      });
      
      scores[key] = evidenceCount > 0 ? (evidenceScore / evidenceCount) : 30;
    }
    
    return scores;
  }

  private detectBias(participantMessages: Map<string, Message[]>): {participant_a: string[], participant_b: string[]} {
    const biases = { participant_a: [] as string[], participant_b: [] as string[] };
    const participants = Array.from(participantMessages.keys());
    
    const biasPatterns = [
      { pattern: /always|never|everyone|no one/gi, type: 'overgeneralization' },
      { pattern: /obviously|clearly|any idiot/gi, type: 'condescension' },
      { pattern: /you people|typical|all .+s are/gi, type: 'stereotyping' },
      { pattern: /but what about/gi, type: 'whataboutism' }
    ];
    
    for (let i = 0; i < participants.length && i < 2; i++) {
      const participant = participants[i];
      const messages = participantMessages.get(participant) || [];
      const key = i === 0 ? 'participant_a' : 'participant_b';
      
      messages.forEach(msg => {
        biasPatterns.forEach(({ pattern, type }) => {
          if (pattern.test(msg.content)) {
            biases[key].push(type);
          }
        });
      });
    }
    
    return biases;
  }

  private extractKeyPoints(participantMessages: Map<string, Message[]>): {participant_a: string[], participant_b: string[]} {
    const keyPoints = { participant_a: [] as string[], participant_b: [] as string[] };
    const participants = Array.from(participantMessages.keys());
    
    for (let i = 0; i < participants.length && i < 2; i++) {
      const participant = participants[i];
      const messages = participantMessages.get(participant) || [];
      const key = i === 0 ? 'participant_a' : 'participant_b';
      
      messages.forEach(msg => {
        const sentences = msg.content.split(/[.!?]+/).filter((s: string) => s.trim().length > 20);
        const important = sentences.filter((s: string) => 
          /because|therefore|however|actually|in fact|evidence shows/i.test(s)
        ).slice(0, 3);
        
        keyPoints[key].push(...important.map((s: string) => s.trim()));
      });
    }
    
    return keyPoints;
  }

  private extractFactualClaims(content: string): string[] {
    const claims: string[] = [];
    const patterns = this.knowledgeBase.get('fact_patterns') as RegExp[];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        claims.push(...matches);
      }
    });
    
    // Extract sentences with factual indicators
    const factualIndicators = /studies show|research indicates|data suggests|statistics reveal/gi;
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (factualIndicators.test(sentence)) {
        claims.push(sentence.trim());
      }
    });
    
    return claims;
  }

  private verifyFactualClaim(claim: string): number {
    // Simplified fact verification - in reality, this would query external databases
    const confidenceIndicators = [
      /peer.reviewed/i, /published/i, /university/i, /institute/i
    ];
    
    let accuracy = 50; // baseline
    
    confidenceIndicators.forEach(indicator => {
      if (indicator.test(claim)) {
        accuracy += 15;
      }
    });
    
    // Check for vague language that reduces credibility
    const vaguePatterns = /some say|many believe|it's said that/gi;
    if (vaguePatterns.test(claim)) {
      accuracy -= 20;
    }
    
    return Math.max(0, Math.min(100, accuracy));
  }

  private detectLogicalFallacies(content: string): string[] {
    const fallacies: string[] = [];
    const fallacyPatterns = [
      { pattern: /you're wrong because you're/gi, type: 'ad hominem' },
      { pattern: /if we allow .+, then .+ will happen/gi, type: 'slippery slope' },
      { pattern: /everyone knows|it's common knowledge/gi, type: 'bandwagon' },
      { pattern: /but you also|what about when you/gi, type: 'tu quoque' }
    ];
    
    fallacyPatterns.forEach(({ pattern, type }) => {
      if (pattern.test(content)) {
        fallacies.push(type);
      }
    });
    
    return fallacies;
  }

  private assessCoherence(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length < 2) return 70;
    
    let coherenceScore = 80;
    
    // Check for logical connectors
    const connectors = /therefore|however|furthermore|consequently|because|since/gi;
    const connectorCount = (content.match(connectors) || []).length;
    coherenceScore += Math.min(20, connectorCount * 5);
    
    // Penalize for contradictions within the same message
    const contradictions = /but|however|although|despite/gi;
    const contradictionCount = (content.match(contradictions) || []).length;
    if (contradictionCount > sentences.length / 2) {
      coherenceScore -= 15;
    }
    
    return Math.max(0, Math.min(100, coherenceScore));
  }

  private extractEvidence(content: string): string[] {
    const evidence: string[] = [];
    const evidencePatterns = [
      /according to .+/gi,
      /study by .+/gi,
      /research from .+/gi,
      /data shows .+/gi,
      /source: .+/gi
    ];
    
    evidencePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        evidence.push(...matches);
      }
    });
    
    return evidence;
  }

  private assessEvidenceQuality(evidence: string): number {
    let quality = 40; // baseline
    
    // Higher quality indicators
    if (/peer.reviewed|journal|university|institute/i.test(evidence)) quality += 30;
    if (/\d{4}/.test(evidence)) quality += 10; // has year
    if (/http|www/i.test(evidence)) quality += 15; // has link
    
    // Lower quality indicators
    if (/blog|opinion|personal experience/i.test(evidence)) quality -= 20;
    if (/i heard|someone said|they say/i.test(evidence)) quality -= 25;
    
    return Math.max(0, Math.min(100, quality));
  }

  private calculateFinalScores(
    factual: {participant_a: number, participant_b: number},
    logical: {participant_a: number, participant_b: number},
    evidence: {participant_a: number, participant_b: number}
  ): {participant_a: number, participant_b: number} {
    const scores = { participant_a: 0, participant_b: 0 };
    
    ['participant_a', 'participant_b'].forEach(participant => {
      const key = participant as keyof typeof scores;
      scores[key] = 
        factual[key] * this.criteria.factualWeight +
        logical[key] * this.criteria.logicalWeight +
        evidence[key] * this.criteria.evidenceWeight;
    });
    
    return scores;
  }

  private determineWinner(scores: {participant_a: number, participant_b: number}): MediationResult['winner'] {
    const difference = Math.abs(scores.participant_a - scores.participant_b);
    
    if (difference < 10) return 'draw';
    if (scores.participant_a > scores.participant_b) return 'participant_a';
    return 'participant_b';
  }

  private calculateConfidence(
    scores: {participant_a: number, participant_b: number},
    participantMessages: Map<string, Message[]>
  ): number {
    const difference = Math.abs(scores.participant_a - scores.participant_b);
    const messageCount = Array.from(participantMessages.values()).reduce((sum, msgs) => sum + msgs.length, 0);
    
    let confidence = Math.min(90, difference * 2); // Base confidence on score difference
    
    // Adjust for sample size
    if (messageCount < 10) confidence *= 0.7;
    if (messageCount > 20) confidence = Math.min(95, confidence * 1.1);
    
    return Math.round(confidence);
  }

  private generateReasoning(
    finalScores: {participant_a: number, participant_b: number},
    factualScores: {participant_a: number, participant_b: number},
    logicalScores: {participant_a: number, participant_b: number},
    evidenceScores: {participant_a: number, participant_b: number},
    biasAnalysis: {participant_a: string[], participant_b: string[]}
  ): string {
    const winner = this.determineWinner(finalScores);
    const winnerKey = winner === 'participant_a' ? 'participant_a' : 'participant_b';
    const loserKey = winner === 'participant_a' ? 'participant_b' : 'participant_a';
    
    if (winner === 'draw') {
      return "Both participants presented equally compelling arguments with similar strengths in factual accuracy, logical reasoning, and evidence quality.";
    }
    
    const reasons: string[] = [];
    
    if (factualScores[winnerKey] > factualScores[loserKey] + 15) {
      reasons.push("superior factual accuracy and verifiable claims");
    }
    
    if (logicalScores[winnerKey] > logicalScores[loserKey] + 15) {
      reasons.push("stronger logical consistency and fewer reasoning fallacies");
    }
    
    if (evidenceScores[winnerKey] > evidenceScores[loserKey] + 15) {
      reasons.push("higher quality evidence and better source attribution");
    }
    
    if (biasAnalysis[winnerKey].length < biasAnalysis[loserKey].length) {
      reasons.push("less biased argumentation");
    }
    
    if (reasons.length === 0) {
      reasons.push("marginally better overall argumentation");
    }
    
    return `The winning participant demonstrated ${reasons.join(', ')}.`;
  }

  private generateResolution(participantMessages: Map<string, Message[]>, winner: MediationResult['winner']): string {
    if (winner === 'draw') {
      return "Consider finding common ground between both perspectives, as each side has valid points worth incorporating.";
    }
    
    return "The evidence suggests focusing on the stronger argument while acknowledging any valid concerns raised by the other side.";
  }

  private createInsufficientDataResult(): MediationResult {
    return {
      winner: 'insufficient_data',
      confidence: 0,
      reasoning: "Not enough messages to perform reliable mediation analysis.",
      factualAccuracy: { participant_a: 0, participant_b: 0 },
      logicalConsistency: { participant_a: 0, participant_b: 0 },
      evidenceQuality: { participant_a: 0, participant_b: 0 },
      biasDetection: { participant_a: [], participant_b: [] },
      keyPoints: { participant_a: [], participant_b: [] }
    };
  }
}
