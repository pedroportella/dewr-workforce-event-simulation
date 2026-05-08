import type {
  SimulationCommandResponseDto,
  SimulationSnapshotDto,
  SimulationStateDto,
  WorkforceEventRequest
} from './simulation.types.js';
import { randomUUID } from 'node:crypto';

const DEFAULT_TICK_INTERVAL_MS = Number(process.env.SIMULATION_INTERVAL_MS || 2500);
const DEFAULT_EVENT_BATCH_SIZE = Math.max(1, Number(process.env.SIMULATION_EVENT_BATCH_SIZE || 4));
const AUTO_START_SIMULATION = `${process.env.SIMULATION_AUTOSTART ?? 'false'}` === 'true';
const WORKFORCE_TARGET_URL = (
  process.env.WORKFORCE_TARGET_URL ||
  'http://localhost:4000/api/v1/workforce-intelligence/events'
).replace(/\/$/, '');

const regions = [
  ['sa4-brisbane-inner', 'Brisbane Inner City', 'QLD', 'Health care and social assistance', 'all'],
  ['sa4-logan-beaudesert', 'Logan - Beaudesert', 'QLD', 'Construction', 'participant'],
  ['sa4-townsville', 'Townsville', 'QLD', 'Manufacturing', 'youth'],
  ['sa4-mandurah', 'Mandurah', 'WA', 'Accommodation and food services', 'matureAge'],
  ['sa4-northern-territory-outback', 'Northern Territory - Outback', 'NT', 'Public administration and safety', 'firstNations']
] as const;

const eventTypes = [
  'RegionalEmploymentChanged',
  'SkillsGapMeasured',
  'TrainingCompletionRecorded',
  'ParticipantOutcomeRecorded'
] as const;

const state: SimulationStateDto = {
  isRunning: false,
  tickIntervalMs: DEFAULT_TICK_INTERVAL_MS,
  simulationTick: 0,
  eventBatchSize: DEFAULT_EVENT_BATCH_SIZE,
  targetUrl: WORKFORCE_TARGET_URL,
  updatedAtUtc: new Date().toISOString()
};

let timer: NodeJS.Timeout | null = null;
let latestEvents: WorkforceEventRequest[] = [];

function jitter(base: number, spread: number) {
  return Number((base + (Math.random() - 0.5) * spread).toFixed(1));
}

export function buildSyntheticEvents(batchSize = state.eventBatchSize): WorkforceEventRequest[] {
  return Array.from({ length: batchSize }, (_value, index) => {
    const region = regions[(state.simulationTick + index) % regions.length];
    const eventType = eventTypes[(state.simulationTick + index) % eventTypes.length];

    return {
      eventId: randomUUID(),
      eventType,
      occurredAt: new Date().toISOString(),
      regionId: region[0],
      regionName: region[1],
      state: region[2],
      primaryIndustry: region[3],
      cohort: region[4],
      employmentRatePercent: jitter(62, 14),
      vacancies: Math.max(120, Math.round(jitter(1600, 2200))),
      skillsGapIndex: Math.max(25, Math.round(jitter(62, 28))),
      trainingCompletions: Math.max(20, Math.round(jitter(780, 900))),
      sustainedOutcomeRatePercent: jitter(51, 18),
      participantCount: Math.max(300, Math.round(jitter(5200, 5600)))
    };
  });
}

async function publishEvents(events: WorkforceEventRequest[]) {
  await fetch(WORKFORCE_TARGET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events })
  });
}

function snapshot(): SimulationSnapshotDto {
  return {
    simulation: state,
    latestEvents,
    snapshotTakenAtUtc: new Date().toISOString()
  };
}

function command(message: string): SimulationCommandResponseDto {
  return { message, snapshot: snapshot() };
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export async function initializeSimulation(): Promise<void> {
  latestEvents = buildSyntheticEvents();
  state.updatedAtUtc = new Date().toISOString();
  if (AUTO_START_SIMULATION) startSimulationLoop();
}

export async function getSimulationSnapshot(): Promise<SimulationSnapshotDto> {
  return snapshot();
}

export async function getSimulationState(): Promise<SimulationStateDto> {
  return state;
}

export async function tickSimulation(): Promise<SimulationCommandResponseDto> {
  state.simulationTick += 1;
  state.updatedAtUtc = new Date().toISOString();
  latestEvents = buildSyntheticEvents();
  await publishEvents(latestEvents);
  return command('Published synthetic workforce event batch.');
}

export async function resetSimulation(): Promise<SimulationCommandResponseDto> {
  state.simulationTick = 0;
  state.updatedAtUtc = new Date().toISOString();
  latestEvents = buildSyntheticEvents();
  return command('Workforce event simulation has been reset.');
}

function startSimulationLoop(): void {
  if (state.isRunning) return;
  state.isRunning = true;
  state.updatedAtUtc = new Date().toISOString();
  timer = setInterval(() => {
    void tickSimulation();
  }, state.tickIntervalMs);
}

export async function startSimulation(): Promise<SimulationCommandResponseDto> {
  startSimulationLoop();
  return command('Workforce event simulation started.');
}

export async function stopSimulation(): Promise<SimulationCommandResponseDto> {
  stopTimer();
  state.isRunning = false;
  state.updatedAtUtc = new Date().toISOString();
  return command('Workforce event simulation stopped.');
}
