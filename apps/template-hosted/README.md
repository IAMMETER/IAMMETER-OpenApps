# Hosted App Template

This is a template for IAMMETER App Center **hosted apps**.

## What it includes
- Frontend: receives config via `postMessage` and connects to `wss://<host>/ws`
- Backend: provides:
  - `GET /health`
  - `WS /ws`

## Config
The App Center will send config like:
```json
{ "sn": "...", "token": "..." }