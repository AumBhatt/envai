import { dashboardService } from './dashboardService.js';
import { dataService } from './dataService.js';
import { buildRAGPrompt, SYSTEM_PROMPTS } from '../config/systemPrompts.js';
import * as dotenv from 'dotenv';

dotenv.config();

export class SimpleRAGService {
  private apiBaseUrl: string;
  private apiKey: string;
  private modelName: string;

  constructor() {
    this.apiBaseUrl = process.env.LLM_API_BASE_URL || "https://litellm.deriv.ai/v1";
    this.apiKey = process.env.LLM_API_KEY ?? "";
    this.modelName = process.env.LLM_MODEL_NAME || "gpt-3.5-turbo";
  }

  /**
   * Query with RAG - fetches relevant data and provides context to LLM
   */
  async queryWithRAG(prompt: string, timeRange: string = '7d'): Promise<string> {
    try {
      console.log(`[AI] Starting RAG query for prompt: "${prompt}" with timeRange: ${timeRange}`);
      
      // Build context from existing data services
      console.log('[AI] Building context from dashboard data...');
      const context = await this.buildContext(timeRange);
      
      // Create RAG prompt using the new HTML-focused system prompt
      const ragPrompt = buildRAGPrompt(prompt, context, timeRange);

      console.log('[AI] Sending request to LiteLLM API...');
      // Query LLM via OpenAI-compatible API
      const response = await this.queryLLM(ragPrompt);
      console.log('[AI] Received response from LiteLLM API');
      return response;
    } catch (error) {
      console.error('[AI] RAG query error:', error);
      return 'Sorry, I encountered an error while processing your question. Please try again.';
    }
  }

  /**
   * Direct HTTP call to LiteLLM (OpenAI-compatible API)
   */
  private async queryLLM(prompt: string): Promise<string> {
    try {
      console.log(`[AI] Making request to ${this.apiBaseUrl}/chat/completions with model: ${this.modelName}`);
      const startTime = Date.now();
      
      const response = await fetch(`${this.apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const duration = Date.now() - startTime;
      console.log(`[AI] API request completed in ${duration}ms`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AI] LiteLLM API error: ${response.status} - ${errorText}`);
        throw new Error(`LiteLLM API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[AI] Successfully parsed response from LiteLLM');
      
      return data.choices?.[0]?.message?.content || 'No response from AI model.';
    } catch (error) {
      console.error('[AI] LiteLLM query error:', error);
      throw error;
    }
  }

  /**
   * Build context from dashboard data for RAG
   */
  private async buildContext(timeRange: string): Promise<string> {
    try {
      // Get comprehensive dashboard data
      const dashboardData = dashboardService.getDashboardData(timeRange);
      const latestReading = dataService.getLatestReading();
      const systemHealth = dashboardService.getSystemHealth();

      // Format context as structured text
      const context = `
CURRENT STATUS:
- Current Temperature: ${latestReading.currentTemp}°F
- Target Temperature: ${latestReading.targetTemp}°F
- System Mode: ${latestReading.mode}
- Occupancy: ${latestReading.occupancy ? 'Occupied' : 'Vacant'}
- Humidity: ${latestReading.humidity}%
- Last Updated: ${latestReading.timestamp}

SUMMARY STATISTICS (${timeRange}):
- Average Temperature: ${dashboardData.summary.avgTemp}°F
- Total Energy Usage: ${dashboardData.summary.totalEnergy} kWh
- Total Cost: $${dashboardData.summary.totalCost}
- Occupancy Rate: ${dashboardData.summary.occupancyRate}%
- Data Points: ${dashboardData.metadata.dataPoints}

SYSTEM HEALTH:
- Overall Status: ${systemHealth.overall}
- Temperature Health: ${systemHealth.components.temperature.status}
- Energy Efficiency: ${systemHealth.components.energy.status}
- Humidity Status: ${systemHealth.components.humidity.status}
- Current Efficiency: ${systemHealth.components.energy.efficiency}%
- Daily Cost: $${systemHealth.components.energy.dailyCost}

ENERGY DATA:
- Weekly Costs: ${JSON.stringify(dashboardData.charts.weeklyCostsChart)}
- Energy Breakdown: ${JSON.stringify(dashboardData.charts.energyBreakdownChart)}

TEMPERATURE PATTERNS:
- Temperature Chart Data: ${JSON.stringify(dashboardData.charts.temperatureChart)}

USAGE PATTERNS:
- Heatmap Data: ${JSON.stringify(dashboardData.charts.heatmapChart)}

RECOMMENDATIONS:
${systemHealth.recommendations.join('\n- ')}
`;

      return context;
    } catch (error) {
      console.error('Error building context:', error);
      return 'Error: Unable to retrieve system data for analysis.';
    }
  }

  /**
   * Health check for LiteLLM API connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('[AI] Performing health check for LiteLLM API...');
      const response = await fetch(`${this.apiBaseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      const isHealthy = response.ok;
      console.log(`[AI] Health check result: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
      return isHealthy;
    } catch (error) {
      console.error('[AI] LiteLLM health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const ragService = new SimpleRAGService();
