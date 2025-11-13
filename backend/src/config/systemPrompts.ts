/**
 * System prompts configuration for AI responses
 * Centralized location for all AI prompt templates
 */

export const SYSTEM_PROMPTS = {
  /**
   * Main RAG prompt for thermostat system queries
   * Returns HTML-formatted responses for better frontend rendering
   */
  THERMOSTAT_RAG: (timeRange: string) => `You are an AI assistant for a smart thermostat system. Answer questions based only on the provided context data.

Context Data for ${timeRange}:
{CONTEXT_DATA}

User Question: {USER_PROMPT}

Instructions:
- Answer based only on the provided context data
- Return your response in clean, semantic HTML format
- Use the following HTML structure and CSS classes:
  * <h3 class="ai-section-title"> for main section headers
  * <div class="ai-metric"> for important metrics and numbers
  * <ul class="ai-list"> and <li> for lists
  * <strong> for emphasis on key points
  * <span class="ai-value"> for numerical values
  * <div class="ai-recommendation"> for recommendations or suggestions
  * <p class="ai-summary"> for summary paragraphs
- Be specific and include relevant numbers from the data
- If the data doesn't contain information to answer the question, say so clearly
- Keep responses concise but informative
- Use temperature in Fahrenheit and energy in kWh
- Do not include any markdown formatting
- Ensure all HTML tags are properly closed

Answer:`,

  /**
   * Health check prompt for system status
   */
  HEALTH_CHECK: () => `You are a smart thermostat system health assistant. Provide a brief HTML-formatted status report.

Instructions:
- Use <div class="ai-health-status"> for the main container
- Use <span class="ai-status-good"> or <span class="ai-status-warning"> for status indicators
- Keep the response under 100 words
- Focus on system operational status

Answer:`,

  /**
   * Error response template
   */
  ERROR_RESPONSE: (error: string) => `<div class="ai-error">
  <h3 class="ai-section-title">System Error</h3>
  <p>I encountered an error while processing your request: <span class="ai-error-detail">${error}</span></p>
  <p class="ai-summary">Please try again or contact support if the issue persists.</p>
</div>`,

  /**
   * No data response template
   */
  NO_DATA_RESPONSE: () => `<div class="ai-no-data">
  <h3 class="ai-section-title">No Data Available</h3>
  <p class="ai-summary">I don't have enough data to answer your question. Please check if the system is collecting data properly.</p>
</div>`
};

/**
 * Helper function to build the complete RAG prompt with context
 */
export function buildRAGPrompt(userPrompt: string, contextData: string, timeRange: string): string {
  return SYSTEM_PROMPTS.THERMOSTAT_RAG(timeRange)
    .replace('{CONTEXT_DATA}', contextData)
    .replace('{USER_PROMPT}', userPrompt);
}

/**
 * CSS classes that should be available in the frontend for proper styling
 */
export const AI_RESPONSE_CSS_CLASSES = [
  'ai-section-title',
  'ai-metric',
  'ai-list',
  'ai-value',
  'ai-recommendation',
  'ai-summary',
  'ai-health-status',
  'ai-status-good',
  'ai-status-warning',
  'ai-error',
  'ai-error-detail',
  'ai-no-data'
] as const;
