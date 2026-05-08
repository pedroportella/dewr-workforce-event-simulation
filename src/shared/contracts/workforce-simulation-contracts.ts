import type { WorkforceEventRequestDto } from './workforce-event-contracts.js';

export interface WorkforceSimulationStateDto {
  isRunning: boolean;
  tickIntervalMs: number;
  simulationTick: number;
  eventBatchSize: number;
  targetUrl: string;
  updatedAtUtc: string;
}

export interface WorkforceSimulationSnapshotDto {
  simulation: WorkforceSimulationStateDto;
  latestEvents: WorkforceEventRequestDto[];
  snapshotTakenAtUtc: string;
}

export interface WorkforceSimulationCommandResponseDto {
  message: string;
  snapshot: WorkforceSimulationSnapshotDto;
}
