# Spec: Signaling Infrastructure

## Purpose

Defines the requirements for the signaling server (port, protocol, health check).

## Requirements

### Requirement: WebSocket Signaling

The signaling server SHALL accept WebSocket connections and route messages between peers in the same room. The WebSocket server SHALL be attached to an HTTP server (rather than listening standalone) so that both HTTP and WebSocket traffic share a single port.

#### Scenario: Peer connection

- **WHEN** a client connects via WebSocket
- **THEN** the connection is accepted and kept open

#### Scenario: Message routing

- **WHEN** a client sends a signaling message for a specific topic (room)
- **THEN** the server broadcasts it to other clients subscribed to that topic

### Requirement: HTTP Health Endpoint

The signaling server SHALL expose an HTTP `GET /health` endpoint on the same port as the WebSocket server.

#### Scenario: Health check success

- **WHEN** an HTTP `GET` request is sent to `/health`
- **THEN** the server responds with status `200`
- **AND** the response body is `{ "status": "ok" }`
- **AND** the `Content-Type` header is `application/json`

#### Scenario: Unknown HTTP route

- **WHEN** an HTTP request is sent to any path other than `/health`
- **THEN** the server responds with status `404`

#### Scenario: WebSocket upgrade unaffected

- **WHEN** a WebSocket upgrade request is sent to the server
- **THEN** the connection is upgraded to WebSocket as before
- **AND** existing signaling behavior (subscribe, publish, unsubscribe, ping) is unchanged

### Requirement: Configuration

The signaling server SHALL listen on a configurable port.

#### Scenario: Default Port

- **WHEN** no port is specified
- **THEN** the server listens on port 4444

#### Scenario: Environment Variable

- **WHEN** `PORT` env var is set
- **THEN** the server listens on that port

### Requirement: Message Type Safety

The signaling server SHALL use typed message parsing (`{ type?: string; topics?: string[]; topic?: string }`) instead of `any` for incoming WebSocket messages.
