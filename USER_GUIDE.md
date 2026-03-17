# Homey Flow Architect (HFA) - User Guide

Welcome to the **Homey Flow Architect (HFA)**! This toolset allows you to programmatically design, validate, and deploy "Perfect Advanced Flows" to your Homey Pro. 

Whether you want to map your home's zones or build complex remote-control automations, HFA provides a structured, "local-first" approach.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
MCP_SERVER_COMMAND=npx
MCP_SERVER_ARGS=-y,@homey/mcp-server
```
*Note: Ensure your Homey API tokens and IDs are configured according to your MCP server requirements.*

---

## 🔍 Hierarchical Discovery

HFA allows you to explore your Homey's structure starting from the top down.

### List Zones & Rooms
```javascript
const discovery = require('./src/api/discovery');

const zones = await discovery.list_zones();
console.log(zones); // Shows Homes, Floors, and Rooms
```

### Focused Device Search
Find all devices in a specific room or zone:
```javascript
const devices = await discovery.get_devices_by_zone('LIVING_ROOM_ID');
```

---

## 🎨 Building Automations (Phase 2 & 3)

The `FlowBuilder` and `Validator` work together to ensure your flows are both logical and visually clean.

### 1. Design with FlowBuilder
The builder automatically handles the **Grid Layout** (Triggers at -400, Conditions at 0, Actions at 400).

```javascript
const FlowBuilder = require('./src/api/flowBuilder');
const builder = new FlowBuilder("Evening Relaxation");

// Add a Trigger
const trigger = builder.addTrigger("homey:manager:flow", "homey:manager:flow:trigger", { trigger: "sunset" });

// Add a Condition
const condition = builder.addCondition("homey:device:LED_STRIP_ID", "homey:device:LED_STRIP_ID:condition_is_off");

// Add an Action
const action = builder.addAction("homey:device:LED_STRIP_ID", "homey:device:LED_STRIP_ID:on");

// Connect them
builder.connect(trigger, condition).connect(condition, action);

const myFlow = builder.build();
```

### 2. Verify & Self-Heal
Before deploying, always run the validation suite to check for orphaned lines or overlapping cards.

```javascript
const validator = require('./src/api/validator');
const report = await validator.validate(myFlow);

if (!report.valid) {
    console.log("Issues found:", report.errors);
    // Use Self-Healing to fix coordinate collisions automatically!
    validator.resolveCollisions(myFlow);
}
```

---

## 📦 Deployment (Phase 4)

HFA supports a safety-first deployment cycle.

### Dry Run
Always check the text-based summary before pushing to the API.
```javascript
const deployment = require('./src/api/deployment');
console.log(deployment.dryRun(myFlow));
```

### Push to Homey
Once you are happy with the dry run:
```javascript
await deployment.deploy(myFlow);
```

---

## 💡 Example: Remote Control Hook
The project includes a working demonstration of a Remote Control automation. 
Run it now to see the full pipeline (Discovery -> Design -> Self-Healing -> Dry Run):
```bash
npm start
```

---

## 🛡 Performance & Safety
- **Zero Latency**: Flows are deployed as **Advanced Flows** for local execution on your Homey Pro.
- **Canvas Protection**: The validator ensures your Advanced Flow canvas remains clean and readable.
- **Schema Validation**: Every card is cross-referenced against your device capabilities.
