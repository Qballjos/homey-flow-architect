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

async function get_devices_by_zone(zoneId) {
  const client = await getMcpClient();
  try {
    const result = await client.callTool({
      name: "get_devices_by_zone",
      arguments: { zoneId }
    });
    return result;
  } catch (error) {
    console.error(`Error calling get_devices_by_zone for zone ${zoneId}:`, error);
    throw error;
  }
}

async function get_cards_by_type(type) {
  const client = await getMcpClient();
  try {
    const result = await client.callTool({
      name: "get_cards_by_type",
      arguments: { type }
    });
    return result;
  } catch (error) {
    console.error(`Error calling get_cards_by_type for type ${type}:`, error);
    throw error;
  }
}

async function list_zones() {
  const client = await getMcpClient();
  try {
    const result = await client.callTool({
      name: "list_zones",
      arguments: {}
    });
    return result;
  } catch (error) {
    console.error("Error calling list_zones tool:", error);
    throw error;
  }
}

module.exports = {
  list_devices,
  get_device,
  get_variables,
  get_devices_by_zone,
  get_cards_by_type,
  list_zones
};
