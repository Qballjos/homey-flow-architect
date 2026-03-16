const { getMcpClient } = require("./mcpClient");

/**
 * Discovery API utilizing the Homey MCP server
 */

async function list_devices() {
  const client = await getMcpClient();
  try {
    const result = await client.callTool({
      name: "list_devices",
      arguments: {}
    });
    return result;
  } catch (error) {
    console.error("Error calling list_devices tool:", error);
    throw error;
  }
}

async function get_device(id) {
  const client = await getMcpClient();
  try {
    const result = await client.callTool({
      name: "get_device",
      arguments: { id }
    });
    return result;
  } catch (error) {
    console.error(`Error calling get_device tool for id ${id}:`, error);
    throw error;
  }
}

async function get_variables() {
  const client = await getMcpClient();
  try {
    const result = await client.callTool({
      name: "get_variables",
      arguments: {}
    });
    return result;
  } catch (error) {
    console.error("Error calling get_variables tool:", error);
    throw error;
  }
}

module.exports = {
  list_devices,
  get_device,
  get_variables
};
