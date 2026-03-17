const { get_device } = require('./discovery');

/**
 * Validator Utility for Homey Advanced Flows
 */
class Validator {
  /**
   * Performs all Phase 3 checks on a flow JSON
   * @param {object} flowJson 
   */
  async validate(flowJson) {
    const results = {
      valid: true,
      errors: [],
      warnings: []
    };

    // 1. Structural Integrity Check
    this.validateStructure(flowJson, results);

    // 2. Coordinate Collision Check
    this.validateCoordinates(flowJson, results);

    // 3. Capability Match Check
    await this.validateCapabilities(flowJson, results);

    results.valid = results.errors.length === 0;
    return results;
  }

  /**
   * Ensures no orphaned lines and all card IDs exist
   */
  validateStructure(flow, results) {
    const cardIds = new Set();
    [...flow.trigger.cards, ...flow.conditions.cards, ...flow.actions.cards].forEach(c => cardIds.add(c.id));

    flow.lines.forEach((line, index) => {
      if (!cardIds.has(line.from.id)) {
        results.errors.push(`Line ${index} has non-existent source card: ${line.from.id}`);
      }
      if (!cardIds.has(line.to.id)) {
        results.errors.push(`Line ${index} has non-existent target card: ${line.to.id}`);
      }
    });
  }

  /**
   * Detects overlapping cards
   */
  validateCoordinates(flow, results) {
    const cards = [...flow.trigger.cards, ...flow.conditions.cards, ...flow.actions.cards];
    const MIN_DISTANCE = 150;

    for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
            const c1 = cards[i];
            const c2 = cards[j];
            const dx = c1.x - c2.x;
            const dy = c1.y - c2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MIN_DISTANCE) {
                results.errors.push(`Coordinate collision: Cards '${c1.id}' and '${c2.id}' are too close (${Math.round(distance)}px)`);
            }
        }
    }
  }

  /**
   * Self-Healing: Automatically adjusts card coordinates to resolve collisions
   * @param {object} flow 
   */
  resolveCollisions(flow) {
    const cards = [...flow.trigger.cards, ...flow.conditions.cards, ...flow.actions.cards];
    const MIN_DISTANCE = 200; // Slightly larger for safety
    let adjusted = false;

    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const c1 = cards[i];
        const c2 = cards[j];
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MIN_DISTANCE) {
          // Push card 2 away vertically
          c2.y += (MIN_DISTANCE - distance) + 50;
          adjusted = true;
          console.log(`Self-Healing: Adjusted '${c2.id}' to resolve collision with '${c1.id}'`);
        }
      }
    }
    return adjusted;
  }

  /**
   * Verifies that target devices support the requested capabilities
   */
  async validateCapabilities(flow, results) {
    const devicesToCheck = new Set();
    [...flow.conditions.cards, ...flow.actions.cards].forEach(card => {
      if (card.uri.startsWith('homey:device:')) {
        const deviceId = card.uri.split(':')[2];
        devicesToCheck.add(deviceId);
      }
    });

    for (const deviceId of devicesToCheck) {
      try {
        const device = await get_device(deviceId);
        // Note: Actual capability matching depends on the specific tool action string 
        // and the device's capabilities array. This is a simplified placeholder
        // that ensures the device exists. 
        if (!device) {
          results.errors.push(`Device not found: ${deviceId}`);
        }
      } catch (error) {
        results.errors.push(`Failed to verify device ${deviceId}: ${error.message}`);
      }
    }
  }
}

module.exports = new Validator();
