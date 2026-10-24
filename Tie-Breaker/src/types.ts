export interface ProsConsItem {
  text: string;
  impact: number; // 1 to 5
  category: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  name: string;
  overallScore: number; // Raw AI-computed score 0 - 100
  summary: string;
  pros: ProsConsItem[];
  cons: ProsConsItem[];
  swot: SwotAnalysis;
}

export interface ComparisonCriteria {
  criteria: string;
  optionAScore: number; // out of 5
  optionAExplanation: string;
  optionBScore: number; // out of 5
  optionBExplanation: string;
}

export interface AnalysisResult {
  optionA: OptionAnalysis;
  optionB: OptionAnalysis;
  comparisonTable: ComparisonCriteria[];
  verdict: string;
  recommendationReasoning: string;
}

export interface Decision {
  id: string;
  title: string;
  optionAName?: string;
  optionBName?: string;
  createdAt: string;
  isBookmarked?: boolean;
  result?: AnalysisResult;
}
