# HFA: Project Roadmap & Future Vision

The **Homey Flow Architect (HFA)** is now a robust foundation for local-first automation design. This document outlines the vision for future expansion.

---

## 🛤 Immediate Roadmap (Phase 7-8)

### 1. HomeyScript Integration
- **Inline Scripting**: Allow the `FlowBuilder` to inject HomeyScript blocks into Advanced Flows for complex data transformation.
- **Tag Management**: Support mapping tags (variables) between script outputs and card inputs.

### 2. Deep UI Layout Engine
- **Vertical Alignment Strategy**: Expand the layout logic to handle many parallel triggers with intelligent branching.
- **Groupings**: Automatically create "Logic Clusters" for related cards.

---

## 🌟 Long-Term Vision (Phase 9+)

### 1. HFA Dashboard
A lightweight web interface (built with Vite/React) to:
- Graphically browse the hierarchical discovery map.
- "Drag-and-Drop" patterns onto rooms.
- Monitor validation status in real-time.

### 2. Multi-Home Synchronization
Logic to sync automation patterns across multiple Homey Pro hubs for larger estates.

### 3. Natural Language Interface
Direct integration with LLMs (via this MCP server) to allow users to say:
- *"Create a night mode in the living room that dims all lights to 20% if motion is detected."*
- HFA will handle the discovery, capability check, coordinate math, and deployment seamlessly.

---

## 🛠 Contribution Guidelines
- All new cards must be added to the `validator.js` capability mapping.
- All high-level logic should be abstracted into the `patterns.js` module.
- Maintain **Creation over Execution** philosophy: Build better tools for the Homey Pro, not replacements for it.
