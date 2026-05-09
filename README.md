# DEWR Workforce Event Simulation

Synthetic workforce and labour-market event producer for the DEWR Workforce Pathways Intelligence prototype.

## Event stream

The simulator emits regional employment, skills gap, training completion and participant outcome
events to the services API.

Default target:

```bash
WORKFORCE_TARGET_URL=http://localhost:4000/api/v1/workforce-intelligence/events
```

## Run

```bash
pnpm install
pnpm start
pnpm test
```

Use `POST /simulation/tick` to publish one event batch, or `POST /simulation/start` to run a loop.

## Configuration

The simulator is configured via environment variables in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4100` | Server port |
| `SIMULATION_INTERVAL_MS` | `2500` | Milliseconds between ticks when simulation loop is running |
| `SIMULATION_EVENT_BATCH_SIZE` | `4` | Number of synthetic events to generate per tick |
| `SIMULATION_AUTOSTART` | `false` | Set to `true` to auto-start the simulation loop on server startup |
| `WORKFORCE_TARGET_URL` | `http://localhost:4000/api/v1/workforce-intelligence/events` | Target endpoint for publishing events |

Note: The simulator expects `dewr-workforce-intelligence-services` to be running and reachable at `WORKFORCE_TARGET_URL` (default: `http://localhost:4000/api/v1/workforce-intelligence/events`).

If auto-start is enabled and the target service is unavailable, startup will fail with a friendly message asking you to start the dependency first.

Shared DTO contracts are kept in `src/shared/contracts` so the event producer, tests and future
API clients use the same DEWR workforce vocabulary.
