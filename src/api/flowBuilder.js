/**
 * FlowBuilder Utility for Homey Advanced Flows
 * 
 * Handles JSON construction with automatic coordinate calculation and ID mapping.
 */

class FlowBuilder {
  constructor(name = "New Advanced Flow") {
    this.flow = {
      name: name,
      enabled: true,
      trigger: { type: "flow", cards: [] },
      conditions: { type: "flow", cards: [] },
      actions: { type: "flow", cards: [] },
      lines: []
    };
    
    this.counters = {
      trigger: 0,
      condition: 0,
      action: 0
    };

    // Coordinate defaults from system_prompt.md
    this.coords = {
      trigger: { x: -400, y: 0 },
      condition: { x: 0, y: 0 },
      action: { x: 400, y: 0 },
      verticalSpacing: 200
    };
  }

  /**
   * Adds a trigger card
   * @param {string} uri - e.g., 'homey:manager:flow'
   * @param {string} action - e.g., 'homey:manager:flow:trigger'
   * @param {object} args - Card arguments
   * @param {number|null} delay - Delay in seconds
   */
  addTrigger(uri, action, args = {}, delay = null) {
    this.counters.trigger++;
    const id = `trigger_${this.counters.trigger}`;
    const card = {
      id,
      uri,
      action,
      args,
      delay,
      x: this.coords.trigger.x,
      y: (this.counters.trigger - 1) * this.coords.verticalSpacing
    };
    this.flow.trigger.cards.push(card);
    return id;
  }

  /**
   * Adds a condition card
   * @param {string} uri - e.g., 'homey:device:DEVICE_ID'
   * @param {string} action - e.g., 'homey:device:DEVICE_ID:on'
   * @param {object} args 
   * @param {number|null} delay
   */
  addCondition(uri, action, args = {}, delay = null) {
    this.counters.condition++;
    const id = `condition_${this.counters.condition}`;
    const card = {
      id,
      uri,
      action,
      args,
      delay,
      x: this.coords.condition.x,
      y: (this.counters.condition - 1) * this.coords.verticalSpacing
    };
    this.flow.conditions.cards.push(card);
    return id;
  }

  /**
   * Adds an action card
   * @param {string} uri 
   * @param {string} action 
   * @param {object} args 
   * @param {number|null} delay
   */
  addAction(uri, action, args = {}, delay = null) {
    this.counters.action++;
    const id = `action_${this.counters.action}`;
    const card = {
      id,
      uri,
      action,
      args,
      delay,
      x: this.coords.action.x,
      y: (this.counters.action - 1) * this.coords.verticalSpacing
    };
    this.flow.actions.cards.push(card);
    return id;
  }

  /**
   * Connects two cards with a line
   * @param {string} fromId 
   * @param {string} toId 
   */
  connect(fromId, toId) {
    this.flow.lines.push({
      from: { id: fromId },
      to: { id: toId }
    });
    return this;
  }

  /**
   * Returns the final JSON object
   */
  build() {
    return this.flow;
  }
}

module.exports = FlowBuilder;
