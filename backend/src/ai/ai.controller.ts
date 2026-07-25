import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AiService } from './ai.service';

@Controller('api/ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  async analyzeConversation(
    @Body() body: { transcript: string; provider: 'gemini' | 'openai' },
    @Headers('x-gemini-key') geminiKey?: string,
    @Headers('x-openai-key') openaiKey?: string,
  ) {
    const { transcript, provider } = body;
    if (provider === 'openai') {
      return this.aiService.analyzeWithOpenAi(transcript, openaiKey || process.env.OPENAI_API_KEY || '');
    } else {
      return this.aiService.analyzeWithGemini(transcript, geminiKey || process.env.GEMINI_API_KEY || '');
    }
  }
}
