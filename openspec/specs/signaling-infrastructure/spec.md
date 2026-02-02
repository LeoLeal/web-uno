# Spec: Signaling Infrastructure

## Purpose
Defines the requirements for the signaling server (port, protocol, health check).

## Requirements

### Requirement: WebSocket Signaling
The signaling server SHALL accept WebSocket connections and route messages between peers in the same room.

#### Scenario: Peer connection
- **WHEN** a client connects via WebSocket
- **THEN** the connection is accepted and kept open

#### Scenario: Message routing
- **WHEN** a client sends a signaling message for a specific topic (room)
- **THEN** the server broadcasts it to other clients subscribed to that topic

### Requirement: Configuration
The signaling server SHALL listen on a configurable port.

#### Scenario: Default Port
- **WHEN** no port is specified
- **THEN** the server listens on port 4444

#### Scenario: Environment Variable
- **WHEN** `PORT` env var is set
- **THEN** the server listens on that port
