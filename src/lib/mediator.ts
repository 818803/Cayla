// lib/mediator.ts
import { Message } from './chat-utils';

export interface ParticipantAnalysis {
  factualAccuracy: number;
  logicalConsistency: number;
  evidenceQuality: number;
  biasDetection: string[];
  keyPoints: string[];
}

export interface MediationResult {
  winner: string; // participant name, 'draw', or 'insufficient_data'
  confidence: number;
  reasoning: string;
  analysis: Record<string, ParticipantAnalysis>;
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
    this.knowledgeBase.set('logical_fallacies', [
      'ad hominem', 'straw man', 'false dichotomy', 'appeal to authority',
      'slippery slope', 'circular reasoning', 'red herring', 'bandwagon'
    ]);
    
    this.knowledgeBase.set('fact_patterns', [
      /\d{4}-\d{2}-\d{2}/, /\$\d+/, /\d+%/, /according to .+/i,
    ]);

    this.knowledgeBase.set('female_names', new Set(['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Margaret', 'Betty', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Amy', 'Kathleen', 'Angela', 'Shirley', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen', 'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Catherine', 'Carolyn', 'Janet', 'Ruth', 'Maria', 'Heather', 'Diane', 'Julie', 'Joyce', 'Victoria', 'Olivia', 'Kelly', 'Christina', 'Joan', 'Evelyn', 'Lauren', 'Judith', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Martha', 'Jacqueline', 'Frances', 'Gloria', 'Ann', 'Teresa', 'Kathryn', 'Sara', 'Janice', 'Jean', 'Alice', 'Madison', 'Doris', 'Mary', 'Olivia', 'Emma', 'Ava', 'Sophia', 'Isabella', 'Charlotte', 'Amelia', 'Mia', 'Harper', 'Evelyn']));
    this.knowledgeBase.set('male_names', new Set(['James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Frank', 'Alexander', 'Raymond', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Henry', 'Nathan', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Walter', 'Ethan', 'Jeremy', 'Harold', 'Keith', 'Christian', 'Roger', 'Noah', 'Gerald', 'Carl', 'Terry', 'Sean', 'Austin', 'Arthur', 'Lawrence', 'Jesse', 'Dylan', 'Bryan', 'Joe', 'Jordan', 'Billy', 'Bruce', 'Albert', 'Willie', 'Gabriel', 'Logan', 'Alan', 'Juan', 'Wayne', 'Roy', 'Ralph', 'Randy', 'Eugene', 'Vincent', 'Russell', 'Elijah', 'Louis', 'Bobby', 'Philip', 'Johnny', 'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore']));
  }

  private _extractParticipantInfo(messages: Message[]): Record<string, string> {
      const userIds = [...new Set(messages.map(m => m.userId))].filter(id => id !== 'unknown');
      const info: Record<string, string> = {};
      const allNames = new Set([...this.knowledgeBase.get('male_names'), ...this.knowledgeBase.get('female_names')]);

      // First pass: try to identify names from the user IDs themselves
      userIds.forEach(userId => {
          const capitalizedId = userId.charAt(0).toUpperCase() + userId.slice(1);
          if (allNames.has(capitalizedId)) {
              info[userId] = capitalizedId;
          }
      });
      
      // Second pass: for remaining IDs, check message content for names.
      // This helps if the userId is generic like "user1" but they mention their name.
      userIds.forEach((userId) => {
          if (info[userId]) return; // Already identified

          const userMessages = messages.filter(m => m.userId === userId);
          const nameCounts: Record<string, number> = {};
  
          userMessages.forEach(m => {
              const words = m.content.replace(/[^a-zA-Z\s]/g, "").split(/\s+/);
              words.forEach(word => {
                  const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                  if (allNames.has(capitalizedWord)) {
                      // Avoid participants claiming the other's name
                      if (!Object.values(info).includes(capitalizedWord)) {
                         nameCounts[capitalizedWord] = (nameCounts[capitalizedWord] || 0) + 1;
                      }
                  }
              });
          });
  
          const foundName = Object.keys(nameCounts).sort((a, b) => nameCounts[b] - nameCounts[a])[0];
          if (foundName && !Object.values(info).includes(foundName)) {
            info[userId] = foundName;
          }
      });

      // Final pass: assign generic names to any remaining unidentified userIDs
      userIds.forEach((userId, index) => {
          if (!info[userId]) {
              info[userId] = `Participant ${index + 1}`;
          }
      });

      // Handle the 'unknown' userId separately if it exists
      if (messages.some(m => m.userId === 'unknown')) {
          info['unknown'] = 'Unknown Participant';
      }
  
      return info;
  }

  async mediate(messages: Message[]): Promise<MediationResult> {
    const participantIds = [...new Set(messages.map(m => m.userId))];
    if (messages.length < this.criteria.minimumMessages || participantIds.length < 2) {
      return this.createInsufficientDataResult();
    }
    
    // For simplicity in this refactor, we'll focus on the first two participants.
    const mainParticipantIds = participantIds.slice(0, 2);
    const participantNames = this._extractParticipantInfo(messages);
    const nameToId = mainParticipantIds.reduce((acc, id) => {
        acc[participantNames[id]] = id;
        return acc;
    }, {} as Record<string, string>);
    const names = Object.keys(nameToId);

    const analysis: Record<string, ParticipantAnalysis> = {};
    const finalScores: Record<string, number> = {};

    for (const name of names) {
        const id = nameToId[name];
        const userMessages = messages.filter(m => m.userId === id);
        
        const factualScore = await this._analyzeFacts(userMessages);
        const logicalScore = this._analyzeLogic(userMessages);
        const evidenceScore = this._analyzeEvidence(userMessages);

        analysis[name] = {
            factualAccuracy: factualScore,
            logicalConsistency: logicalScore,
            evidenceQuality: evidenceScore,
            biasDetection: this._detectBias(userMessages),
            keyPoints: this._extractKeyPoints(userMessages),
        };

        finalScores[name] = 
            (factualScore * this.criteria.factualWeight) +
            (logicalScore * this.criteria.logicalWeight) +
            (evidenceScore * this.criteria.evidenceWeight);
    }
    
    const winner = this._determineWinner(finalScores, names);
    const confidence = this._calculateConfidence(finalScores, names, messages.length);
    const reasoning = this._generateReasoning(finalScores, analysis, names);
    const suggestedResolution = this._generateResolution(names, winner);

    return {
      winner,
      confidence,
      reasoning,
      analysis,
      suggestedResolution,
    };
  }

  private async _analyzeFacts(messages: Message[]): Promise<number> {
    let factScore = 0;
    let totalClaims = 0;
    messages.forEach(msg => {
      const claims = this.extractFactualClaims(msg.content);
      totalClaims += claims.length;
      claims.forEach(claim => {
        factScore += this.verifyFactualClaim(claim);
      });
    });
    return totalClaims > 0 ? (factScore / totalClaims) * 100 : 50;
  }

  private _analyzeLogic(messages: Message[]): number {
    let logicScore = 100;
    let totalDeductions = 0;
    messages.forEach(msg => {
      const fallacies = this.detectLogicalFallacies(msg.content);
      totalDeductions += fallacies.length * 15;
      const coherence = this.assessCoherence(msg.content);
      logicScore += coherence - 50;
    });
    return Math.max(0, Math.min(100, logicScore - totalDeductions));
  }

  private _analyzeEvidence(messages: Message[]): number {
    let evidenceScore = 0;
    let evidenceCount = 0;
    messages.forEach(msg => {
      const evidence = this.extractEvidence(msg.content);
      evidenceCount += evidence.length;
      evidence.forEach(ev => {
        evidenceScore += this.assessEvidenceQuality(ev);
      });
    });
    return evidenceCount > 0 ? (evidenceScore / evidenceCount) : 30;
  }

  private _detectBias(messages: Message[]): string[] {
    const biases: string[] = [];
    const biasPatterns = [
      { pattern: /always|never|everyone|no one/gi, type: 'overgeneralization' },
      { pattern: /obviously|clearly|any idiot/gi, type: 'condescension' },
      { pattern: /you people|typical|all .+s are/gi, type: 'stereotyping' },
      { pattern: /but what about/gi, type: 'whataboutism' }
    ];
    messages.forEach(msg => {
      biasPatterns.forEach(({ pattern, type }) => {
        if (pattern.test(msg.content)) {
          biases.push(type);
        }
      });
    });
    return biases;
  }

  private _extractKeyPoints(messages: Message[]): string[] {
    const keyPoints: string[] = [];
    messages.forEach(msg => {
      const sentences = msg.content.split(/[.!?]+/).filter((s: string) => s.trim().length > 20);
      const important = sentences.filter((s: string) => 
        /because|therefore|however|actually|in fact|evidence shows/i.test(s)
      ).slice(0, 3);
      keyPoints.push(...important.map((s: string) => s.trim()));
    });
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
    // Simplified fact verification
    const confidenceIndicators = [ /peer.reviewed/i, /published/i, /university/i, /institute/i ];
    let accuracy = 50;
    confidenceIndicators.forEach(indicator => {
      if (indicator.test(claim)) accuracy += 15;
    });
    if (/some say|many believe|it's said that/gi.test(claim)) accuracy -= 20;
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
      if (pattern.test(content)) fallacies.push(type);
    });
    return fallacies;
  }

  private assessCoherence(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length < 2) return 70;
    
    let coherenceScore = 80;
    const connectorCount = (content.match(/therefore|however|furthermore|consequently|because|since/gi) || []).length;
    coherenceScore += Math.min(20, connectorCount * 5);
    
    const contradictionCount = (content.match(/but|however|although|despite/gi) || []).length;
    if (contradictionCount > sentences.length / 2) coherenceScore -= 15;
    
    return Math.max(0, Math.min(100, coherenceScore));
  }

