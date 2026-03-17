const FlowBuilder = require('../src/api/flowBuilder');
const validator = require('../src/api/validator');
const assert = require('assert');

/**
 * Basic Unit Test Suite for HFA
 * Run with: node tests/builder_test.js
 */

async function testFlowBuilder() {
  console.log('Testing FlowBuilder...');
  const builder = new FlowBuilder("Test Flow");
  const tId = builder.addTrigger("homey:manager:flow", "homey:manager:flow:trigger");
  const aId = builder.addAction("homey:device:123", "homey:device:123:on");
  builder.connect(tId, aId);
  
  const flow = builder.build();
  assert.strictEqual(flow.name, "Test Flow");
  assert.strictEqual(flow.trigger.cards.length, 1);
  assert.strictEqual(flow.actions.cards.length, 1);
  assert.strictEqual(flow.lines.length, 1);
  console.log('✅ FlowBuilder tests passed.');
}

async function testValidator() {
  console.log('Testing Validator...');
  const builder = new FlowBuilder("Collision Flow");
  const tId = builder.addTrigger("homey:manager:flow", "homey:manager:flow:trigger");
  const aId = builder.addAction("homey:device:123", "homey:device:123:on");
  
  const flow = builder.build();
  
  // Create a collision
  flow.actions.cards[0].x = flow.trigger.cards[0].x + 50; 
  flow.actions.cards[0].y = flow.trigger.cards[0].y + 50;
  
  const report = await validator.validate(flow);
  assert.strictEqual(report.valid, false);
  assert(report.errors.some(e => e.includes('collision')));
  
  console.log('Testing Self-Healing...');
  validator.resolveCollisions(flow);
  const fixedReport = await validator.validate(flow);
  // Note: Capability check will fail since we don't have real device data here, 
  // but coordinate error should be gone.
  assert(!fixedReport.errors.some(e => e.includes('collision')));
  
  console.log('✅ Validator tests passed.');
}

async function runTests() {
  try {
    await testFlowBuilder();
    await testValidator();
    console.log('\n--- All Tests Passed ---');
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
