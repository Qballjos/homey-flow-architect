const { getMcpClient } = require("./mcpClient");

/**
 * Deployment Utility for Homey Advanced Flows
 */
class Deployment {
  /**
   * Generates a dry-run summary of the proposed flow
   * @param {object} flow 
   */
  dryRun(flow) {
    const summary = [
      `🚀 Proposed Flow: ${flow.name}`,
      `---------------------------------`,
      `Triggers: ${flow.trigger.cards.length}`,
      `Conditions: ${flow.conditions.cards.length}`,
      `Actions: ${flow.actions.cards.length}`,
      `Connections: ${flow.lines.length}`,
      `---------------------------------`,
      `Card Details:`
    ];

    [...flow.trigger.cards, ...flow.conditions.cards, ...flow.actions.cards].forEach(card => {
      summary.push(`- [${card.id}] ${card.action} at (${card.x}, ${card.y})`);
    });

    return summary.join('\n');
  }

  /**
   * Pushes the flow to Homey via the MCP server
   * @param {object} flow 
   */
  async deploy(flow) {
    const client = await getMcpClient();
    try {
      console.log(`Deploying flow: ${flow.name}...`);
      
      // We'll use the "create_advanced_flow" tool if available in mcp-homey,
      // or fall back to a generic schema push if it supports raw API access.
      // For HFA, we assume the MCP server has a 'create_advanced_flow' tool.
      const result = await client.callTool({
        name: "create_advanced_flow",
        arguments: { flow }
      });

      console.log('Successfully deployed to Homey.');
      return result;
    } catch (error) {
      console.error('Deployment failed:', error.message);
      throw error;
    }
  }
}

module.exports = new Deployment();
