/**
 * Homey Flow Architect (HFA) 
 * Core Logic App
 */

require('dotenv').config();

const discovery = require('./api/discovery');
const FlowBuilder = require('./api/flowBuilder');
const validator = require('./api/validator');
const deployment = require('./api/deployment');
const patterns = require('./api/patterns');

async function main() {
  console.log('--- Homey Flow Architect (HFA) ---');
  
  try {
    // 1. Discovery
    console.log('\n[Phase 1] Discovery...');
    const zones = await discovery.list_zones();
    console.log('Homes and Zones mapped.');

    const devicesResult = await discovery.list_devices();
    const devices = devicesResult.content || [];
    const deviceId = devices[0]?.id || '5f9b1c90-abcd-1234-efgh-567890abcdef';
    
    // 2. Design: Using high-level Patterns
    console.log('\n[Phase 2] Design: Using Automation Patterns...');
    const flowJson = patterns.createToggle(
      "Smart Toggle: Living Room",
      "wall_switch_clicked",
      deviceId
    );
    console.log(`Pattern generated: ${flowJson.name}`);

    // 3. Verification & Self-Healing
    console.log('\n[Phase 3] Verification & Self-Healing...');
    
    // Intentionally create a collision for demo
    console.log('Intentionally creating a coordinate collision for demo...');
    flowJson.actions.cards[0].x = flowJson.trigger.cards[0].x + 50; 
    flowJson.actions.cards[0].y = flowJson.trigger.cards[0].y + 50;

    let validation = await validator.validate(flowJson);
    if (!validation.valid) {
      console.log('Validation found issues:', validation.errors);
      console.log('Attempting Self-Healing...');
      const fixed = validator.resolveCollisions(flowJson);
      if (fixed) {
        console.log('Self-Healing applied. Re-validating...');
        validation = await validator.validate(flowJson);
      }
    }

    if (!validation.valid) {
      console.error('Validation failed even after Self-Healing:', validation.errors);
      return;
    }
    console.log('Everything is valid now.');

    // 4. Deployment (Dry Run)
    console.log('\n[Phase 4] Local Deployment (Dry Run)...');
    const summary = deployment.dryRun(flowJson);
    console.log(summary);
    
    console.log('\nReady for deployment. (To deploy, call deployment.deploy(flowJson))');

  } catch (error) {
    console.error('\n❌ Workflow failed:');
    console.error(error.message);
  }
}

main().catch(console.error);
