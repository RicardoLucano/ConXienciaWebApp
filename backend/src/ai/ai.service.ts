import { Injectable, BadRequestException } from '@nestjs/common';

export interface AnalysisResult {
  scores: {
    communication: number;
    leadership: number;
    sales: number;
    empathy: number;
    trust: number;
    persuasion: number;
  };
  personality: {
    discType: string;
    bigFive: string;
    communicationStyle: string;
    buyingBehavior: string;
  };
  suggestions: {
    bestCommunicationStyle: string;
    followUpStrategy: string;
    potentialObjections: string[];
    recommendedResponse: string;
  };
}

@Injectable()
export class AiService {
  /**
   * Evaluates a conversation transcript using Google Gemini model
   */
  async analyzeWithGemini(transcript: string, apiKey: string): Promise<AnalysisResult> {
    if (!apiKey) {
      throw new BadRequestException('Missing Gemini API Key');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = this.getSystemPrompt();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Conversation transcript to analyze:\n${transcript}` },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error: ${err.error?.message || response.statusText}`);
    }

    const resJson = await response.json();
    const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response from Gemini API');
    }

    return JSON.parse(rawText) as AnalysisResult;
  }

  /**
   * Evaluates a conversation transcript using OpenAI model
   */
  async analyzeWithOpenAi(transcript: string, apiKey: string): Promise<AnalysisResult> {
    if (!apiKey) {
      throw new BadRequestException('Missing OpenAI API Key');
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const systemPrompt = this.getSystemPrompt();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Conversation transcript to analyze:\n${transcript}` },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${err.error?.message || response.statusText}`);
    }

    const resJson = await response.json();
    const rawContent = resJson.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('Empty response from OpenAI API');
    }

    return JSON.parse(rawContent) as AnalysisResult;
  }

  private getSystemPrompt(): string {
    return `You are an expert sales trainer, communication coach, and psychologist.
Analyze the provided conversation log/transcript between a sales partner and a prospect.
Assess their communication styles and calculate quality scores (integers between 0 and 100).
Infer the prospect's personality profile (DISC, Big Five traits, buying behavior) and construct a response strategy.

You MUST return your analysis strictly as a JSON object matching this schema:
{
  "scores": {
    "communication": 85,
    "leadership": 70,
    "sales": 75,
    "empathy": 90,
    "trust": 80,
    "persuasion": 65
  },
  "personality": {
    "discType": "I (Influential) / S (Steady)",
    "bigFive": "High agreeableness, medium extroversion",
    "communicationStyle": "Empathetic, values relationship-building",
    "buyingBehavior": "Relationship-driven, needs trust assurances"
  },
  "suggestions": {
    "bestCommunicationStyle": "Maintain a friendly, low-pressure tone; highlight team support.",
    "followUpStrategy": "Check-in after 3 days to address family/time concerns.",
    "potentialObjections": ["Price/investment threshold", "Fear of lack of time"],
    "recommendedResponse": "Entiendo totalmente tu punto, María. Muchos socios empezaron..."
  }
}
Do not include any wrapper markdown blocks or notes outside the JSON object. Output ONLY the JSON.`;
  }
}
