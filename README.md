# DEWR Workforce Event Simulation

Synthetic workforce and labour-market event producer refactored from the tracking simulation base.

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
