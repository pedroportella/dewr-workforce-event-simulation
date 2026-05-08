# Workforce event producer

This service produces synthetic labour-market and participant pathway events.

## Target

`WORKFORCE_TARGET_URL` defaults to:

`http://localhost:4000/api/v1/workforce-intelligence/events`

## Event families

- `RegionalEmploymentChanged`
- `SkillsGapMeasured`
- `TrainingCompletionRecorded`
- `ParticipantOutcomeRecorded`

The payload is intentionally REST and DTO friendly so it can be consumed by the services API,
persisted into SQL Server-style tables, and replayed in automated tests.

## Shared contracts

Domain contracts live in `src/shared/contracts`:

- `workforce-event-contracts.ts` defines the REST event batch sent to the services API.
- `workforce-simulation-contracts.ts` defines the simulation state, snapshot and command response DTOs.

These contracts intentionally use DEWR workforce language only: regions, cohorts, employment,
skills, training and participant outcomes.
