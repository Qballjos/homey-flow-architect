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
    // 1. Discovery: Hierarchical Map
    console.log('\n[Phase 1] Hierarchical Discovery...');
    const zonesResult = await discovery.list_zones();
    const zones = zonesResult.content || [];
    console.log(`Mapped ${zones.length} zones/rooms.`);

    // Find a target zone (e.g., 'Woonkamer' or 'Living Room')
    const targetZoneName = 'Woonkamer'; // Adjust as needed
    const zone = zones.find(z => z.name === targetZoneName) || zones[0];
    console.log(`Targeting Zone: ${zone?.name || 'Default'}`);

    // Discover devices in that zone
    const devicesResult = await discovery.get_devices_by_zone(zone?.id);
    const devices = devicesResult.content || [];
    console.log(`Found ${devices.length} devices in ${zone?.name}.`);

    const light = devices.find(d => d.capabilities?.includes('onoff')) || devices[0];
    const deviceId = light?.id || '5f9b1c90-abcd-1234-efgh-567890abcdef';
    
    // 2. Design: Context-Aware Pattern Generation (Motion Light)
    console.log(`\n[Phase 2] Design: Generating Motion Light for ${light?.name || 'Device'}...`);
    const flowJson = patterns.createMotionLight(
      `Motion Light: ${zone?.name || 'Room'}`,
      'MOTION_SENSOR_ID', // Placeholder or real ID
      deviceId,
      300 // 5 minute delay
    );
    console.log(`Pattern generated: ${flowJson.name} (with 5m delay)`);

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
