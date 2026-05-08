# Workforce event producer

This service replaces truck telemetry with synthetic labour-market and participant pathway events.

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
