/* src/services/agent/Parser.js */

/**
 * Agent Output Parser
 * 
 * Extracts structured actions from AI generated text using XML-like tags.
 * Example tags: 
 * <update_outline>JSON_DATA</update_outline>
 * <add_character>JSON_DATA</add_character>
 * <insert_content>TEXT_CONTENT</insert_content>
 */
const Parser = {
  /**
   * Parse all actions from text
   * @param {string} text - The AI response text
   * @returns {Array} List of actions { type, data, rawContent }
   */
  parse(text) {
    if (!text) return [];

    const actions = [];
    
    // Pattern to match <tag>content</tag>
    const tagPattern = /<([a-z_]+)>([\s\S]*?)<\/\1>/gi;
    let match;

    while ((match = tagPattern.exec(text)) !== null) {
      const type = match[1];
      const rawContent = match[2].trim();
      let data = rawContent;

      // Robust JSON extraction: look for the first { or [ and last } or ]
      const jsonMatch = rawContent.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        try {
          // Clean common AI artifacts from JSON string
          let jsonStr = jsonMatch[0]
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
          
          data = JSON.parse(jsonStr);
        } catch (e) {
          console.warn(`Failed to parse JSON for tag ${type}:`, e);
        }
      }

      actions.push({
        type,
        data,
        rawContent
      });
    }

    return actions;
  },

  /**
   * Remove action tags from text for clean display to user
   * @param {string} text - The raw AI response
   * @returns {string} Cleaned text
   */
  cleanText(text) {
    if (!text) return '';
    return text.replace(/<([a-z_]+)>([\s\S]*?)<\/\1>/gi, '').trim();
  }
};

export default Parser;