  private extractEvidence(content: string): string[] {
    const evidence: string[] = [];
    const evidencePatterns = [
      /according to .+/gi, /study by .+/gi, /research from .+/gi, /data shows .+/gi, /source: .+/gi
    ];
    evidencePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) evidence.push(...matches);
    });
    return evidence;
  }

  private assessEvidenceQuality(evidence: string): number {
    let quality = 40;
    if (/peer.reviewed|journal|university|institute/i.test(evidence)) quality += 30;
    if (/\d{4}/.test(evidence)) quality += 10;
    if (/http|www/i.test(evidence)) quality += 15;
    if (/blog|opinion|personal experience/i.test(evidence)) quality -= 20;
    if (/i heard|someone said|they say/i.test(evidence)) quality -= 25;
    return Math.max(0, Math.min(100, quality));
  }

  private _determineWinner(scores: Record<string, number>, names: string[]): string {
    if (names.length < 2) return 'insufficient_data';
    const [nameA, nameB] = names;
    const difference = Math.abs(scores[nameA] - scores[nameB]);
    
    if (difference < 10) return 'draw';
    return scores[nameA] > scores[nameB] ? nameA : nameB;
  }

  private _calculateConfidence(scores: Record<string, number>, names: string[], messageCount: number): number {
    if (names.length < 2) return 0;
    const [nameA, nameB] = names;
    const difference = Math.abs(scores[nameA] - scores[nameB]);
    
    let confidence = Math.min(90, difference * 2);
    if (messageCount < 10) confidence *= 0.7;
    if (messageCount > 20) confidence = Math.min(95, confidence * 1.1);
    
    return Math.round(confidence);
  }

    private _generateReasoning(
        finalScores: Record<string, number>,
        analysis: Record<string, ParticipantAnalysis>,
        names: string[]
    ): string {
        const winnerName = this._determineWinner(finalScores, names);
        if (winnerName === 'draw' || winnerName === 'insufficient_data') {
            return "Both participants presented equally compelling arguments with similar strengths in factual accuracy, logical reasoning, and evidence quality.";
        }
        
        const loserName = names.find(n => n !== winnerName)!;
        const winnerAnalysis = analysis[winnerName];
        const loserAnalysis = analysis[loserName];
        const reasons: string[] = [];

        if (winnerAnalysis.factualAccuracy > loserAnalysis.factualAccuracy + 15) {
            reasons.push("superior factual accuracy and verifiable claims");
        }
        if (winnerAnalysis.logicalConsistency > loserAnalysis.logicalConsistency + 15) {
            reasons.push("stronger logical consistency and fewer reasoning fallacies");
        }
        if (winnerAnalysis.evidenceQuality > loserAnalysis.evidenceQuality + 15) {
            reasons.push("higher quality evidence and better source attribution");
        }
        if (winnerAnalysis.biasDetection.length < loserAnalysis.biasDetection.length) {
            reasons.push("less biased argumentation");
        }
        if (reasons.length === 0) {
            reasons.push("a marginally better overall argumentation score");
        }

        return `${winnerName} demonstrated ${reasons.join(', ')}.`;
    }


  private _generateResolution(names: string[], winner: string): string {
    if (winner === 'draw') {
      return "Consider finding common ground between both perspectives, as each side has valid points worth incorporating.";
    }
    return `The evidence suggests focusing on the stronger argument presented by ${winner}, while acknowledging any valid concerns raised by the other side.`;
  }

  private createInsufficientDataResult(): MediationResult {
    return {
      winner: 'insufficient_data',
      confidence: 0,
      reasoning: "Not enough messages or participants to perform reliable mediation analysis.",
      analysis: {},
    };
  }
}
