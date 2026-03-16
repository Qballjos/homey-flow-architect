const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

let mcpClientInstance = null;

/**
 * Initializes and connects the MCP client to the Homey server.
 * @returns {Promise<Client>}
 */
async function getMcpClient() {
  if (mcpClientInstance) {
    return mcpClientInstance;
  }

  const command = process.env.MCP_SERVER_COMMAND || 'npx';
  const args = (process.env.MCP_SERVER_ARGS || '-y,@homey/mcp-server').split(',');

  console.log(`Initializing MCP Client with command: ${command} ${args.join(' ')}`);

  const transport = new StdioClientTransport({
    command,
    args,
  });

  const client = new Client(
    {
      name: "homey-flow-architect",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log('Successfully connected to the mcp-homey server.');
    mcpClientInstance = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to MCP server:', error);
    throw error;
  }
}

module.exports = {
  getMcpClient
};
