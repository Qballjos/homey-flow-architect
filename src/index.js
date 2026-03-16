/**
 * Homey Flow Architect (HFA) 
 * Core Logic App
 */

require('dotenv').config();

const discovery = require('./api/discovery');

async function main() {
  console.log('Homey Flow Architect initialized.');
  console.log('Starting Phase 1: Discovery via MCP...');
  
  try {
    // Attempting to discover devices using the MCP server
    console.log('Calling list_devices...');
    const devices = await discovery.list_devices();
    console.log('Devices found:', devices);
  } catch (error) {
    console.error('Phase 1 Discovery failed. Ensure your mcp-homey server is configured correctly in .env');
    console.error(error.message);
  }
}

main().catch(console.error);
