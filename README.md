# DEWR Workforce Event Simulation

Synthetic workforce and labour-market event producer for the DEWR Workforce Pathways Intelligence prototype.

## What it demonstrates

- Event producer service that publishes REST-shaped workforce events to the intelligence API.
- Shared DTO contracts for producer, tests and future API clients.
- Configurable simulation ticks, batch size and auto-start behavior.
- Contract tests for generated events and publishing behavior.
- Docker and CI evidence for repeatable delivery.

## Architecture

The simulator keeps event generation separate from transport concerns:

- `src/server.ts`: application entrypoint.
- `src/app.ts`: Express app, middleware and route registration.
- `src/modules/simulation`: simulation routes, controller, service and types.
- `src/shared/contracts`: workforce event and simulation DTO contracts.
- `docs/EVENT-PRODUCER.md`: event payload notes and publishing flow.

## Prerequisites

- Node.js 20.19+
- pnpm 8.15.5, managed via Corepack
- Docker, for container review
- `dewr-workforce-intelligence-services`, required when publishing events to the API

## Local setup

```bash
pnpm install
pnpm dev
```

The simulator runs at `http://localhost:4100`.

Useful local checks:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Use `POST /simulation/tick` to publish one event batch, or `POST /simulation/start` to run a loop.

## Docker

Start `dewr-workforce-intelligence-services` first on port `4000`, then run:

```bash
docker build -t dewr-workforce-event-simulation:local .
docker run --rm -p 4100:4100 \
  -e WORKFORCE_TARGET_URL=http://host.docker.internal:4000/api/v1/workforce-intelligence/events \
  dewr-workforce-event-simulation:local
```

Container URL: `http://localhost:4100`.

## Endpoints

- `GET /health`: simulator health check.
- `GET /simulation/state`: current simulation state.
- `GET /simulation/snapshot`: generated event and configuration snapshot.
- `POST /simulation/tick`: generate and publish one event batch.
- `POST /simulation/start`: start the simulation loop.
- `POST /simulation/stop`: stop the simulation loop.
- `POST /simulation/reset`: reset generated simulation state.

## Configuration

The simulator is configured via environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4100` | Server port |
| `SIMULATION_INTERVAL_MS` | `2500` | Milliseconds between ticks when the loop is running |
| `SIMULATION_EVENT_BATCH_SIZE` | `4` | Number of synthetic events generated per tick |
| `SIMULATION_AUTOSTART` | `false` | Set to `true` to auto-start the loop on startup |
| `WORKFORCE_TARGET_URL` | `http://127.0.0.1:4000/api/v1/workforce-intelligence/events` | Target endpoint for publishing events |

If auto-start is enabled and the target service is unavailable, startup fails with a friendly dependency message.

## CI / GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `main`, pull requests to `main`, and manual dispatch.

The workflow uses Node.js 20.19.0 and Corepack-managed `pnpm@8.15.5`, then runs:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Docker image build as `dewr-workforce-event-simulation:ci`

## npm scripts

| Script | Description |
| --- | --- |
| `dev` | Start development server with hot reload |
| `build` | Compile TypeScript into `dist` |
| `start` | Start the compiled production server |
| `lint` | Run ESLint against `src` |
| `test` | Run simulation contract tests |
| `typecheck` | Type-check without emitting files |

## Troubleshooting

- Start `dewr-workforce-intelligence-services` before publishing ticks.
- Use `WORKFORCE_TARGET_URL=http://host.docker.internal:4000/api/v1/workforce-intelligence/events` from Docker Desktop containers.
- Keep `SIMULATION_AUTOSTART=false` during dependency setup if you want the service to start even when the API is unavailable.
