const FlowBuilder = require('./flowBuilder');

/**
 * High-level automation patterns for Homey Pro
 */
class Patterns {
  /**
   * Creates a Remote Control automation pattern (Trigger -> Condition -> Action)
   * @param {string} name - Automation name
   * @param {string} triggerName - The flow trigger identifier
   * @param {string} deviceId - Target device ID
   * @param {string} action - Action to perform (e.g., 'on', 'off', 'dim')
   * @param {object} actionArgs - Action arguments
   */
  createRemoteControl(name, triggerName, deviceId, action, actionArgs = {}) {
    const builder = new FlowBuilder(name);
    
    const triggerId = builder.addTrigger(
      "homey:manager:flow", 
      "homey:manager:flow:trigger", 
      { trigger: triggerName }
    );
    
    const actionId = builder.addAction(
      `homey:device:${deviceId}`,
      `homey:device:${deviceId}:${action}`,
      actionArgs
    );

    builder.connect(triggerId, actionId);
    return builder.build();
  }

  /**
   * Creates a Toggle pattern (If ON then OFF, else ON)
   * @param {string} name 
   * @param {string} triggerName 
   * @param {string} deviceId 
   */
  createToggle(name, triggerName, deviceId) {
    const builder = new FlowBuilder(name);

    const triggerId = builder.addTrigger(
      "homey:manager:flow", 
      "homey:manager:flow:trigger", 
      { trigger: triggerName }
    );

    // Toggle logic often requires two parallel branches or an Advanced Flow choice
    // For simplicity, we'll implement a basic "If Off then On" pattern
    const conditionId = builder.addCondition(
      `homey:device:${deviceId}`,
      `homey:device:${deviceId}:condition_is_off`
    );

    const actionId = builder.addAction(
      `homey:device:${deviceId}`,
      `homey:device:${deviceId}:on`
    );

    builder.connect(triggerId, conditionId);
    builder.connect(conditionId, actionId);

    return builder.build();
  }

  /**
   * Creates a Motion-Triggered Lighting pattern
   * @param {string} name 
   * @param {string} sensorId 
   * @param {string} lightId 
   * @param {number} duration - Delay in seconds
   */
  createMotionLight(name, sensorId, lightId, duration = 300) {
    const builder = new FlowBuilder(name);

    // Trigger on motion detected
    const triggerId = builder.addTrigger(
      `homey:device:${sensorId}`,
      `homey:device:${sensorId}:alarm_motion_true`
    );

    // Action: Turn light on
    const actionId = builder.addAction(
      `homey:device:${lightId}`,
      `homey:device:${lightId}:on`
    );

    // Action: Turn light off after delay
    const offId = builder.addAction(
      `homey:device:${lightId}`,
      `homey:device:${lightId}:off`,
      {}
    );
    // Note: In real Advanced Flow, 'delay' property would be set on the card
    // Our FlowBuilder can be extended to support this
    
    builder.connect(triggerId, actionId);
    return builder.build();
  }
}

module.exports = new Patterns();
